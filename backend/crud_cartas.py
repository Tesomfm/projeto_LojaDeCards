from fastapi import HTTPException
from sqlalchemy.orm import Session
from modelos_cartas import Carta
from schemas_cartas import CriarCarta, CartaUpdate

def listar_cartas(db: Session):
    return db.query(Carta).all()

def buscar_carta(db: Session, carta_id: int):
    return db.query(Carta).filter(Carta.id == carta_id).first()

def criar_carta(db: Session, dados: CriarCarta):
    carta = Carta(**dados.model_dump())
    db.add(carta)
    db.commit()
    db.refresh(carta)
    return carta

def atualizar_carta(db: Session, carta_id: int, dados: CartaUpdate):
    carta = buscar_carta(db, carta_id)
    if not carta:
        return None
    atualizacoes = dados.model_dump(exclude_unset=True)
    for campo, valor in atualizacoes.items():
        carta.campo = valor
        setattr(carta, campo, valor)
    db.commit()
    db.refresh(carta)
    return carta

def substituir_carta(db: Session, carta_id: int, dados: CriarCarta):
    carta = buscar_carta(db, carta_id)
    if not carta:
        return None
    carta.nome = dados.nome
    carta.atk = dados.atk
    carta.Def = dados.Def
    db.commit()
    db.refresh(carta)
    return carta

def deletar_carta(db: Session, carta_id: int):
    carta = buscar_carta(db, carta_id)
    print(carta)
    if carta:
        db.delete(carta)
        db.commit()
    else:
       raise HTTPException(status_code=404, detail=f"Carta {carta_id} nao encontrada para deletar.")
    return carta