from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import your LangGraph orchestrator
from app.agents.orchestrator import run_sales_agent

app = FastAPI(title="AI Sales Agent System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ai-sales-agent-system.vercel.app"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    prompt: str

@app.get("/")
def health_check():
    return {"status": "Backend is live and routing correctly"}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    user_input = request.prompt
    
    # Pass the user input into your LangGraph AI
    agent_reply = run_sales_agent(user_input)
    
    return {"response": agent_reply}