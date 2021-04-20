from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship

from .database import Base

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True)
    username = Column(String)
    firstname = Column(String)
    lastname = Column(String)
    is_active = Column(Boolean, default=True)
    verified = Column(Boolean, default=False)
    valid = Column(Boolean, default=True)
    added = Column(DateTime)

    verifications = relationship("Verification", back_populates="account")

class Verification(Base):
    __tablename__ = "verifications"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"))
    date = Column(DateTime)

    astroturf = Column(Boolean, default=False)
    fake_follower = Column(Boolean, default=False)
    financial = Column(Boolean, default=False)
    other = Column(Boolean, default=False)
    overall = Column(Boolean, default=False)
    self_declared = Column(Boolean, default=False)
    spammer = Column(Boolean, default=False)
    language = Column(String)
    screen_name = Column(String)
    id_str = Column(String)
    no_timeline = Column(Boolean, default=False)
    account_doesnt_exist = Column(Boolean, default=False)

    done = Column(Boolean, default=False)
    verification_result_json = Column(String)

    account = relationship("Account", back_populates="verifications")