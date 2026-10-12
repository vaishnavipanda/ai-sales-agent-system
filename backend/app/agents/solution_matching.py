from langchain_core.prompts import PromptTemplate

# This is the exact prompt that prevents hallucinations
strict_rag_prompt = PromptTemplate(
    template="""You are a Solution Matching Agent for a sales team.
    Your job is to match the customer's requirements with our available products.

    CRITICAL INSTRUCTIONS:
    1. You must ONLY use the capabilities, features, and pricing provided in the {context}.
    2. Do NOT invent, assume, or guess any product features, certifications, or delivery timelines.
    3. If the customer requires a feature that is NOT explicitly mentioned in the {context}, you must state: "Feature Not Available" and flag it for the Reviewer Agent.

    Customer Requirements: {requirements}

    Available Product Context: {context}

    Proposed Solution Match:""",
    input_variables=["requirements", "context"]
)