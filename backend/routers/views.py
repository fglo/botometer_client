from fastapi import Depends, FastAPI, APIRouter, HTTPException, Request, Response
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from sqlalchemy.orm import Session

from ..database import crud, models, schemas
from ..dependencies import get_db

router = APIRouter()

templates = Jinja2Templates(directory="frontend/html")

account_list_template = "accounts.html"
verification_list_template = "verifications.html"
archive_list_template = "archive.html"
account_details_modal_template = "account_details.html"

@router.get("/views/accounts", response_class=HTMLResponse, tags=["views"]) 
async def view_all_accounts(request: Request):
    return templates.TemplateResponse(globals()['account_list_template'], {"request": request})

@router.get("/views/archive", response_class=HTMLResponse, tags=["views"]) 
async def view_archive(request: Request):
    return templates.TemplateResponse(globals()['archive_list_template'], {"request": request})

@router.get("/views/verifications", response_class=HTMLResponse, tags=["views"]) 
async def view_all_verifications(request: Request, account_id : int, db: Session = Depends(get_db)):
    account = crud.get_account(db, account_id=account_id)
    if account:
        return templates.TemplateResponse(globals()['verification_list_template'], {"request": request, "account": account})
    else:
        return templates.TemplateResponse(globals()['verification_list_template'], {"request": request})
