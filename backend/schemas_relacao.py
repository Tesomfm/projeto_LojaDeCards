from pydantic import BaseModel

from schemas_cliente import ClienteResponse
from schemas_cartas import CartaResponse
from modelos_cliente import Cliente
from modelos_cartas import Carta

class CriarCompra(BaseModel):
    cliente_id: int
    carta_id: int
    quantidade: int

class CompraResponse(BaseModel):
    id: int
    cliente: ClienteResponse
    carta: CartaResponse
    quantidade: int

    class Config:
        from_attributes = True
