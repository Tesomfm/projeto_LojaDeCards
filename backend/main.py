from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import modelos_cliente
import modelos_cartas
import relacao_clientes_cartas
from database import Base, engine
from rotasDosClientes import rotas as rotaDoCliente
from rotasDasCartas import rotas as rotaDaCarta
from rotasDasCompras import rotas as rotasDasCompras

Base.metadata.create_all(bind=engine)

app = FastAPI(title="API projeto loja de cartas")

origins =[
    "https://projeto-loja-de-cards.vercel.app"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rotaDaCarta)
app.include_router(rotaDoCliente)
app.include_router(rotasDasCompras)  