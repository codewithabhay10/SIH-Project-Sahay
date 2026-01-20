import chromadb
from sentence_transformers import SentenceTransformer
import os

# Initialize ChromaDB
chroma_client = chromadb.PersistentClient(path="./chroma_db")
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_collection():
    try:
        return chroma_client.get_collection("pmajay_docs")
    except:
        return chroma_client.create_collection("pmajay_docs")

# Initialize at module level
collection = get_collection()

def index_docs_if_empty():
    """Index detailed, State-Specific PM-AJAY Knowledge"""
    
    # --- CRITICAL FIX: 'global' must be the VERY FIRST line ---
    global collection 
    
    # Check count safely
    try:
        if collection.count() > 0:
            print("🧠 Upgrading Knowledge Base with All-India Data...")
            chroma_client.delete_collection("pmajay_docs")
            collection = chroma_client.create_collection("pmajay_docs")
    except:
        # If checking count fails, just recreate
        collection = chroma_client.create_collection("pmajay_docs")
    
    print("⚡ Indexing All-India Data...")
    
    documents = [
        # --- 1. CORE RULES ---
        {
            "id": "rule-01",
            "text": "CRITICAL ELIGIBILITY: To get Grants-in-Aid, you MUST be: 1. Scheduled Caste (SC). 2. Annual Family Income below ₹2.50 Lakhs. 3. Age between 18 to 50 years.",
            "source": "Eligibility Criteria"
        },
        {
            "id": "rule-02",
            "text": "FINANCIAL BENEFIT: The government provides a 50% subsidy on the project cost, up to a maximum of ₹50,000 per beneficiary. The rest is a bank loan.",
            "source": "Funding Norms"
        },

        # --- 2. STATE SPECIFIC PORTALS ---
        {
            "id": "state-odisha",
            "text": "FOR ODISHA RESIDENTS: The scheme is implemented by OSFDC (Odisha Scheduled Caste & Scheduled Tribe Development Finance Co-operative Corporation). Website: https://osfdc.odisha.gov.in. You must visit the District Welfare Officer (DWO) to apply.",
            "source": "Odisha State Data"
        },
        {
            "id": "state-bihar",
            "text": "FOR BIHAR RESIDENTS: The implementing agency is the Bihar State Scheduled Caste Co-operative Development Corporation (BSCDC). Portal: http://state.bihar.gov.in/scstwelfare. Focus on E-Rickshaw and Small Shop schemes.",
            "source": "Bihar State Data"
        },
        {
            "id": "state-wb",
            "text": "FOR WEST BENGAL RESIDENTS: Contact WBSCSTDFC (West Bengal SC ST Development and Finance Corporation). Website: https://wbscstdfc.gov.in. Application is usually done via the 'Duare Sarkar' camps.",
            "source": "West Bengal State Data"
        },
        {
            "id": "state-rajasthan",
            "text": "FOR RAJASTHAN RESIDENTS: Managed by RNSCFFDC (Rajasthan Anusuchit Jati Vitt Aivam Vikas Sahakari Nigam). Apply via SSO Portal: https://sso.rajasthan.gov.in under 'Anupraati' or 'PM-AJAY' link.",
            "source": "Rajasthan State Data"
        },
        {
            "id": "state-gujarat",
            "text": "FOR GUJARAT RESIDENTS: Apply via 'e-Samaj Kalyan' portal (https://esamajkalyan.gujarat.gov.in). Agency: GSCDC.",
            "source": "Gujarat State Data"
        },
        {
            "id": "state-up",
            "text": "FOR UTTAR PRADESH (UP) RESIDENTS: Apply via UPSCFDC portal at http://grant-in-aid.upscfdc.in. Need Caste/Income Certificate.",
            "source": "UP State Data"
        },
        {
            "id": "state-mh",
            "text": "FOR MAHARASHTRA RESIDENTS: Implemented by LASFDC. Website: https://sjsa.maharashtra.gov.in.",
            "source": "Maharashtra State Data"
        },
        {
            "id": "state-ka",
            "text": "FOR KARNATAKA RESIDENTS: Implemented by Dr. B.R. Ambedkar Development Corporation. Portal: https://adcl.karnataka.gov.in.",
            "source": "Karnataka State Data"
        },
        {
            "id": "state-pb",
            "text": "FOR PUNJAB RESIDENTS: Agency is PSCFC. Website: http://pscfc.in.",
            "source": "Punjab State Data"
        },

        # --- 3. DOCUMENTS & PROCESS ---
        {
            "id": "process-01",
            "text": "REQUIRED DOCUMENTS: 1. Aadhaar Card. 2. Caste Certificate (SC). 3. Income Certificate (<₹2.5L). 4. Bank Passbook copy. 5. Passport Photo. 6. Project Quotation.",
            "source": "Documentation"
        },
        {
            "id": "process-02",
            "text": "APPLICATION STEPS: 1. Go to your State's SC Corporation portal. 2. Register with Mobile Number. 3. Upload Documents. 4. Wait for District Committee approval.",
            "source": "Application Steps"
        }
    ]
    
    # Extract & Embed
    texts = [doc["text"] for doc in documents]
    ids = [doc["id"] for doc in documents]
    metadatas = documents
    
    embeddings = model.encode(texts).tolist()
    collection.add(ids=ids, embeddings=embeddings, metadatas=metadatas)
    print(f"✅ Indexed {len(documents)} All-India Documents")

def retrieve_texts(query: str, n_results: int = 5) -> list[str]:
    if collection.count() == 0: return ["No knowledge base available."]
    query_embedding = model.encode([query]).tolist()[0]
    results = collection.query(query_embeddings=[query_embedding], n_results=n_results)
    
    texts = []
    if results['metadatas'] and results['metadatas'][0]:
        for meta in results['metadatas'][0]:
            texts.append(meta.get('text', ''))
    return texts