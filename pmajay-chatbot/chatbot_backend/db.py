from sqlalchemy import create_engine, Column, Integer, String, Float, Date, DateTime, Text, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime
import os

DATABASE_URL = "sqlite:///./pmajay.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, index=True)
    name = Column(String(200))
    state = Column(String(50))
    district = Column(String(50))
    component = Column(String(50))
    budget_allocated = Column(Float, default=0.0)
    budget_utilized = Column(Float, default=0.0)
    last_utilization_date = Column(Date, nullable=True)
    status = Column(String(20), default="ongoing")
    updates = relationship("FundUpdate", back_populates="project")

class FundUpdate(Base):
    __tablename__ = "fund_updates"
    id = Column(Integer, primary_key=True, index=True)
    project_code = Column(String(20), ForeignKey("projects.code"))
    update_date = Column(Date)
    event_type = Column(String(30))
    amount = Column(Float, nullable=True)
    description = Column(Text)
    project = relationship("Project", back_populates="updates")

class Beneficiary(Base):
    __tablename__ = "beneficiaries"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    aadhaar_hash = Column(String(64))
    category = Column(String(10), default="SC")
    state = Column(String(50))
    district = Column(String(50))
    project_code = Column(String(20), ForeignKey("projects.code"))
    application_status = Column(String(30), default="applied")
    last_payment_status = Column(String(50), nullable=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    action_by = Column(String(50))
    action_type = Column(String(50))
    project_code = Column(String(20))
    details = Column(Text)
    ip_address = Column(String(20))

# --- NEW TABLE: GRIEVANCES ---
class Grievance(Base):
    __tablename__ = "grievances"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50)) # "Ben_1"
    category = Column(String(50)) # "Payment Delay", "Rejection"
    description = Column(Text)
    status = Column(String(20), default="Open")
    created_at = Column(DateTime, default=datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()