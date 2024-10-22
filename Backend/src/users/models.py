# user_details, user_work_role,
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from src.database import Base


class UserDetails(Base):
    __tablename__ = "user_details"
    cern_upn = Column(
        String, ForeignKey("users.cern_upn", ondelete="CASCADE"), primary_key=True
    )
    role_in_work_id = Column(Integer, ForeignKey("user_work_role.role_in_work_id"))
    first_name = Column(String)
    last_name = Column(String)
    organization = Column(String)
    department = Column(String)
    city = Column(String)

    users = relationship("Users", back_populates="user_details")
    work_role = relationship("UserWorkRole")


class UserWorkRole(Base):
    __tablename__ = "user_work_role"
    role_in_work_id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String)

    user_details = relationship("UserDetails", back_populates="work_role")
