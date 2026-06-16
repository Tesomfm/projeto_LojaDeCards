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

def validar_token(credenciais: HTTPAuthorizationCredentials = Depends(token_auth_scheme)):
    if not credenciais:
        raise HTTPException(status_code=401, detail="Token de autorização ausente.")
    payload = verificar_token(credenciais.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado.")
    return payload

@rotas.post("/login")
def login(dados: LoginCliente, db: Session = Depends(get_db)):
    cliente = crud_cliente.buscar_cliente_por_email(db, dados.email)
    
    if not cliente or cliente.senha != dados.senha:
        raise HTTPException(
            status_code=401, 
            detail="E-mail ou senha incorretos! Tente novamente."
        )
    
    payload = {
        "sub": cliente.email,
        "id": cliente.id,
        "nome": cliente.nome
    }
    
    token = criar_token(payload)
    
    return {
        "access_token": token,
        "id": cliente.id,
        "nome": cliente.nome
    }

@rotas.get("/")
def listar(db: Session = Depends(get_db)):
    return crud_cliente.listar_clientes(db)

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