from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import date

class CriarCliente(BaseModel):
    nome: str
    email: str
    senha: str
    dataDeNascimento: date
    genero: str

class ClienteUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[str] = None
    senha: Optional[str] = None
    dataDeNascimento: Optional[date] = None
    genero: Optional[str] = None

class ClienteResponse(BaseModel):
    id: int
    nome: str
    email: str
    senha: str
    dataDeNascimento: date
    genero: str

    model_config = ConfigDict(from_attributes=True)
