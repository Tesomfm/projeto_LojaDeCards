from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Comprar(Base):
    __tablename__ = "compras"

    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("Clientes.id"))
    carta_id = Column(Integer, ForeignKey("Cartas.id"))
    quantidade = Column(Integer)

    cliente = relationship("Cliente", back_populates="compras")
    carta = relationship("Carta", back_populates="compras")