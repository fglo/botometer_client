from fastapi import BackgroundTasks, Depends, FastAPI, APIRouter, HTTPException, Request, Response
from fastapi.responses import HTMLResponse

from typing import List

from sqlalchemy.orm import Session

from ..database import crud, models, schemas
from ..dependencies import get_db
from ..verifier import verifier

router = APIRouter()

@router.get("/verifications/getall", tags=["verifications"], response_model=List[schemas.VerificationWithAccount])
async def get_all_verifications(db: Session = Depends(get_db)):
    verifications = crud.get_verifications(db)
    return verifications
    
@router.get("/verifications/get/{verification_id}", tags=["verifications"], response_model=schemas.VerificationWithAccount)
async def get_verification(verification_id: int, db: Session = Depends(get_db)):
    return crud.get_verification(db, verification_id=verification_id)
    
@router.get("/verifications/get_by_account/{account_id}", tags=["verifications"], response_model=List[schemas.VerificationWithAccount])
async def get_account_verifications(account_id: int, db: Session = Depends(get_db)):
    verifications = crud.get_account_verifications(db, account_id = account_id)
    if not verifications or len(verifications) == 0:
        verifications = crud.get_verifications(db)
    return verifications
