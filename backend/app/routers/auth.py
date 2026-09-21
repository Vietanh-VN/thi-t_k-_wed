from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import NguoiDung
from app.schemas.auth import Token, UserLogin, UserCreate, UserResponse, UserUpdate
from app.services.auth_service import (
    authenticate_user, create_user, get_current_user,
    require_manager, get_user_by_id
)
from app.utils.security import create_access_token, get_password_hash

router = APIRouter(prefix="/auth", tags=["Xác thực & Người dùng"])

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Đăng nhập vào hệ thống."""
    user = authenticate_user(db, credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không chính xác."
        )
    access_token = create_access_token(
        subject=user.NguoiDungId,
        extra_claims={"email": user.Email, "vai_tro": user.VaiTro, "ho_ten": user.HoTen}
    )
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: NguoiDung = Depends(get_current_user)):
    """Lấy thông tin người dùng đang đăng nhập."""
    return current_user

@router.get("/users", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db), manager: NguoiDung = Depends(require_manager)):
    """Lấy danh sách người dùng (Chỉ Quản lý)."""
    return db.query(NguoiDung).all()

@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_new_user(user_in: UserCreate, db: Session = Depends(get_db), manager: NguoiDung = Depends(require_manager)):
    """Tạo người dùng mới (Chỉ Quản lý)."""
    return create_user(db, user_in)

@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_in: UserUpdate, db: Session = Depends(get_db), manager: NguoiDung = Depends(require_manager)):
    """Cập nhật thông tin/vai trò người dùng (Chỉ Quản lý)."""
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Người dùng không tồn tại.")
    if user_in.HoTen is not None:
        user.HoTen = user_in.HoTen
    if user_in.VaiTro is not None:
        user.VaiTro = user_in.VaiTro
    if user_in.TrangThai is not None:
        user.TrangThai = user_in.TrangThai
    if user_in.MatKhau:
        user.MatKhauHash = get_password_hash(user_in.MatKhau)
    db.commit()
    db.refresh(user)
    return user
