from sqlalchemy import Boolean, Column, Integer, String , Float, Numeric
from database import Base

class Carta(Base):
    __tablename__ = "Cartas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    atk = Column(Integer, default=0)
    Def = Column(Integer, default=0)
    preco =Column(Float, default=0.0)
    quantidade=Column(Integer,default=0)