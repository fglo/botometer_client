from fastapi import Depends, FastAPI, APIRouter, HTTPException, Request, Response
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from .accounts import *

router = APIRouter()

templates = Jinja2Templates(directory="frontend/html")

account_list_template = "accounts.html"
verification_list_template = "verifications.html"
archive_list_template = "archive.html"
account_details_modal_template = "account_details.html"

@router.get("/views/accounts", response_class=HTMLResponse, tags=["views"]) 
async def view_all_accounts(request: Request):
    return templates.TemplateResponse(globals()['account_list_template'], {"request": request, "username": "filip"})

@router.get("/views/archive", response_class=HTMLResponse, tags=["views"]) 
async def view_archive(request: Request):
    return templates.TemplateResponse(globals()['archive_list_template'], {"request": request, "username": "filip"})

@router.get("/views/verifications", response_class=HTMLResponse, tags=["views"]) 
async def view_all_verifications(request: Request):
    return templates.TemplateResponse(globals()['verification_list_template'], {"request": request, "username": "filip"})
    
@router.get("/views/verifications/{account_id}", response_class=HTMLResponse, tags=["views"]) 
async def view_all_account_verifications(request: Request, account_id : int):
    return templates.TemplateResponse(globals()['verification_list_template'], {"request": request, "username": "filip", "account_id": account_id})
    
@router.get("/views/accountdetails", response_class=HTMLResponse, tags=["views"]) 
async def view_account_details(request: Request, account_id : int):
    return templates.TemplateResponse(globals()['account_details_modal_template'], {"request": request})
