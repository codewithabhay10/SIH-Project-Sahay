from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from typing import Literal, Optional, List
from datetime import date
import os

# Database Imports
from db import (
    SessionLocal, 
    init_db, 
    Project, 
    FundUpdate, 
    Beneficiary, 
    AuditLog, 
    Grievance, 
    get_db
)
from chat_logic import handle_beneficiary_chat, handle_official_chat
from rag import index_docs_if_empty, retrieve_texts

# Initialize App
app = FastAPI(title="PM-AJAY Sahayak", description="Hackathon Demo")

# CORS Middleware (Unlocks Frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows browser to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Admin Key for Officials
ADMIN_KEY = "hackathon123"

# --- 1. STARTUP EVENT (Seed Data) ---
@app.on_event("startup")
async def startup_event():
    init_db()
    index_docs_if_empty()
    
    db = next(get_db())
    if not db.query(Project).first():
        # Seed Project
        project = Project(
            code="UP-GIA-001",
            name="Lucknow SC Youth Skill Development Program",
            state="Uttar Pradesh",
            district="Lucknow",
            component="Grant-in-Aid",
            budget_allocated=25000000.0,  
            budget_utilized=7500000.0,    
            status="ongoing"
        )
        db.add(project)
        
        # Seed Beneficiary
        ben = Beneficiary(
            name="Ramesh Kumar",
            aadhaar_hash="abc123hash",
            state="Uttar Pradesh",
            district="Lucknow",
            project_code="UP-GIA-001",
            application_status="approved",
            last_payment_status="Credited on 2025-11-20: ₹10,000 stipend"
        )
        db.add(ben)
        db.commit()
    db.close()

# --- 2. API MODELS (Pydantic) ---
class ChatRequest(BaseModel):
    role: Literal["beneficiary", "official"]
    user_id: Optional[str] = None  
    message: str = Field(..., min_length=1, max_length=1000)

class ChatResponse(BaseModel):
    answer: str

class FundUpdateIn(BaseModel):
    project_code: str
    update_date: date
    event_type: Literal["release", "utilization_deadline", "utilization_update", "note"]
    amount: Optional[float] = None
    description: str
    admin_key: str

class FundUpdateOut(BaseModel):
    id: int
    project_code: str
    event_type: str
    amount: Optional[float]
    description: str

class GrievanceIn(BaseModel):
    user_id: str
    category: str
    description: str

class ProjectsList(BaseModel):
    projects: List[dict]

# --- 3. OFFICIAL ENDPOINTS ---

@app.post("/official/update-funds", response_model=FundUpdateOut)
async def add_fund_update(update: FundUpdateIn, request: Request, db=Depends(get_db)):
    """Add fund update AND record in Audit Log"""
    if update.admin_key != ADMIN_KEY:
        raise HTTPException(status_code=401, detail="Invalid admin key")
    
    project = db.query(Project).filter(Project.code == update.project_code).first()
    if not project:
        raise HTTPException(status_code=404, detail=f"Project {update.project_code} not found")
    
    # A. Add Update
    fund_update = FundUpdate(
        project_code=update.project_code,
        update_date=update.update_date,
        event_type=update.event_type,
        amount=update.amount,
        description=update.description
    )
    db.add(fund_update)
    
    # B. Add Audit Log (The "Black Box")
    client_ip = request.client.host if request.client else "Unknown"
    audit_entry = AuditLog(
        action_by="Official_Admin",
        action_type=f"UPDATE_{update.event_type.upper()}",
        project_code=update.project_code,
        details=f"Desc: {update.description} | Amt: {update.amount}",
        ip_address=client_ip
    )
    db.add(audit_entry)

    db.commit()
    db.refresh(fund_update)
    
    return FundUpdateOut(
        id=fund_update.id,
        project_code=fund_update.project_code,
        event_type=fund_update.event_type,
        amount=fund_update.amount,
        description=fund_update.description
    )

@app.get("/audit/logs")
async def view_audit_logs(admin_key: str, db=Depends(get_db)):
    """View Transparency Logs"""
    if admin_key != ADMIN_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()

# --- 4. BENEFICIARY ENDPOINTS ---

@app.post("/file-complaint")
async def file_complaint(complaint: GrievanceIn, db=Depends(get_db)):
    """File a new grievance"""
    new_ticket = Grievance(
        user_id=complaint.user_id,
        category=complaint.category,
        description=complaint.description,
        status="Open"
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return {"status": "success", "ticket_id": new_ticket.id}

# --- 5. CHAT ENDPOINT ---

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if request.role == "beneficiary":
        answer = handle_beneficiary_chat(request.message, request.user_id)
    else: 
        answer = handle_official_chat(request.message, request.user_id)
    
    return ChatResponse(answer=answer)

# --- 6. UTILITY ENDPOINTS ---

@app.get("/projects", response_model=ProjectsList)
async def get_projects(db=Depends(get_db)):
    projects = db.query(Project).all()
    return ProjectsList(
        projects=[{
            "code": p.code,
            "name": p.name,
            "state": p.state,
            "district": p.district,
            "component": p.component,
            "budget_allocated": p.budget_allocated,
            "budget_utilized": p.budget_utilized,
            "status": p.status
        } for p in projects]
    )

@app.get("/")
async def root():
    return {"status": "PM-AJAY Chatbot Online", "version": "1.0.0"}