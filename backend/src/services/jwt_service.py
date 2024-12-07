from datetime import datetime, timedelta

import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from config import Settings

security = HTTPBearer()


class JWTService:
    def __init__(self):
        self.secret_key = Settings.SECRET_KEY
        self.algorithm = Settings.ALGORITHM

    def create_jwt_token(self, user_id: str, role: str) -> str:
        payload = {
            "user_id": user_id,
            "role": role,
            "exp": datetime.now() + timedelta(hours=1),
        }
        token = jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
        return token

    def decode_jwt_token(self, token: str) -> dict:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token has expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")

    def get_current_user(self, token: HTTPAuthorizationCredentials = Security(security)):
        jwt_data = self.decode_jwt_token(token.credentials)
        if "user_id" not in jwt_data or "role" not in jwt_data:
            raise HTTPException(status_code=401, detail="Invalid token")
        return jwt_data


jwt_service = JWTService()
