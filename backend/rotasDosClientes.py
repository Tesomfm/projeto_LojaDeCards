from fastapi import APIRouter, Depends, HTTPException , Query
from sqlalchemy.orm import Session
from sqlalchemy import func

import crud_cliente
from database import get_db
from schemas_cliente import CriarCliente, ClienteResponse, ClienteUpdate

rotas = APIRouter(prefix="/cliente", tags=["clientes"])

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
    query = db.query(crud_cliente.Cliente)
    offset = (page - 1) * limit
    if nome:
        query = query.filter(crud_cliente.Cliente.nome.ilike(f"%{nome}%"))
    clientes = query.offset(offset).limit(limit).all()
    total = query.with_entities(func.count(crud_cliente.Cliente.id)).scalar()
    total_pages = (total + limit - 1) // limit
    return {
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": total_pages,
        "pages": gerar_paginacao(page, total_pages),
        "data": clientes
    }
@rotas.get("/", response_model=list[ClienteResponse])
def listar(db: Session = Depends(get_db)):
    return crud_cliente.listar_clientes(db)

@rotas.get("/{cliente_id}", response_model=ClienteResponse)
def buscar(cliente_id: int, db: Session = Depends(get_db)):
    cliente = crud_cliente.buscar_cliente(db, cliente_id)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")
    return cliente

@rotas.post("/", response_model=ClienteResponse, status_code=201)
def criar(dados: CriarCliente, db: Session = Depends(get_db)):
    return crud_cliente.criar_cliente(db, dados)

@rotas.put("/{cliente_id}", response_model=ClienteResponse)
def substituir(cliente_id: int, dados: CriarCliente, db: Session = Depends(get_db)):
    cliente = crud_cliente.substituir_cliente(db, cliente_id, dados)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")
    return cliente

@rotas.patch("/{cliente_id}", response_model=ClienteResponse)
def atualizar(cliente_id: int, dados: ClienteUpdate, db: Session = Depends(get_db)):
    cliente = crud_cliente.atualizar_cliente(db, cliente_id, dados)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")
    return cliente

@rotas.delete("/{cliente_id}", status_code=204)
def deletar(cliente_id: int, db: Session = Depends(get_db)):
    crud_cliente.deletar_cliente(db, cliente_id)
