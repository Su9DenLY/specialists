from uuid import UUID
from enum import Enum
from datetime import datetime
from typing import Optional


class UserRole(str, Enum):
    CUSTOMER = "customer"
    SPECIALIST = "specialist"
    ADMIN = "admin"


class User:
    def __init__(self, user_id: UUID, email: str, password_hash: str, role: UserRole, created_at: datetime = None):
        self.user_id = user_id
        self.email = email
        self.password_hash = password_hash
        self.role = role
        self.created_at = created_at or datetime.now()
       