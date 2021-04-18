from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
from datetime import datetime

from . import models, schemas


def get_account(db: Session, account_id: int):
    return db.query(models.Account).filter(models.Account.id == account_id).first()


def get_account_by_accountname(db: Session, username: str):
    return db.query(models.Account).filter(models.Account.username == username).first()


def get_account_by_accounturl(db: Session, url: str):
    return db.query(models.Account).filter(models.Account.url == url).first()


def get_accounts(db: Session, skip: int = 0, limit: int = 10000):
    return db.query(models.Account).filter(models.Account.is_active == True).offset(skip).limit(limit).all()


def get_archived_accounts(db: Session, skip: int = 0, limit: int = 10000):
    return db.query(models.Account).filter(models.Account.is_active == False).offset(skip).limit(limit).all()


def create_account(db: Session, account: schemas.AccountCreate):
    db_account = models.Account(**account.dict(), added=datetime.now())
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account.id
    

def update_account(db: Session, account: schemas.Account):
    db_account = db.query(models.Account).filter(models.Account.id == account.id).first()
    db_account.verified = account.verified
    db_account.valid = account.valid
    db.commit()
    db.refresh(db_account)
    return db_account.id

    
def archive_account(db: Session, account_id: int):
    db_account = db.query(models.Account).filter(models.Account.id == account_id).first()
    db_account.is_active = False
    db.commit()
    db.refresh(db_account)
    return db_account.id
    
    
def restore_account(db: Session, account_id: int):
    db_account = db.query(models.Account).filter(models.Account.id == account_id).first()
    db_account.is_active = True
    db.commit()
    db.refresh(db_account)
    return db_account.id


def get_verifications(db: Session, skip: int = 0, limit: int = 10000):
    return db.query(models.Verification).offset(skip).limit(limit).all()


def get_account_verifications(db: Session, account_id: int, skip: int = 0, limit: int = 10000):
    return db.query(models.Verification).filter(models.Verification.account_id == account_id).offset(skip).limit(limit).all()


def get_last_account_verification(db: Session, account_id: int):
    return db.query(models.Verification).filter(models.Verification.account_id == account_id).order_by(desc(models.Verification.date)).first()


def get_verification(db: Session, verification_id: int):
    return db.query(models.Verification).filter(models.Verification.id == verification_id).first()


def create_account_verification(db: Session, account_id: int):
    db_verification = models.Verification(date=datetime.now(), account_id=account_id)
    db.add(db_verification)
    db.commit()
    db.refresh(db_verification)
    return db_verification.id


def update_account_verification(db: Session, verification: schemas.Verification):
    db_verification = db.query(models.Verification).filter(models.Verification.id == verification.id).first()

    db_verification.astroturf = verification.astroturf
    db_verification.fake_follower = verification.fake_follower
    db_verification.financial = verification.financial
    db_verification.other = verification.other
    db_verification.overall = verification.overall
    db_verification.self_declared = verification.self_declared
    db_verification.spammer = verification.spammer
    db_verification.language = verification.language
    db_verification.screen_name = verification.screen_name
    db_verification.verification_result_json = verification.verification_result_json
    db_verification.no_timeline = verification.no_timeline

    db.commit()
    db.refresh(db_verification)
    return db_verification.id