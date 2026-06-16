from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from modelos_cliente import Cliente
from relacao_clientes_cartas import Comprar
from modelos_cartas import Carta
from schemas_relacao import CriarCompra

def criar_compra(db: Session, dados: CriarCompra):
    cliente = db.query(Cliente).filter(Cliente.id == dados.cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    carta = db.query(Carta).filter(Carta.id == dados.carta_id).first()
    if not carta:
        raise HTTPException(status_code=404, detail="Carta não encontrada")

    if carta.quantidade < dados.quantidade:
        raise HTTPException(status_code=400, detail="Estoque insuficiente")

    compra_existente = db.query(Comprar).filter(
        Comprar.cliente_id == dados.cliente_id,
        Comprar.carta_id == dados.carta_id
    ).first()

    if compra_existente:
        compra_existente.quantidade += dados.quantidade
        compra = compra_existente
    else:
        compra = Comprar(
            cliente_id=dados.cliente_id,
            carta_id=dados.carta_id,
            quantidade=dados.quantidade
        )
        db.add(compra)

    carta.quantidade -= dados.quantidade

    db.commit()
    db.refresh(compra)
    return compra

def listar_compras(db: Session):
    return db.query(Comprar).options(
        joinedload(Comprar.cliente),
        joinedload(Comprar.carta)
    ).all()

def listar_compras_por_cliente(db: Session, cliente_id: int):
    return db.query(Comprar).options(
        joinedload(Comprar.cliente),
        joinedload(Comprar.carta)
    ).filter(Comprar.cliente_id == cliente_id).all()

def buscar_compra(db: Session, compra_id: int):
    return db.query(Comprar).options(
        joinedload(Comprar.cliente),
        joinedload(Comprar.carta)
    ).filter(Comprar.id == compra_id).first()