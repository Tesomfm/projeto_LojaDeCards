from sqlalchemy.orm import Session
from fastapi import HTTPException
from relacao_clientes_cartas import Compra
from modelos_cartas import Carta
from schemas_relacao import CriarCompra

def criar_compra(db: Session, dados: CriarCompra):
    compra_existente = db.query(Compra).filter(
        Compra.cliente_id == dados.cliente_id,
        Compra.carta_id == dados.carta_id
    ).first()

    if compra_existente:
        compra_existente.quantidade += dados.quantidade
        Carta.quantidade -= dados.quantidade
        db.commit()
        db.refresh(compra_existente)
        return compra_existente
    else:
        Carta.quantidade -= dados.quantidade
        nova_compra = Compra(
            cliente_id=dados.cliente_id,
            carta_id=dados.carta_id,
            quantidade=dados.quantidade
        )
        db.add(nova_compra)
        db.commit()
        db.refresh(nova_compra)
        return nova_compra

def listar_compras(db: Session):
    return db.query(Compra).all()
def listar_compras_por_cliente(db: Session, cliente_id: int):
    return db.query(Compra).filter(Compra.cliente_id == cliente_id).all()