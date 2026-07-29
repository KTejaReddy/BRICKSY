from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List, Optional
import numpy as np

app = FastAPI(title="BRICKSY AI Matching Engine")

TRADES = ["mason", "electrician", "plumber", "carpenter", "painter", "welder"]


class WorkerInfo(BaseModel):
    id: int
    experience: float = Field(ge=0)
    tenure: float = Field(ge=0)
    rating: float = Field(ge=0, le=5)
    previous_projects: int = Field(ge=0)
    estimated_cost: float = Field(ge=0)
    availability_score: float = Field(ge=0, le=1)
    trust_score: float = Field(ge=0, le=1)
    trade: str


class JobInfo(BaseModel):
    trade_required: str


class RecommendRequest(BaseModel):
    workers: List[WorkerInfo]
    job: JobInfo


class WorkerScore(BaseModel):
    id: int
    name: str = ""
    experience: float
    tenure: float
    rating: float
    previous_projects: int
    estimated_cost: float
    availability_score: float
    trust_score: float
    trade: str
    score: float


class RecommendResponse(BaseModel):
    recommendations: List[WorkerScore]


@app.get("/health")
def health():
    return {"status": "ok", "service": "bricksy-ai"}


@app.post("/recommend", response_model=RecommendResponse)
def recommend(request: RecommendRequest):
    scored_workers = []

    for w in request.workers:
        if w.trade != request.job.trade_required:
            continue

        normalized_experience = min(w.experience / 30.0, 1.0)
        normalized_tenure = min(w.tenure / 20.0, 1.0)
        normalized_rating = w.rating / 5.0
        normalized_projects = min(w.previous_projects / 50.0, 1.0)
        normalized_cost = 1.0 - min(w.estimated_cost / 10000.0, 1.0)

        score = (
            normalized_experience * 0.20
            + normalized_tenure * 0.10
            + normalized_rating * 0.30
            + normalized_projects * 0.10
            + normalized_cost * 0.00
            + w.availability_score * 0.15
            + w.trust_score * 0.15
        )

        scored_workers.append(WorkerScore(
            id=w.id,
            experience=w.experience,
            tenure=w.tenure,
            rating=w.rating,
            previous_projects=w.previous_projects,
            estimated_cost=w.estimated_cost,
            availability_score=w.availability_score,
            trust_score=w.trust_score,
            trade=w.trade,
            score=round(float(score), 4),
        ))

    scored_workers.sort(key=lambda x: x.score, reverse=True)

    return RecommendResponse(recommendations=scored_workers)
