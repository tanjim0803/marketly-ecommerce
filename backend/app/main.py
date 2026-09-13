from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import master_router
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Marketly E-Commerce Backend")

app.mount("/media", StaticFiles(directory="media"), name="media")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Welcome to the Marketly E-Commerce API"}


app.include_router(master_router)
