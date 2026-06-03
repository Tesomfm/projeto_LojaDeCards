from sqlalchemy.orm import Session
from fastapi import HTTPException
from relacao_clientes_cartas import Comprar
from modelos_cartas import Carta
from schemas_relacao import CriarCompra

def criar_compra(db: Session, dados: CriarCompra):
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
    else:
        nova_compra = Comprar(
            cliente_id=dados.cliente_id,
            carta_id=dados.carta_id,
            quantidade=dados.quantidade
        )
        db.add(nova_compra)

    carta.quantidade -= dados.quantidade

    db.commit()
    db.refresh(carta)
    return compra_existente if compra_existente else nova_compra

def listar_compras(db: Session):
    return db.query(Comprar).all()
def listar_compras_por_cliente(db: Session, cliente_id: int):
    return db.query(Comprar).filter(Comprar.cliente_id == cliente_id).all()
def buscar_compra(db: Session, compra_id: int):
    return db.query(Comprar).filter(Comprar.id == compra_id).first()