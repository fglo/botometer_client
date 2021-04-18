from fastapi import BackgroundTasks, Depends, FastAPI, APIRouter, HTTPException, Request, Response
from fastapi.responses import HTMLResponse

from typing import List

from sqlalchemy.orm import Session

from ..database import crud, models, schemas
from ..dependencies import get_db
from ..verifier import verifier

router = APIRouter()

@router.get("/accounts/getall", tags=["accounts"], response_model=List[schemas.AccountWithLastVerification])
async def get_all_accounts(db: Session = Depends(get_db)):
    accounts = crud.get_accounts(db)
    for account in accounts:
        account.last_verification = crud.get_last_account_verification(db, account_id = account.id)
    return accounts
    
@router.get("/accounts/getallarchived", tags=["accounts"], response_model=List[schemas.AccountWithLastVerification])
async def get_all_archived_accounts(db: Session = Depends(get_db)):
    accounts = crud.get_archived_accounts(db)
    for account in accounts:
        account.last_verification = crud.get_last_account_verification(db, account_id = account.id)
    return accounts
    
@router.get("/accounts/get/{account_id}", tags=["accounts"], response_model=schemas.AccountWithLastVerification)
async def get_account(account_id: int, db: Session = Depends(get_db)):
    account = crud.get_account(db, account_id=account_id)
    account.last_verification = crud.get_last_account_verification(db, account_id = account.id)
    return account

@router.get("/accounts/getmore/{account_id}", tags=["accounts"], response_model=schemas.AccountWithAllVerifications)
async def get_account_with_more(account_id: int, db: Session = Depends(get_db)):
    account = crud.get_account(db, account_id=account_id)
    return account

@router.get("/accounts/verify/{account_id}", tags=["accounts"], response_model=int)
async def verify_account(account_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    account = crud.get_account(db, account_id=account_id)
    if account:
        verification_id = crud.create_account_verification(db, account_id)
        background_tasks.add_task(verifier.verify_account, account.username, verification_id)
        return verification_id
    else:
        raise HTTPException(status_code=400, detail="Account doesn't exist.")

@router.post("/accounts/verify", tags=["accounts"])
async def verify_accounts(account_ids: List[int], background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    verification_ids = []
    for account_id in account_ids:
        account = crud.get_account(db, account_id=account_id)
        if account:
            verification_ids.append(crud.create_account_verification(db, account_id))
        else:
            raise HTTPException(status_code=400, detail=f"Account with id = {account_id} doesn't exist.")

    for verification_id in verification_ids:
        account_verification = crud.get_verification(db, verification_id=verification_id)
        account = crud.get_account(db, account_id=account_verification.account_id)
        background_tasks.add_task(verifier.verify_account, account.username, verification_id)

@router.post("/accounts/add", tags=["accounts"], response_model=int)
async def create_account(form: schemas.AccountCreate, db: Session = Depends(get_db)):
    account1 = crud.get_account_by_accountname(db, username=form.username)
    account2 = crud.get_account_by_accounturl(db, url=form.url)
    if account1 or account2:
        raise HTTPException(status_code=400, detail="Account has already been added.")
    account_id = crud.create_account(db, form)
    return account_id
    
@router.get("/accounts/archive/{account_id}", tags=["accounts"])
async def archive_account(account_id: int, db: Session = Depends(get_db)):
    account = crud.get_account(db, account_id=account_id)
    if account:
        crud.archive_account(db, account_id = account.id)
    else:
        raise HTTPException(status_code=400, detail="Account doesn't exist.")
    
@router.get("/accounts/restore/{account_id}", tags=["accounts"])
async def restore_account(account_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    account = crud.get_account(db, account_id=account_id)
    if account:
        crud.restore_account(db, account_id = account.id)
    else:
        raise HTTPException(status_code=400, detail="Account doesn't exist.")

@router.post("/accounts/restore", tags=["accounts"])
async def restore_accounts(account_ids: List[int], background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    accounts_to_restore = []
    for account_id in account_ids:
        account = crud.get_account(db, account_id=account_id)
        if account:
            accounts_to_restore.append(account_id)
        else:
            raise HTTPException(status_code=400, detail=f"Account with id = {account_id} doesn't exist.")

    for account_id in accounts_to_restore:
        crud.restore_account(db, account_id = account_id)