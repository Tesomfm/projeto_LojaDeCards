from typing import Optional
from pydantic import BaseModel, ConfigDict

class CriarCarta(BaseModel):
    nome: str
    atk: int
    defesa: int
    preco: float
    quantidade: int

class CartaUpdate(BaseModel):
    nome: Optional[str]  = None
    atk: Optional[int]  = None
    defesa: Optional[int] = None
    preco: Optional[float] = None
    quantidade: Optional[int] = None

class CartaResponse(BaseModel):
    id: int
    nome: str
    atk: int
    defesa: int
    preco: float
    quantidade: int

    model_config = ConfigDict(from_attributes=True)