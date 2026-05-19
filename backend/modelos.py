from sqlalchemy import Boolean, Column, Integer, String
from database import Base

class Carta(Base):
    __tablename__ = "Cartas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    atk = Column(int, default=0)
    Def = Column(int, default=0)