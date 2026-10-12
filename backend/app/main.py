from fastapi import FastAPI

app = FastAPI(title="AI Sales Agent System")

@app.get("/")
def health_check():
    return {"status": "Backend is live and routing correctly"}