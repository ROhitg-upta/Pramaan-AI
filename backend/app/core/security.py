"""
Pramaan AI — FastAPI Security & JWT Token Verification
Compatible with Next.js 'jose' HS256 signed session tokens
"""

import hmac
import hashlib
import base64
import json
import time
import os
from typing import Optional, Dict, Any
from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

AUTH_SECRET = os.getenv("AUTH_SECRET", "")
IS_AUTH_CONFIGURED = len(AUTH_SECRET) >= 16

bearer_scheme = HTTPBearer(auto_error=False)

def base64url_decode(input_str: str) -> bytes:
    rem = len(input_str) % 4
    if rem > 0:
        input_str += "=" * (4 - rem)
    return base64.urlsafe_b64decode(input_str)

def verify_jwt_token(token: str) -> Dict[str, Any]:
    if not IS_AUTH_CONFIGURED:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AUTH_NOT_CONFIGURED: AUTH_SECRET is not configured on server."
        )

    parts = token.split(".")
    if len(parts) != 3:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid JWT token format."
        )

    header_b64, payload_b64, signature_b64 = parts

    # Compute expected signature
    signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
    expected_sig = hmac.new(AUTH_SECRET.encode("utf-8"), signing_input, hashlib.sha256).digest()
    actual_sig = base64url_decode(signature_b64)

    if not hmac.compare_digest(expected_sig, actual_sig):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="JWT signature verification failed."
        )

    # Decode payload
    payload_bytes = base64url_decode(payload_b64)
    payload = json.loads(payload_bytes.decode("utf-8"))

    # Check expiration
    exp = payload.get("exp")
    if exp and time.time() > exp:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="JWT token has expired."
        )

    return payload

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme)) -> Dict[str, Any]:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials required."
        )
    return verify_jwt_token(credentials.credentials)

def require_evaluator(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    role = current_user.get("role")
    is_verified = current_user.get("isInstitutionVerified", False)

    if role != "EVALUATOR" or not is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Institutional Evaluator privileges require server verification."
        )

    return current_user

def verify_assessment_evaluator_access(
    current_user: Dict[str, Any],
    assigned_evaluator_id: Optional[str] = None,
    institution_id: Optional[str] = None,
) -> bool:
    """
    Enforces resource-scoped evaluator access.
    Institutional verification alone does not grant access to every assessment.
    Requires explicit assigned evaluator ID or matching server-managed institution ID.
    Free-text organization name equality is strictly rejected.
    """
    role = current_user.get("role")
    is_verified = current_user.get("isInstitutionVerified", False)
    if role != "EVALUATOR" or not is_verified:
        return False

    user_id = current_user.get("userId")
    user_inst = current_user.get("institutionId")

    if assigned_evaluator_id and user_id == assigned_evaluator_id:
        return True

    if institution_id and user_inst and user_inst == institution_id:
        return True

    return False

