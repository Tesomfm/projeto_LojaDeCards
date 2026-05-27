from sqlalchemy import Column, Integer, String, Date
from database import Base

class Cliente(Base):
    __tablename__ = "Clientes"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    dataDeNascimento = Column(Date, nullable=False)
    genero = Column(String, nullable=False)