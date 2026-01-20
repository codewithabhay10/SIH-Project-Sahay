import json
import os
from dotenv import load_dotenv

load_dotenv()

from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from tools import check_financial_compliance, check_scheme_overlap, verify_vision_alignment, parse_currency

llm = ChatGroq(
    model="llama-3.3-70b-versatile", 
    temperature=0,
    api_key=os.getenv("GROQ_API_KEY") 
)

def run_scrutiny_audit(plan_dict: dict):
    plan_str = json.dumps(plan_dict)
    
    print("   1. Running Financial Check...")
    financial_report = check_financial_compliance.invoke(plan_str)

    print("   2. Extracting Keywords for Overlap Check...")
    project_title = plan_dict.get("projectInformation", {}).get("title", "")
    interventions = ", ".join(plan_dict.get("interventionTypes", []))
    
    print("   3. Running Scheme Overlap Check...")
    overlap_report = check_scheme_overlap.invoke(f"{project_title} {interventions}")

    print("   4. Running Vision Alignment Check...")
    vision_report = verify_vision_alignment.invoke(project_title)

    final_prompt = f"""
    You are the Principal Scrutiny Officer. Write a Strict Audit Report based on the following Evidence.

    --- EVIDENCE 1: FINANCIAL COMPLIANCE ---
    {financial_report}

    --- EVIDENCE 2: SCHEME OVERLAP CHECKS ---
    {overlap_report}

    --- EVIDENCE 3: POLICY ALIGNMENT ---
    {vision_report}

    --- ORIGINAL PLAN ---
    {plan_dict['projectInformation']['description']}

    **INSTRUCTIONS:**
    1. If Financials failed, REJECT the proposal immediately.
    2. If Overlaps are found, issue a WARNING.
    3. Be concise and professional.
    """

    print("   5. Generating Final Report...")
    response = llm.invoke(final_prompt)
    
    return response.content

# --- EXECUTION ---
if __name__ == "__main__":
    with open("input.json", "r") as f:
        data = json.load(f)
    
    result = run_scrutiny_audit(data)
    print("\n" + "="*50)
    print(result)
    print("="*50)