import json
import os
import sys
from typing import List
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# LLM Imports
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage

from tools import (
    check_financial_compliance, 
    verify_vision_alignment, 
    check_scheme_overlap, 
    check_state_precedents
)

load_dotenv()

# --- 1. Data Models ---
class ComplianceIssue(BaseModel):
    issue_type: str = Field(..., description="Type of issue: 'Financial', 'Policy', 'Overlap', 'Other'")
    severity: str = Field(..., description="'High' for blocking issues, 'Medium' or 'Low' for warnings")
    description: str = Field(..., description="Detailed explanation of the violation")
    suggested_fix: str = Field(..., description="Actionable advice to fix the issue")

class AnalysisReport(BaseModel):
    project_title: str
    overall_status: str = Field(..., description="'Approved', 'Needs Revision', or 'Rejected'")
    compliance_score: int = Field(..., description="0-100 confidence score based on adherence to guidelines")
    issues: List[ComplianceIssue] = Field(default_factory=list, description="List of all identified compliance issues")
    summary_note: str = Field(..., description="Executive summary of the analysis findings")

# --- 2. LLM Setup ---
def init_llm():
    provider = os.getenv("LLM_PROVIDER", "gemini").lower()
    print(f"🧠 Initializing LLM Backend: {provider.upper()}")

    if provider == "groq":
        return ChatGroq(
            model="llama-3.3-70b-versatile", temperature=0, 
            api_key=os.getenv("GROQ_API_KEY"), max_retries=2
        )
    elif provider == "ollama":
        return ChatOllama(model=os.getenv("OLLAMA_MODEL", "llama3.1"), temperature=0)
    elif provider == "gemini":
        return ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0, max_retries=2)
    else:
        raise ValueError(f"Unknown LLM_PROVIDER: {provider}")

# --- 3. Deterministic Tool Execution ---
def execute_tools(data: dict, raw_json: str) -> str:
    """Runs all validation tools locally and aggregates output."""
    print("�️  Running Deterministic Validation Tools...")
    results = []

    # A. Financial Check
    print("   ➤ Checking Financials...")
    fin_result = check_financial_compliance.invoke(raw_json)
    results.append(f"### 1. FINANCIAL COMPLIANCE CHECK\n{fin_result}")

    # B. Scheme Overlap Check
    desc = data.get("projectInformation", {}).get("description", "")
    if desc:
        print("   ➤ Checking Scheme Overlaps...")
        overlap_result = check_scheme_overlap.invoke(desc)
        results.append(f"### 2. SCHEME OVERLAP CHECK\n{overlap_result}")

    # C. Vision & Policy Check (Iterate over interventions)
    interventions = data.get("interventionTypes", [])
    if interventions:
        print("   ➤ Checking Vision Alignment...")
        vision_results = []
        for intervention in interventions:
            res = verify_vision_alignment.invoke(intervention)
            vision_results.append(f"- {intervention}: {res}")
        results.append("### 3. VISION & POLICY ALIGNMENT\n" + "\n".join(vision_results))

    # D. State Precedents
    # Basic logic: take the first intervention or title as proxy for 'project type'
    project_type = data.get("projectInformation", {}).get("title", "General Project")
    print("   ➤ Checking State Precedents...")
    prec_result = check_state_precedents.invoke(project_type)
    results.append(f"### 4. STATE PRECEDENTS\n{prec_result}")

    return "\n\n".join(results)

# --- 4. Main Execution ---
def run_single_shot_analysis():
    # Load Input
    try:
        with open("input2.json", "r", encoding="utf-8") as f:
            data = json.load(f)
            raw_json = json.dumps(data)
    except FileNotFoundError:
        print("❌ input2.json not found.")
        return

    # 1. Execute Tools
    tool_outputs = execute_tools(data, raw_json)
    
    # 2. Construct Prompt
    print("\n📝 Constructing Final Prompt...")
    try:
        with open("SYSTEM_PROMPT.md", "r", encoding="utf-8") as f:
            base_prompt = f.read()
    except:
        base_prompt = "You are a rigid validation auditor."

    final_prompt = (
        f"You have been provided with the results of automated validation tools.\n"
        f"Your task is to synthesize these results into a final structured JSON report.\n\n"
        f"--- TOOL OUTPUTS ---\n{tool_outputs}\n\n"
        f"--- ORIGINAL PROJECT DATA ---\n{json.dumps(data.get('projectInformation', {}), indent=2)}\n\n"
        f"Based ONLY on the tool outputs above, generate the AnalysisReport JSON."
    )
    
    # 3. Call LLM (Single Shot)
    print("🚀 Calling LLM (Single API Request)...")
    llm = init_llm()
    structured_llm = llm.with_structured_output(AnalysisReport)
    
    try:
         # Some models/providers might not support with_structured_output well, 
         # but langchain-google-genai and groq recent versions usually do.
         # If not, we fall back to raw prompting.
         report = structured_llm.invoke([
             SystemMessage(content=base_prompt),
             HumanMessage(content=final_prompt)
         ])
         
         print("\n✅ REPORT GENERATED:")
         print(json.dumps(report.model_dump(), indent=2))
         
         with open("analysis_report.json", "w") as f:
             f.write(json.dumps(report.model_dump(), indent=2))
             
    except Exception as e:
        print(f"❌ LLM Call Failed: {e}")
        # Fallback to raw string if structured fails
        print("   (Attempting raw output...)")
        raw_res = llm.invoke([SystemMessage(content=base_prompt), HumanMessage(content=final_prompt)])
        print(raw_res.content)

if __name__ == "__main__":
    run_single_shot_analysis()
