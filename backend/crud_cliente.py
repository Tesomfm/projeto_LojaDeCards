from sqlalchemy.orm import Session
from fastapi import HTTPException
from modelos_cliente import Cliente
from schemas_cliente import CriarCliente, ClienteUpdate

def listar_clientes(db: Session):
    return db.query(Cliente).all()

def buscar_cliente_por_email(db: Session, email: str):
    return db.query(Cliente).filter(Cliente.email == email).first()
def buscar_cliente(db: Session, cliente_id: int):
    return db.query(Cliente).filter(Cliente.id == cliente_id).first()

def criar_cliente(db: Session, dados: CriarCliente):
    existente = db.query(Cliente).filter(Cliente.email == dados.email).first()
    if existente:
        raise HTTPException(status_code=400, detail="Opa, esté E-mail já cadastrado.")
    cliente = Cliente(**dados.model_dump())
    db.add(cliente)
    db.commit()
    db.refresh(cliente)
    return cliente

def atualizar_cliente(db: Session, cliente_id: int, dados: ClienteUpdate):
    cliente = buscar_cliente(db, cliente_id)
    if not cliente:
        return None
    atualizacoes = dados.model_dump(exclude_unset=True)
    for campo, valor in atualizacoes.items():
        setattr(cliente, campo, valor)
    db.commit()
    db.refresh(cliente)
    return cliente

def substituir_cliente(db: Session, cliente_id: int, dados: CriarCliente):
    cliente = buscar_cliente(db, cliente_id)
    if not cliente:
        return None
    cliente.nome = dados.nome
    cliente.email = dados.email
    cliente.senha = dados.senha
    cliente.dataDeNascimento = dados.dataDeNascimento
    cliente.genero = dados.genero
    db.commit()
    db.refresh(cliente)
    return cliente

def deletar_cliente(db: Session, cliente_id: int):
    cliente = buscar_cliente(db, cliente_id)
    if cliente:
        db.delete(cliente)
        db.commit()
    else:
        raise HTTPException(status_code=404, detail=f"Cliente {cliente_id} não encontrado para deletar.")
    return cliente