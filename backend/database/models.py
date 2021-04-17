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
    __tablename__ = "varifications"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"))
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
    verification_result_json = Column(String)
    no_timeline = Column(Boolean, default=False)
    date = Column(DateTime)

    account = relationship("Account", back_populates="verifications")