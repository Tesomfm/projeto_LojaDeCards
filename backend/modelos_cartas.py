from sqlalchemy import Boolean, Column, Integer, String , Float
from sqlalchemy.orm import relationship
from database import Base

class Carta(Base):
    __tablename__ = "Cartas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    atk = Column(Integer, default=0)
    defesa = Column(Integer, default=0)
    preco =Column(Float, default=0.0)
    quantidade=Column(Integer,default=0)

    compras = relationship("Compra", back_populates="carta")