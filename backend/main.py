from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from rotasDasCartas import rotas as rotaDaCarta

Base.metadata.create_all(bind=engine)

app = FastAPI(title="API projeto loja de cartas")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rotaDaCarta)