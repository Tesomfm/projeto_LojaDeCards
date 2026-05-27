from typing import Optional
from pydantic import BaseModel, ConfigDict

class CriarCarta(BaseModel):
    nome: str
    atk: int
    Def: int

class CartaUpdate(BaseModel):
    nome: Optional[str]  = None
    atk: Optional[int]  = None
    Def: Optional[int] = None

class CartaResponse(BaseModel):
    id: int
    nome: str
    atk: int
    Def: int

    model_config = ConfigDict(from_attributes=True)