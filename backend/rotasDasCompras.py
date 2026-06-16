from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud_relacao
from database import get_db
from schemas_relacao import CriarCompra, CompraResponse
import crud_cartas

rotas = APIRouter(prefix="/compra", tags=["compras"])

@rotas.get("/", response_model=list[CompraResponse])
def listar(db: Session = Depends(get_db)):
    compras = crud_relacao.listar_compras(db)
    if not compras:
        raise HTTPException(status_code=404, detail="Nenhuma compra encontrada.")
    return compras

@rotas.post("/", response_model=CompraResponse, status_code=201)
def criar(dados: CriarCompra, db: Session = Depends(get_db)):
    cliente = db.query(crud_relacao.Cliente).filter_by(id=dados.cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")

    carta = crud_cartas.buscar_carta(db, dados.carta_id)
    if not carta:
        raise HTTPException(status_code=404, detail="Carta não encontrada.")

    if carta.quantidade < dados.quantidade:
        raise HTTPException(status_code=400, detail="Estoque insuficiente.")
    
    compra = crud_relacao.criar_compra(db, dados)
    if not compra:
        raise HTTPException(status_code=500, detail="Erro ao salvar compra.")
    return compra

@rotas.get("/{compra_id}", response_model=CompraResponse)
def buscar(compra_id: int, db: Session = Depends(get_db)):
    compra = crud_relacao.buscar_compra(db, compra_id)
    if not compra:
        raise HTTPException(status_code=404, detail="Compra não encontrada.")
    return compra