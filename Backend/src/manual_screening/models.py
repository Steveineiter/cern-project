# needed_user_time_per_paper
from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship

from src.database import Base


class NeededUserTimePerPaper(Base):
    __tablename__ = "needed_user_time_per_paper"
    paper_id = Column(
        Integer, ForeignKey("paper.paper_id", ondelete="CASCADE"), primary_key=True
    )
    review_id = Column(
        Integer, ForeignKey("review.review_id", ondelete="CASCADE"), primary_key=True
    )
    cern_upn = Column(
        String, ForeignKey("users.cern_upn", ondelete="CASCADE"), primary_key=True
    )
    used_time_in_seconds = Column(Integer)

    paper = relationship("Paper", back_populates="needed_user_time_per_paper")
    review = relationship("Review", back_populates="needed_user_time_per_paper")
    users = relationship("Users", back_populates="needed_user_time_per_paper")
