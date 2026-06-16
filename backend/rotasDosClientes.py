from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials 
from sqlalchemy.orm import Session
from sqlalchemy import func
from auth import criar_token, verificar_token 
import crud_cliente
from database import get_db
from modelos_cliente import Cliente
from schemas_cliente import CriarCliente, ClienteResponse, ClienteUpdate, LoginCliente, LoginFuncionario

rotas = APIRouter(prefix="/cliente", tags=["clientes"])

token_auth_scheme = HTTPBearer(auto_error=False)

def validar_token(credenciais: HTTPAuthorizationCredentials = Depends(token_auth_scheme)):
    if not credenciais:
        raise HTTPException(status_code=401, detail="Token de autorização ausente.")
    payload = verificar_token(credenciais.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado.")
    return payload

@rotas.post("/", response_model=ClienteResponse, status_code=201)
def criar(dados: CriarCliente, db: Session = Depends(get_db)):
    return crud_cliente.criar_cliente(db, dados)

@rotas.put("/{cliente_id}", response_model=ClienteResponse)
def substituir(cliente_id: int, dados: CriarCliente, db: Session = Depends(get_db), token: dict = Depends(validar_token)):
    cliente = crud_cliente.substituir_cliente(db, cliente_id, dados)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")
    return cliente

@rotas.patch("/{cliente_id}", response_model=ClienteResponse)
def atualizar(cliente_id: int, dados: ClienteUpdate, db: Session = Depends(get_db), token: dict = Depends(validar_token)):
    cliente = crud_cliente.atualizar_cliente(db, cliente_id, dados)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")
    return cliente

@rotas.delete("/{cliente_id}", status_code=204)
def deletar(cliente_id: int, db: Session = Depends(get_db), token: dict = Depends(validar_token)):
    crud_cliente.deletar_cliente(db, cliente_id)