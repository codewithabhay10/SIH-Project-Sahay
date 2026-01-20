from db import SessionLocal, Project, FundUpdate, Beneficiary, Grievance, get_db
from rag import retrieve_texts
from llm_client import call_llm
from typing import Optional, Dict, List
import re

# --- 1. MEMORY STORAGE (RAM) ---
# Stores chat history: { "user_id": ["User: Hi", "Bot: Hello", ...] }
CHAT_HISTORY: Dict[str, List[str]] = {}

# --- 2. FABRICATED LOCAL DATA ---
DUMMY_AGENTS = {
    "gujarat": "📍 **Local Agent:** Rajeshbhai Patel\n📞 **Phone:** 98765-11223\n🏢 **Office:** District Social Defence Office, Ahmedabad",
    "up": "📍 **Local Agent:** Suresh Kumar\n📞 **Phone:** 88990-44556\n🏢 **Office:** Vikas Bhawan, Lucknow",
    "uttar pradesh": "📍 **Local Agent:** Suresh Kumar\n📞 **Phone:** 88990-44556\n🏢 **Office:** Vikas Bhawan, Lucknow",
    "odisha": "📍 **Local Agent:** Manoj Das\n📞 **Phone:** 77665-22334\n🏢 **Office:** OSFDC Block B, Bhubaneswar",
    "maharashtra": "📍 **Local Agent:** Vijay Kamble\n📞 **Phone:** 99887-66554\n🏢 **Office:** Social Welfare Office, Pune",
    "punjab": "📍 **Local Agent:** Gurpreet Singh\n📞 **Phone:** 91234-56780\n🏢 **Office:** PSCFC Complex, Chandigarh",
    "karnataka": "📍 **Local Agent:** Ramesh Babu\n📞 **Phone:** 90001-22233\n🏢 **Office:** Dr. Ambedkar Bhavan, Bangalore",
}

def get_local_agent(message: str) -> str:
    msg_lower = message.lower()
    for state, info in DUMMY_AGENTS.items():
        if state in msg_lower:
            return f"\n\n{info}"
    return ""

def get_grievance_status(ticket_id: str, db) -> str:
    try:
        t_id = int(ticket_id)
        ticket = db.query(Grievance).filter(Grievance.id == t_id).first()
        if not ticket: return f"❌ Ticket #{t_id} not found."
        return f"Ticket #{t_id} is {ticket.status}. Category: {ticket.category}."
    except: return "❌ Invalid ID."

def handle_beneficiary_chat(message: str, user_id: Optional[str] = None) -> str:
    """Empathetic & Simple Beneficiary Logic with MEMORY"""
    db = next(get_db())
    
    # 1. Use "Guest" if no ID provided
    session_id = user_id if user_id else "guest_session"

    # 2. Check Ticket Status (Immediate Return)
    if "ticket" in message.lower() or "complaint" in message.lower():
        match = re.search(r'\d+', message)
        if match: return get_grievance_status(match.group(), db)

    # 3. Retrieve History
    # Get last 4 exchanges (keep it short so AI doesn't get confused)
    history = CHAT_HISTORY.get(session_id, [])
    history_context = "\n".join(history[-4:]) 

    # 4. Build Context
    knowledge_texts = retrieve_texts(message, n_results=3)
    local_data = get_local_agent(message)
    
    # Combine: History + RAG + Local Data
    full_context = f"""
    PREVIOUS CONVERSATION:
    {history_context}
    
    KNOWLEDGE BASE:
    {chr(10).join(knowledge_texts)}
    {local_data}
    """
    
    # 5. Prompt with Memory
    system_prompt = """You are 'Sahayak', a kind and helpful volunteer for the PM-AJAY scheme.
    
    **YOUR INSTRUCTIONS:**
    1. **Use Context:** Look at the 'PREVIOUS CONVERSATION' to understand what the user is talking about.
    2. **Be Specific:** If they mentioned a State earlier, remember it.
    3. **Be Specific:** If they mention a State, give the exact portal link or agent details provided in the context.
    4. **Be Warm & Kind:** Speak like a helpful human, not a robot. Use simple words.
    5. **Keep it Short:** Answers must be brief (2-3 sentences) so they are easy to listen to.
    6. **No Fluff:** Do not introduce yourself every time. Answer the question directly.
    7. **Multilingual:** Answer ONLY in the language the user is currently speaking.
    
    
    User: "I didn't get money."
    You: "I am sorry to hear that. Please file a complaint using the 'Report Issue' button."
    """

    user_prompt = f"""Context:\n{full_context}\n\nUser Question: {message}"""
    
    # 6. Call AI
    answer = call_llm(system_prompt, user_prompt)
    
    # 7. Update History
    if session_id not in CHAT_HISTORY: CHAT_HISTORY[session_id] = []
    CHAT_HISTORY[session_id].append(f"User: {message}")
    CHAT_HISTORY[session_id].append(f"Sahayak: {answer}")
    
    db.close()
    return answer

def handle_official_chat(message: str, user_id: Optional[str] = None) -> str:
    """Official Logic: Policy Consultant Mode"""
    db = next(get_db())
    knowledge_texts = retrieve_texts(message, n_results=5)
    context = "\n".join(knowledge_texts)
    
    system_prompt = """You are an AI Policy Consultant for the Ministry of Social Justice.
    
    **Your Goals:**
    1. **Direct Answers:** Start with the answer immediately. Do NOT use headings like 'Subject:', 'Query Response:', or 'Verification:'.
    2. **No Tables:** Do NOT use markdown tables (e.g., | Column |). Use simple bullet points instead.
    3. **Drafting:** If asked to 'Draft a letter', only THEN use a formal letter structure.
    4. **Tone:** Professional, Concise, and Authoritative.
    
    **Example of Good Output:**
    "The maximum subsidy for E-Rickshaws is ₹50,000 per beneficiary or 50% of the project cost, whichever is less. The remaining amount must be arranged via bank loan."
    """

    user_prompt = f"""Official's Query: {message}\n\nGuidelines:\n{context}"""
    
    answer = call_llm(system_prompt, user_prompt)
    db.close()
    return answer