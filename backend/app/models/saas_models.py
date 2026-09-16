"""
Pramaan AI — SaaS Enterprise Database Models (SQLAlchemy / PostgreSQL)
Matches Module 10 Prisma schema 1:1 for FastAPI backend persistence.
"""

import enum
import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    DateTime,
    Text,
    JSON,
    ForeignKey,
    Enum as SqlEnum,
)
from sqlalchemy.orm import relationship
from app.models.db_models import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class UserRole(str, enum.Enum):
    STUDENT = "STUDENT"
    EVALUATOR = "EVALUATOR"
    ADMIN = "ADMIN"

class VivaStatus(str, enum.Enum):
    SCHEDULED = "SCHEDULED"
    WAITING = "WAITING"
    IN_PROGRESS = "IN_PROGRESS"
    UNDER_REVIEW = "UNDER_REVIEW"
    VERIFIED = "VERIFIED"
    FLAGGED = "FLAGGED"

class OrganizationModel(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    domain = Column(String, unique=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("UserModel", back_populates="organization")
    audits = relationship("AuditModel", back_populates="organization")

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    full_name = Column(String, nullable=False)
    role = Column(SqlEnum(UserRole), default=UserRole.STUDENT, nullable=False)
    github_username = Column(String, unique=True, nullable=True)
    avatar_url = Column(String, nullable=True)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    organization = relationship("OrganizationModel", back_populates="users")
    evaluator_audits = relationship("AuditModel", back_populates="evaluator", foreign_keys="AuditModel.evaluator_id")
    student_vivas = relationship("VivaSessionModel", back_populates="student", foreign_keys="VivaSessionModel.student_id")
    evaluated_vivas = relationship("VivaSessionModel", back_populates="evaluator", foreign_keys="VivaSessionModel.evaluator_id")

class AuditModel(Base):
    __tablename__ = "audits"

    id = Column(String, primary_key=True, default=generate_uuid)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=True)
    evaluator_id = Column(String, ForeignKey("users.id"), nullable=False)
    repo_url = Column(String, nullable=False)
    repo_name = Column(String, nullable=False)
    branch = Column(String, default="main")
    total_commits = Column(Integer, default=0)
    total_lines_audited = Column(Integer, default=0)
    total_files = Column(Integer, default=0)
    integrity_grade = Column(String, default="PENDING")
    overall_pramaan_score = Column(Float, nullable=True)
    executive_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("OrganizationModel", back_populates="audits")
    evaluator = relationship("UserModel", back_populates="evaluator_audits", foreign_keys=[evaluator_id])
    contributors = relationship("AuditContributorModel", back_populates="audit", cascade="all, delete-orphan")
    viva_sessions = relationship("VivaSessionModel", back_populates="audit", cascade="all, delete-orphan")

class AuditContributorModel(Base):
    __tablename__ = "audit_contributors"

    id = Column(String, primary_key=True, default=generate_uuid)
    audit_id = Column(String, ForeignKey("audits.id"), nullable=False)
    github_login = Column(String, nullable=False)
    display_name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    total_commits = Column(Integer, default=0)
    lines_added = Column(Integer, default=0)
    lines_deleted = Column(Integer, default=0)
    churn_ratio = Column(Float, default=0.0)
    tier_0_lines = Column(Integer, default=0)
    tier_1_lines = Column(Integer, default=0)
    tier_2_lines = Column(Integer, default=0)
    tier_3_lines = Column(Integer, default=0)
    git_forensics_score = Column(Float, default=0.0)
    ast_complexity_score = Column(Float, default=0.0)
    viva_defense_score = Column(Float, nullable=True)
    pramaan_score = Column(Float, nullable=True)
    verdict = Column(String, default="PENDING_VIVA")
    radar_axes = Column(JSON, default=dict)
    anomaly_flags = Column(JSON, default=list)

    audit = relationship("AuditModel", back_populates="contributors")
    viva_session = relationship("VivaSessionModel", back_populates="contributor", uselist=False, cascade="all, delete-orphan")

class VivaSessionModel(Base):
    __tablename__ = "viva_sessions"

    id = Column(String, primary_key=True, default=generate_uuid)
    audit_id = Column(String, ForeignKey("audits.id"), nullable=False)
    contributor_id = Column(String, ForeignKey("audit_contributors.id"), unique=True, nullable=False)
    student_id = Column(String, ForeignKey("users.id"), nullable=True)
    evaluator_id = Column(String, ForeignKey("users.id"), nullable=False)
    room_code = Column(String, unique=True, nullable=False, index=True)
    status = Column(SqlEnum(VivaStatus), default=VivaStatus.SCHEDULED, nullable=False)
    scheduled_at = Column(DateTime, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    certificate_hash = Column(String, nullable=True)
    final_score = Column(Float, nullable=True)
    evaluator_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    audit = relationship("AuditModel", back_populates="viva_sessions")
    contributor = relationship("AuditContributorModel", back_populates="viva_session")
    student = relationship("UserModel", back_populates="student_vivas", foreign_keys=[student_id])
    evaluator = relationship("UserModel", back_populates="evaluated_vivas", foreign_keys=[evaluator_id])
    exchanges = relationship("VivaExchangeModel", back_populates="session", cascade="all, delete-orphan")

class VivaExchangeModel(Base):
    __tablename__ = "viva_exchanges"

    id = Column(String, primary_key=True, default=generate_uuid)
    session_id = Column(String, ForeignKey("viva_sessions.id"), nullable=False)
    question_index = Column(Integer, nullable=False)
    category = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    referenced_lines = Column(JSON, default=list)
    code_snippet = Column(Text, nullable=False)
    question_text = Column(Text, nullable=False)
    expected_concepts = Column(JSON, default=list)
    trap_signals = Column(JSON, default=list)
    student_answer = Column(Text, nullable=True)
    audio_recording_url = Column(String, nullable=True)
    latency_seconds = Column(Float, nullable=True)
    paste_detected = Column(Boolean, default=False)
    ai_score = Column(Float, nullable=True)
    evaluator_score = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("VivaSessionModel", back_populates="exchanges")
