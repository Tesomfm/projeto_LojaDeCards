from datetime import date
from pydantic import BaseModel, ConfigDict

from schemas_cliente import ClienteResponse
from schemas_cartas import CartaResponse

class CriarCompra(BaseModel):
    cliente_id: int
    carta_id: int
    quantidade: int

class ClientePublic(BaseModel):
    id: int
    nome: str
    email: str
    dataDeNascimento: date
    genero: str

    model_config = ConfigDict(from_attributes=True)

class CompraResponse(BaseModel):
    id: int
    cliente: ClientePublic
    carta: CartaResponse
    quantidade: int

    model_config = ConfigDict(from_attributes=True)