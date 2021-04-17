from fastapi import BackgroundTasks, Depends, FastAPI, APIRouter, HTTPException, Request, Response
from fastapi.responses import HTMLResponse

from typing import List

from sqlalchemy.orm import Session

from ..database import crud, models, schemas
from ..dependencies import get_db
from ..verifier import verifier

router = APIRouter()

@router.get("/verifications/getall", tags=["verifications"], response_model=List[schemas.Verification])
async def get_all_verifications(db: Session = Depends(get_db)):
    accounts = crud.get_accounts(db, skip=0, limit=100)
    for account in accounts:
        account.last_verification = crud.get_last_account_verification(db, account_id = account.id)
    return accounts
    
@router.get("/verifications/get/{verification_id}", tags=["verifications"], response_model=schemas.Verification)
async def get_verification(verification_id: int, db: Session = Depends(get_db)):
    return crud.get_verification(db, verification_id=verification_id)
    
@router.get("/verifications/get_by_account/{account_id}", tags=["verifications"], response_model=List[schemas.Verification])
async def get_account_verifications(account_id: int, db: Session = Depends(get_db)):
    return crud.get_account_verifications(db, account_id = account_id)