from fastapi import APIRouter
from app.api.v1.analyze import router as analyze_router
from app.api.v1.viva import router as viva_router

api_router = APIRouter()
api_router.include_router(analyze_router, prefix="/analyze", tags=["Analyze & Forensics"])
api_router.include_router(viva_router, prefix="/viva", tags=["Autonomous Viva Defense"])
