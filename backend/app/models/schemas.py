from pydantic import BaseModel, Field
from typing import List

class ScoreFactor(BaseModel):
    criteria: str
    score: int = Field(ge=0, le=10)
    reasoning: str

class LeadQualificationScore(BaseModel):
    total_score: int
    status: str # "Qualified", "Needs More Information", "Low Priority"
    factors: List[ScoreFactor]