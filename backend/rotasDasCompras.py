from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud_cartas
import crud_cliente
import crud_relacao
from database import get_db
from schemas_relacao import CriarCompra, CompraResponse

rotas = APIRouter(prefix="/compra", tags=["compras"])


@rotas.get("/", response_model=list[CompraResponse])
def listar(db: Session = Depends(get_db)):
    return crud_relacao.listar_compras(db)

@rotas.post("/", response_model=CompraResponse, status_code=201)
def criar(dados: CriarCompra, db: Session = Depends(get_db)):
    carta = crud_cartas.buscar_carta(db, dados.carta_id)
    if not carta:
        raise HTTPException(status_code=404, detail="Carta não encontrada.")
    return crud_relacao.criar_compra(db, dados)

@rotas.get("/{compra_id}", response_model=CompraResponse)
def buscar(compra_id: int, db: Session = Depends(get_db)):
    compra = crud_relacao.buscar_compra(db, compra_id)
    if not compra:
        raise HTTPException(status_code=404, detail="Compra não encontrada.")
    return compra