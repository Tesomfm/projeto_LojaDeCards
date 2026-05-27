from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud_cliente
from database import get_db
from schemas_cliente import CriarCliente, ClienteResponse, ClienteUpdate

rotas = APIRouter(prefix="/cliente", tags=["clientes"])

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
