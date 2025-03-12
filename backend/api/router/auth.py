from fastapi import APIRouter, HTTPException, Depends, Form
from fastapi.security import OAuth2PasswordRequestForm
from core.auth import *
from sqlalchemy.orm import Session
from core.database import get_user_by_username,get_db
router = APIRouter()


@router.post("/login")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    user = get_user_by_username(db=db, username=form_data.username)
    
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/refresh")
async def refresh_token(refresh_token: str):
    """
    刷新access_token，如果refresh_token有效，则返回新的access_token。
    """
    user_data = tokenInterceptor(refresh_token)
    
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    new_access_token = create_access_token(data=user_data, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

    return {"access_token": new_access_token, "token_type": "bearer"}


@router.post("/verify")
async def verify(access_token: str = Form(...)):

    user_data = tokenInterceptor(access_token)
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid access token")
    return {"valid": "true"}

@router.post("/changepassword")
def change_password_api(
    username: str, 
    old_password: str, 
    new_password: str, 
    db: Session = Depends(get_db)
):
    try:
        return change_password(db=db, username=username, old_password=old_password, new_password=new_password)
    except HTTPException as e:
        raise e