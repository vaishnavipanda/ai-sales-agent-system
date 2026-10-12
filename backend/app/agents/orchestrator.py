import os
from typing import Annotated, TypedDict
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages

# 1. Define the Graph State
class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]

# 2. Initialize the Gemini LLM
# This relies on the GOOGLE_API_KEY environment variable set in Render
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7,api_key=os.environ.get("GEMINI_API_KEY"))

# 3. Define the Core Agent Node
def sales_agent_node(state: AgentState):
    system_prompt = SystemMessage(
        content=(
            "You are an elite Agentic AI Sales Assistant. Your role is to: "
            "1. Qualify incoming leads based on their budget, authority, need, and timeline (BANT). "
            "2. Analyze enterprise software requirements. "
            "3. Generate professional, tailored proposals based on user input. "
            "Keep your responses professional, strategic, and naturally conversational."
        )
    )
    
    # Pass the system prompt and the entire conversation history to the LLM
    conversation = [system_prompt] + state["messages"]
    response = llm.invoke(conversation)
    
    return {"messages": [response]}

# 4. Construct the Workflow Graph
workflow = StateGraph(AgentState)
workflow.add_node("sales_agent", sales_agent_node)
workflow.set_entry_point("sales_agent")
workflow.add_edge("sales_agent", END)

sales_graph = workflow.compile()

# 5. Create an Execution Wrapper for FastAPI
def run_sales_agent(user_input: str) -> str:
    try:
        inputs = {"messages": [HumanMessage(content=user_input)]}
        result = sales_graph.invoke(inputs)
        return result["messages"][-1].content
    except Exception as e:
        print(f"LangGraph Error: {e}")
        return "I encountered an error processing your request. Please ensure the GOOGLE_API_KEY is configured correctly in the backend environment."