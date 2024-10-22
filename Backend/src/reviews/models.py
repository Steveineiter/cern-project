# eligibility_criteria, paper, paper_details, paper_full_text, paper_raw_details, paper_source_specific_keys, tagging
from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    Boolean,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from src.database import Base


class EligibilityCriteria(Base):
    __tablename__ = "eligibility_criteria"
    eligibility_criteria_id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("review.review_id", ondelete="CASCADE"))
    pico_tag = Column(String)
    inclusion_criteria = Column(String)
    exclusion_criteria = Column(String)

    review = relationship("Review", back_populates="eligibility_criteria")


class Paper(Base):
    __tablename__ = "paper"
    paper_id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    abstract = Column(String)

    paper_details = relationship(
        "PaperDetails",
        back_populates="paper",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    paper_raw_details = relationship(
        "PaperRawDetails",
        back_populates="paper",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    paper_full_text = relationship(
        "PaperFullText",
        back_populates="paper",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    paper_source_specific_keys = relationship(
        "PaperSourceSpecificKeys",
        back_populates="paper",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    needed_user_time_per_paper = relationship(
        "NeededUserTimePerPaper",
        back_populates="paper",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    tagging = relationship(
        "Tagging",
        back_populates="paper",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class PaperFullText(Base):
    __tablename__ = "paper_full_text"
    paper_id = Column(
        Integer, ForeignKey("paper.paper_id", ondelete="CASCADE"), primary_key=True
    )
    full_text = Column(String)

    paper = relationship("Paper", back_populates="paper_full_text")


class PaperRawDetails(Base):
    __tablename__ = "paper_raw_details"
    paper_id = Column(
        Integer, ForeignKey("paper.paper_id", ondelete="CASCADE"), primary_key=True
    )
    details_json_string = Column(String)

    paper = relationship("Paper", back_populates="paper_raw_details")


# TODO delete this and update to new database design
class PaperSourceSpecificKeys(Base):
    __tablename__ = "paper_source_specific_keys"
    paper_source_id = Column(Integer, primary_key=True, index=True)
    paper_id = Column(Integer, ForeignKey("paper.paper_id", ondelete="CASCADE"))
    source = Column(String)
    specific_key = Column(String)

    paper = relationship("Paper", back_populates="paper_source_specific_keys")


class PaperDetails(Base):
    __tablename__ = "paper_details"
    paper_id = Column(
        Integer, ForeignKey("paper.paper_id", ondelete="CASCADE"), primary_key=True
    )
    authors = Column(String)
    date = Column(Date)
    journal = Column(String)
    volume = Column(String)
    issue = Column(String)
    language = Column(String)
    issn = Column(String)
    doi = Column(String)
    #     source = Column(String)
    #     specific_key = Column(String)

    paper = relationship("Paper", back_populates="paper_details")


class Tagging(Base):
    __tablename__ = "tagging"
    review_id = Column(
        Integer, ForeignKey("review.review_id", ondelete="CASCADE"), primary_key=True
    )
    paper_id = Column(
        Integer, ForeignKey("paper.paper_id", ondelete="CASCADE"), primary_key=True
    )
    neutrino_review_llm_tag = Column(Integer)
    tokens_used_by_llm = Column(Integer)
    has_been_reviewed_by_user = Column(Boolean)
    exclusion_reason = Column(String)

    review = relationship("Review", back_populates="tagging")
    paper = relationship("Paper", back_populates="tagging")
