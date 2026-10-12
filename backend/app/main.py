from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="AI Sales Agent System")

# 1. Setup CORS to allow Vercel to communicate with Render
app.add_middleware(
    CORSMiddleware,
    # For tighter security later, replace "*" with your actual Vercel URL
    allow_origins=["https://ai-sales-agent-system.vercel.app"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Define the schema for incoming messages from React
class ChatRequest(BaseModel):
    prompt: str

# 3. Standard Health Check (Keep this for Render)
@app.get("/")
def health_check():
    return {"status": "Backend is live and routing correctly"}

# 4. Chat Endpoint to handle user messages
@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    user_input = request.prompt
    
    # ---------------------------------------------------------
    # TODO: Connect your LangGraph AI logic here!
    # Example:
    # from app.agents.orchestrator import run_sales_agent
    # agent_reply = run_sales_agent(user_input)
    # ---------------------------------------------------------
    
    # Temporary placeholder response until your AI is hooked up:
    agent_reply = f"System received: '{user_input}'. Hook up your LangGraph orchestrator in main.py to generate real AI responses!"
    
    return {"response": agent_reply}