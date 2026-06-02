from pydantic import BaseModel

class CriarCompra(BaseModel):
    cliente_id: int
    carta_id: int
    quantidade: int

class CompraResponse(BaseModel):
    id: int
    cliente_id: int
    carta_id: int
    quantidade: int

    class Config:
        from_attributes = True
