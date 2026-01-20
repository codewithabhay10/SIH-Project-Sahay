import json
from langchain_core.tools import tool
from rag_system import PMAjayRAG

# --- SINGLETON RAG INSTANCE ---
# This initializes the class defined in rag_system.py
# The 'self.vector_db' attribute inside this object will allow persistent access.
rag_engine = PMAjayRAG(
    persist_directory="./chroma_db",
    docs_path="./documents"
)

# Optional: Uncomment this line if you want to ingest documents on the first run automatically
# rag_engine.ingest_documents()

def parse_currency(value_str):
    """Utility to clean currency strings."""
    if not isinstance(value_str, str): return 0
    # Clean non-ascii (like rupee symbol if it's garbled)
    clean_str = value_str.encode('ascii', 'ignore').decode('utf-8')
    # Use simple numeric extraction
    clean_str = ''.join(c for c in clean_str if c.isdigit() or c == '.')
    # clean_str = value_str.replace('₹', '').replace(',', '').strip()
    return int(float(clean_str)) if clean_str else 0

# --- TOOL DEFINITIONS ---

@tool
def check_financial_compliance(plan_json_str: str) -> str:
    """
    Analyzes the JSON plan for strict PM-AJAY financial rules.
    Checks:
    1. Skill Development >= 10% of Total Grant
    2. Infrastructure <= 30% of Total Grant
    3. Admin Costs <= 4% of Total Project Cost
    """
    try:
        data = json.loads(plan_json_str)
        
        skill_total = 0
        infra_total = 0
        income_total = 0
        admin_total = 0
        
        # 1. Skill Costs
        if data.get("skillDevelopment", {}).get("isActive"):
            years = data["skillDevelopment"].get("sectionByYear", {})
            for _, details in years.items():
                for beneficiary in details.get("beneficiaryBreakup", []):
                    skill_total += parse_currency(beneficiary.get("fundsProposedGrantInAid", "0"))

        # 2. Infrastructure Costs
        if data.get("infrastructureDevelopment", {}).get("isActive"):
            years = data["infrastructureDevelopment"].get("sectionByYear", {})
            for _, details in years.items():
                funds = details.get("otherSchemeFunds", {})
                infra_total += parse_currency(funds.get("fundsFromGrantInAid", "0"))

        # 3. Admin Costs
        admin_section = data.get("adminCosts", {})
        for _, details in admin_section.items():
            admin_total += parse_currency(details.get("adminExpenseAmount", "0"))

        # 4. Income Gen (Grant Portion)
        if data.get("incomeGeneration", {}).get("isActive"):
             years = data["incomeGeneration"].get("sectionByYear", {})
             for _, details in years.items():
                 # Assuming beneficiaries * grant per beneficiary
                 per_capita_grant = parse_currency(details.get("financials", {}).get("grantInAid", "0"))
                 count = int(details.get("beneficiaries", 0))
                 income_total += (per_capita_grant * count)

        grand_total = skill_total + infra_total + income_total + admin_total
        
        if grand_total == 0:
            return "Error: Total Project Cost is 0. Check JSON."

        skill_pct = (skill_total / grand_total) * 100
        infra_pct = (infra_total / grand_total) * 100
        admin_pct = (admin_total / grand_total) * 100
        
        report = [f"Total Budget: ₹{grand_total}"]
        
        if skill_pct >= 10: report.append(f"✅ Skill Dev: {skill_pct:.2f}% (Pass)")
        else: report.append(f"❌ Skill Dev: {skill_pct:.2f}% (Fail, needs >=10%)")
            
        if infra_pct <= 30: report.append(f"✅ Infrastructure: {infra_pct:.2f}% (Pass)")
        else: report.append(f"❌ Infrastructure: {infra_pct:.2f}% (Fail, needs <=30%)")

        if admin_pct <= 4: report.append(f"✅ Admin: {admin_pct:.2f}% (Pass)")
        else: report.append(f"❌ Admin: {admin_pct:.2f}% (Fail, needs <=4%)")
            
        return "\n".join(report)
        
    except Exception as e:
        return f"Calculation Error: {str(e)}"

@tool
def verify_vision_alignment(title: str) -> str:
    """
    Checks if an activity (e.g. 'Milk Chilling Center') is allowed under PM-AJAY Guidelines.
    Uses the RAG engine to search policy documents.
    """
    return rag_engine.query(
        query_text=f'''
        pm ajay guidelines
        pm ajay project lists under various domains
        is {title} valid under pm ajay
        ''',
        filters={"category": "rules"},
        k=5
    )

@tool
def check_scheme_overlap(project_description: str) -> str:
    """
    Checks for duplication with other schemes (PM-DAKSH, NRLM, etc.).
    Searches the knowledge base for similar existing schemes.
    """
    return rag_engine.query(
        query_text=f"schemes similar to {project_description} which are not part of PM AJAY Grant in Aid",
        k=4
    )

@tool
def check_state_precedents(project_type: str) -> str:
    """
    Searches previous approved State Plans for cost benchmarks and implementation details.
    """
    return rag_engine.query(
        query_text=f"implementation details and cost of {project_type}",
        filters={"category": "precedent"}
    )

# List of tools to export to main.py
pmajay_tools = [
    check_financial_compliance,
    verify_vision_alignment,
    check_scheme_overlap,
    check_state_precedents
]

if __name__ == "__main__":
    def test_tools_with_input(filepath="input2.json"):
        print(f"🔍 Testing tools with {filepath}...")
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                raw_json = json.dumps(data)
                title = data.get("projectInformation", {}).get("title", "Project")
                desc = data.get("projectInformation", {}).get("description", "No description")
                
            print("\n1️⃣  Testing Financial Compliance...")
            print(check_financial_compliance.invoke(raw_json))
            
            print("\n2️⃣  Testing Scheme Overlap...")
            print(check_scheme_overlap.invoke(desc))

            print("\n3️⃣  Testing Vision Alignment...")
            print(f"   ➤ Checking title: {title}")
            print(verify_vision_alignment.invoke(title))
            
            # print("\n4️⃣  Testing State Precedents...")
            # title = data.get("projectInformation", {}).get("title", "Project")
            # print(check_state_precedents.invoke(title))
            
        except FileNotFoundError:
            print("❌ Input file not found.")
        # except Exception as e:
        #     print(f"❌ Test Failed: {e}")

    test_tools_with_input()
    