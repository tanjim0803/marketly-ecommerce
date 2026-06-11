from fastapi import FastAPI

app = FastAPI(title="Marketly E-Commerce Backend")

@app.get("/")
def root():
    return {"message": "Welcome to the Marketly E-Commerce API"}