import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, JSON, ForeignKey, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from app.core.config import settings

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class AnalysisRun(Base):
    __tablename__ = "analysis_runs"

    id = Column(String, primary_key=True, default=generate_uuid)
    repo_url = Column(String, nullable=False)
    branch = Column(String, default="main")
    status = Column(String, default="processing")  # processing, completed, failed
    progress_percent = Column(Integer, default=0)
    current_step = Column(String, default="Initializing...")
    total_commits = Column(Integer, default=0)
    total_lines = Column(Integer, default=0)
    total_files = Column(Integer, default=0)
    integrity_grade = Column(String, default="C")
    overall_pramaan_score = Column(Float, default=0.0)
    executive_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    contributors = relationship("ContributorRecord", back_populates="run", cascade="all, delete-orphan")
    timeline_events = relationship("TimelineEventRecord", back_populates="run", cascade="all, delete-orphan")
    anomalies = relationship("AnomalyRecord", back_populates="run", cascade="all, delete-orphan")

class ContributorRecord(Base):
    __tablename__ = "contributors"

    id = Column(String, primary_key=True, default=generate_uuid)
    analysis_id = Column(String, ForeignKey("analysis_runs.id"), nullable=False)
    primary_name = Column(String, nullable=False)
    emails = Column(JSON, default=list)
    avatar_color = Column(String, default="#10B981")
    total_commits = Column(Integer, default=0)
    lines_added = Column(Integer, default=0)
    lines_deleted = Column(Integer, default=0)
    churn_ratio = Column(Float, default=0.0)
    tier_0_lines = Column(Integer, default=0)
    tier_1_lines = Column(Integer, default=0)
    tier_2_lines = Column(Integer, default=0)
    tier_3_lines = Column(Integer, default=0)
    burstiness_score = Column(Float, default=0.0)
    git_forensics_score = Column(Float, default=0.0)
    ast_complexity_score = Column(Float, default=0.0)
    viva_defense_score = Column(Float, nullable=True)
    pramaan_score = Column(Float, default=0.0)
    verdict = Column(String, default="UNVERIFIED")  # VERIFIED_BUILDER, SUSPECT_FREELOADER, GHOST_CONTRIBUTOR
    radar_axes = Column(JSON, default=dict)

    run = relationship("AnalysisRun", back_populates="contributors")
    questions = relationship("VivaQuestionRecord", back_populates="contributor", cascade="all, delete-orphan")

class TimelineEventRecord(Base):
    __tablename__ = "timeline_events"

    id = Column(String, primary_key=True, default=generate_uuid)
    analysis_id = Column(String, ForeignKey("analysis_runs.id"), nullable=False)
    commit_hash = Column(String, nullable=False)
    author_name = Column(String, nullable=False)
    timestamp = Column(DateTime, nullable=False)
    message = Column(String, default="")
    lines_added = Column(Integer, default=0)
    lines_deleted = Column(Integer, default=0)
    files_changed = Column(Integer, default=0)
    is_anomalous = Column(Boolean, default=False)
    anomaly_type = Column(String, nullable=True)
    day_index = Column(Integer, default=1)

    run = relationship("AnalysisRun", back_populates="timeline_events")

class AnomalyRecord(Base):
    __tablename__ = "anomalies"

    id = Column(String, primary_key=True, default=generate_uuid)
    analysis_id = Column(String, ForeignKey("analysis_runs.id"), nullable=False)
    contributor_name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # FLAG_BIG_BANG, FLAG_ZERO_CHURN, etc.
    severity = Column(String, default="HIGH")  # CRITICAL, HIGH, MEDIUM
    commit_hash = Column(String, nullable=True)
    description = Column(String, nullable=False)
    details = Column(Text, nullable=False)
    timestamp = Column(DateTime, nullable=True)

    run = relationship("AnalysisRun", back_populates="anomalies")

class VivaQuestionRecord(Base):
    __tablename__ = "viva_questions"

    id = Column(String, primary_key=True, default=generate_uuid)
    contributor_id = Column(String, ForeignKey("contributors.id"), nullable=False)
    commit_hash = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    line_range = Column(String, default="1-30")
    code_snippet = Column(Text, nullable=False)
    category = Column(String, default="FAILURE_EDGE_CASE")
    difficulty = Column(String, default="Hard")
    question_text = Column(Text, nullable=False)
    expected_key_concepts = Column(JSON, default=list)
    trap_signals = Column(JSON, default=list)

    # Submission
    student_answer = Column(Text, nullable=True)
    score = Column(Float, nullable=True)
    technical_accuracy = Column(Float, nullable=True)
    authenticity_verdict = Column(String, nullable=True)
    feedback = Column(Text, nullable=True)
    answered_at = Column(DateTime, nullable=True)

    contributor = relationship("ContributorRecord", back_populates="questions")
