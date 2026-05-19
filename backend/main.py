from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import crud
from database import Base, engine, get_db
from schemas import CriarCarta, CartaResponse, CartaUpdate

Base.metadata.create_all(bind=engine)

app = FastAPI(title="API projeto loja de cartas")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/carta", response_model=list[CartaResponse])
def listar(db: Session = Depends(get_db)):
    return crud.listar_cartas(db)


@app.get("/carta/{carta_id}", response_model=CartaResponse)
def buscar(carta_id: int, db: Session = Depends(get_db)):
    carta = crud.buscar_carta(db, carta_id)
    if not carta:
        raise HTTPException(status_code=404, detail="Carta não encontrada.")
    return carta


@app.post("/carta", response_model=CartaResponse, status_code=201)
def criar(dados: CriarCarta, db: Session = Depends(get_db)):
    return crud.criar_carta(db, dados)


@app.put("/carta/{carta_id}", response_model=CartaResponse)
def substituir(carta_id: int, dados: CriarCarta, db: Session = Depends(get_db)):
    carta = crud.substituir_carta(db, carta_id, dados)
    if not carta:
        raise HTTPException(status_code=404, detail="Carta não encontrada.")
    return carta


@app.patch("/carta/{carta_id}", response_model=CartaResponse)
def atualizar(carta_id: int, dados: CartaUpdate, db: Session = Depends(get_db)):
    carta = crud.atualizar_carta(db, carta_id, dados)
    if not carta:
        raise HTTPException(status_code=404, detail="Carta não encontrada.")
    return carta


@app.delete("/carta/{carta_id}", status_code=204)
def deletar(carta_id: int, db: Session = Depends(get_db)):
    print(carta_id)
    crud.deletar_carta(db, carta_id)