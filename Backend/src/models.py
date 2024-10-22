# user, review, user_rights_in_review
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Boolean,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from src.database import Base


class Users(Base):  # Because user is a reserved word in postgresql.
    __tablename__ = "users"
    cern_upn = Column(String, primary_key=True, unique=True, index=True)
    user_email = Column(String, unique=True, index=True)

    user_details = relationship(
        "UserDetails",
        back_populates="users",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    user_rights_in_review = relationship(
        "UserRightsInReview",
        back_populates="users",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    needed_user_time_per_paper = relationship(
        "NeededUserTimePerPaper",
        back_populates="users",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class Review(Base):
    __tablename__ = "review"
    review_id = Column(Integer, primary_key=True, index=True)
    review_title = Column(String(512), nullable=False)
    review_research_question = Column(String)
    current_phase = Column(Integer)
    llm_level_of_automation = Column(Integer)
    creation_timestamp = Column(DateTime)
    ending_timestamp = Column(DateTime)
    last_modified = Column(DateTime)
    llm_screening_seconds_used = Column(Integer)

    eligibility_criteria = relationship(
        "EligibilityCriteria",
        back_populates="review",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    user_rights_in_review = relationship(
        "UserRightsInReview",
        back_populates="review",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    tagging = relationship(
        "Tagging",
        back_populates="review",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    needed_user_time_per_paper = relationship(
        "NeededUserTimePerPaper",
        back_populates="review",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class UserRightsInReview(Base):
    __tablename__ = "user_rights_in_review"
    cern_upn = Column(
        String, ForeignKey("users.cern_upn", ondelete="CASCADE"), primary_key=True
    )
    review_id = Column(
        Integer, ForeignKey("review.review_id", ondelete="CASCADE"), primary_key=True
    )
    is_owner = Column(Boolean)
    is_reviewer = Column(Boolean)

    users = relationship("Users", back_populates="user_rights_in_review")
    review = relationship("Review", back_populates="user_rights_in_review")
