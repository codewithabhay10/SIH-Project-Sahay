import os
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict

# Import your existing RAG system
from rag_system import PMAjayRAG
from analysis_sequential import run_scrutiny_audit

# Global instance
rag_system: Optional[PMAjayRAG] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager to handle startup and shutdown events.
    Initializes the RAG system only once when the app starts.
    """
    global rag_system
    print("🚀 Starting PM-AJAY RAG API...")
    try:
        # Initialize RAG (loads embeddings and connects to ChromaDB)
        rag_system = PMAjayRAG()
        print("✅ RAG System Initialized Successfully")
    except Exception as e:
        print(f"❌ Failed to initialize RAG System: {e}")
        raise e
    
    yield
    
    print("🛑 Shutting down PM-AJAY RAG API...")
    # Clean up resources if necessary (e.g. close DB connections)

app = FastAPI(
    title="PM-AJAY RAG Service",
    description="API for semantic search and retrieval over PM-AJAY scheme documents.",
    version="1.0.0",
    lifespan=lifespan
)

# --- Pydantic Models for Request/Response Validation ---

class QueryRequest(BaseModel):
    query: str
    k: int = 4
    filters: Optional[Dict[str, str]] = None

    class Config:
        json_schema_extra = {
            "example": {
                "query": "what are the components of the scheme?",
                "k": 3,
                "filters": {"category": "rules"}
            }
        }

class QueryResponse(BaseModel):
    query: str
    context: str
    status: str = "success"

class IngestResponse(BaseModel):
    message: str
    doc_count: int

# --- Endpoints ---

@app.get("/health")
async def health_check():
    """Health check endpoint to verify service status."""
    if rag_system and rag_system.vector_db:
        return {"status": "healthy", "service": "PM-AJAY RAG"}
    return {"status": "unhealthy", "reason": "RAG System not initialized"}

@app.post("/query", response_model=QueryResponse)
async def query_knowledge_base(request: QueryRequest):
    """
    Semantic search endpoint.
    Returns: Relevant text chunks formatted as context.
    """
    if not rag_system:
        raise HTTPException(status_code=503, detail="RAG System not initialized")

    try:
        # Call the existing query method from your class
        context_result = rag_system.query(
            query_text=request.query,
            k=request.k,
            filters=request.filters
        )
        
        return QueryResponse(
            query=request.query,
            context=context_result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")

@app.post("/ingest", response_model=IngestResponse)
async def trigger_ingestion():
    """
    Triggers the document ingestion process (parsing & chunking).
    This might take a while, so in production, this should be a background task.
    """
    if not rag_system:
        raise HTTPException(status_code=503, detail="RAG System not initialized")

    try:
        # Re-run ingestion
        rag_system.ingest_documents()
        
        # Get count
        count = rag_system.vector_db._collection.count()
        return IngestResponse(message="Ingestion completed successfully", doc_count=count)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")



@app.post("/analyze", response_model=Dict[str, str])
async def analyze_project(plan: Dict):
    """
    Triggers the sequential scrutiny analysis agent.
    Input: Full JSON project plan.
    Output: Audit Report.
    """
    try:
        report = run_scrutiny_audit(plan)
        return {"status": "success", "report": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    # For debugging directly
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
