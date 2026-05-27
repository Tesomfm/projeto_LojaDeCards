from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud_cartas
from database import get_db
from schemas_cartas import CriarCarta, CartaResponse, CartaUpdate

rotas = APIRouter(prefix="/carta", tags=["cartas"])

@rotas.get("/", response_model=list[CartaResponse])
def listar(db: Session = Depends(get_db)):
    return crud_cartas.listar_cartas(db)

@rotas.get("/{carta_id}", response_model=CartaResponse)
def buscar(carta_id: int, db: Session = Depends(get_db)):
    carta = crud_cartas.buscar_carta(db, carta_id)
    if not carta:
        raise HTTPException(status_code=404, detail="Carta não encontrada.")
    return carta

@rotas.post("/", response_model=CartaResponse, status_code=201)
def criar(dados: CriarCarta, db: Session = Depends(get_db)):
    return crud_cartas.criar_carta(db, dados)

@rotas.put("/{carta_id}", response_model=CartaResponse)
def substituir(carta_id: int, dados: CriarCarta, db: Session = Depends(get_db)):
    carta = crud_cartas.substituir_carta(db, carta_id, dados)
    if not carta:
        raise HTTPException(status_code=404, detail="Carta não encontrada.")
    return carta

@rotas.patch("/{carta_id}", response_model=CartaResponse)
def atualizar(carta_id: int, dados: CartaUpdate, db: Session = Depends(get_db)):
    carta = crud_cartas.atualizar_carta(db, carta_id, dados)
    if not carta:
        raise HTTPException(status_code=404, detail="Carta não encontrada.")
    return carta

@rotas.delete("/{carta_id}", status_code=204)
def deletar(carta_id: int, db: Session = Depends(get_db)):
    crud_cartas.deletar_carta(db, carta_id)
