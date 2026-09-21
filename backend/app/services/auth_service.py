from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import NguoiDung
from app.schemas.auth import UserCreate, UserLogin, UserResponse
from app.utils.security import verify_password, get_password_hash, create_access_token, decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_user_by_email(db: Session, email: str) -> Optional[NguoiDung]:
    return db.query(NguoiDung).filter(NguoiDung.Email == email).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[NguoiDung]:
    return db.query(NguoiDung).filter(NguoiDung.NguoiDungId == user_id).first()

def authenticate_user(db: Session, credentials: UserLogin) -> Optional[NguoiDung]:
    input_str = credentials.email.strip()
    username_map = {
        "admin": "admin@parking.vn",
        "staff": "staff@parking.vn",
        "customer": "khachhang@gmail.com",
        "khachhang": "khachhang@gmail.com",
        "ai": "ai@parking.vn"
    }
    target_email = username_map.get(input_str.lower(), input_str)
    user = get_user_by_email(db, target_email)
    if not user:
        from sqlalchemy import func
        user = db.query(NguoiDung).filter(func.lower(NguoiDung.Email) == target_email.lower()).first()
    if not user:
        return None
    if not verify_password(credentials.password, user.MatKhauHash):
        return None
    if not user.TrangThai:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản của bạn đã bị vô hiệu hóa hoặc tạm khóa."
        )
    return user

def create_user(db: Session, user_in: UserCreate) -> NguoiDung:
    existing = get_user_by_email(db, user_in.Email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email này đã được đăng ký trong hệ thống."
        )
    db_user = NguoiDung(
        HoTen=user_in.HoTen,
        Email=user_in.Email,
        MatKhauHash=get_password_hash(user_in.MatKhau),
        VaiTro=user_in.VaiTro,
        TrangThai=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> NguoiDung:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Phiên đăng nhập không hợp lệ hoặc đã hết hạn.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    user_id_str = payload.get("sub")
    if user_id_str is None:
        raise credentials_exception
    try:
        user_id = int(user_id_str)
    except ValueError:
        raise credentials_exception
        
    user = get_user_by_id(db, user_id=user_id)
    if user is None or not user.TrangThai:
        raise credentials_exception
    return user

def require_manager(current_user: NguoiDung = Depends(get_current_user)) -> NguoiDung:
    if current_user.VaiTro not in ["QuanLy", "AIEngine"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền quản lý để thực hiện thao tác này."
        )
    return current_user

def require_staff_or_manager(current_user: NguoiDung = Depends(get_current_user)) -> NguoiDung:
    if current_user.VaiTro not in ["QuanLy", "NhanVien", "AIEngine"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Yêu cầu quyền nhân viên hoặc quản lý để thực hiện."
        )
    return current_user
