from fastapi import APIRouter, Depends, HTTPException , Query
from sqlalchemy.orm import Session
from sqlalchemy import func

import crud_cartas
from database import get_db
from schemas_cartas import CriarCarta, CartaResponse, CartaUpdate

rotas = APIRouter(prefix="/carta", tags=["cartas"])

def gerar_paginacao(page: int, total_pages: int, window: int = 2):
    paginas = []
    if page > window + 1:
        paginas.append("1")
        paginas.append("...")
    for p in range(max(1, page - window), min(total_pages, page + window) + 1):
        paginas.append(str(p))
    if page < total_pages - window:
        paginas.append("...")
        paginas.append(str(total_pages))
    return paginas

@rotas.get("/pesquisar")
def pesquisar(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1),
    nome: str | None = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(crud_cartas.Carta)
    offset = (page - 1) * limit
    if nome:
        query = query.filter(crud_cartas.Carta.nome.ilike(f"%{nome}%"))
    cartas = query.offset(offset).limit(limit).all()
    total = query.with_entities(func.count(crud_cartas.Carta.id)).scalar()
    total_pages = (total + limit - 1) // limit
    return {
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": total_pages,
        "pages": gerar_paginacao(page, total_pages),
        "data": cartas
    }

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
