from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from models import TransactionType


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class TransactionCreate(BaseModel):
    title: str
    amount: float
    type: TransactionType
    category: str
    date: Optional[datetime] = None


class TransactionUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    type: Optional[TransactionType] = None
    category: Optional[str] = None
    date: Optional[datetime] = None


class TransactionResponse(BaseModel):
    id: int
    title: str
    amount: float
    type: TransactionType
    category: str
    date: datetime
    user_id: int

    class Config:
        from_attributes = True
