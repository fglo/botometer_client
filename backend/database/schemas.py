from typing import List, Optional

from pydantic import BaseModel

from datetime import datetime


class VerificationBase(BaseModel):
    date: datetime


class VerificationCreate(VerificationBase):
    pass


class Verification(VerificationBase):
    id: int
    account_id: int
    astroturf: Optional[bool]
    fake_follower: Optional[bool]
    financial: Optional[bool]
    other: Optional[bool]
    overall: Optional[bool]
    self_declared: Optional[bool]
    spammer: Optional[bool]
    language: Optional[str]
    screen_name: Optional[str]
    id_str: Optional[str]
    verification_result_json: Optional[str]
    no_timeline: Optional[bool]

    class Config:
        orm_mode = True


class AccountBase(BaseModel):
    url: str
    username: str
    firstname: Optional[str] = None
    lastname: Optional[str] = None

class AccountCreate(AccountBase):
    pass

class Account(AccountBase):
    id: int
    is_active: bool
    verified: bool
    valid: bool
    added: datetime

    class Config:
        orm_mode = True

class AccountWithLastVerification(Account):
    last_verification: Optional[Verification]

class AccountWithAllVerifications(Account):
    verifications: List[Verification] = []