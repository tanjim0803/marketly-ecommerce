from fastapi import FastAPI
from app.api.routes import master_router

app = FastAPI(title="Marketly E-Commerce Backend")


@app.get("/")
def root():
    return {"message": "Welcome to the Marketly E-Commerce API"}


app.include_router(master_router)
