from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import euclidean_distances
from sklearn.preprocessing import normalize
import numpy as np

# Import our clustering logic
import clusters

app = FastAPI(title="Question Clustering API")

# --- Global State ---
# In a production app, use a database or improved state management
GLOBAL_STATE = {
    "model": None,
    "centroids": {},       # cluster_id -> vector (list)
    "cluster_map": {},     # cluster_id -> cluster_info
    "is_model_loading": False
}

# --- Data Models ---
class QuestionItem(BaseModel):
    id: str
    question: str

class ClusterRequest(BaseModel):
    ids: List[str]
    questions: List[str]

class PredictRequest(BaseModel):
    query: str

# --- Startup Event ---
@app.on_event("startup")
def startup_event():
    print("Starting up... Loading SentenceTransformer model in background...")
    GLOBAL_STATE["is_model_loading"] = True
    try:
        GLOBAL_STATE["model"] = SentenceTransformer('all-mpnet-base-v2')
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Failed to load model: {e}")
    finally:
        GLOBAL_STATE["is_model_loading"] = False

# --- Endpoints ---

@app.post("/cluster")
def perform_clustering(request: ClusterRequest):
    if GLOBAL_STATE["model"] is None:
        raise HTTPException(status_code=503, detail="Model is still loading or failed to load.")

    if len(request.questions) != len(request.ids):
        raise HTTPException(status_code=400, detail="Length of questions and ids must match.")

    questions = request.questions
    ids = request.ids

    print(f"Received {len(questions)} items for clustering.")

    # Call the logic from clusters.py
    # Returns: { "report": ..., "centroids": ..., "cluster_map": ... }
    try:
        results = clusters.get_clusters_with_representatives(
            questions, 
            ids, 
            embed_model=GLOBAL_STATE["model"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Update Global State
    GLOBAL_STATE["centroids"] = results["centroids"]
    GLOBAL_STATE["cluster_map"] = results["cluster_map"]
    
    print(f"Clustering done. Stored {len(GLOBAL_STATE['centroids'])} centroids.")

    return {
        "clusters": results["report"],
        "centroids": results["centroids"]
    }

@app.post("/predict")
def predict_cluster(request: PredictRequest):
    if GLOBAL_STATE["model"] is None:
         raise HTTPException(status_code=503, detail="Model is loading.")
    
    if not GLOBAL_STATE["centroids"]:
        raise HTTPException(status_code=400, detail="No clusters found. Please call /cluster first.")

    # 1. Encode query
    query_embedding = GLOBAL_STATE["model"].encode([request.query])
    norm_query = normalize(query_embedding, norm='l2')

    # 2. Compare with centroids
    best_cluster_id = -1
    min_dist = float('inf')
    
    # Threshold for "noise" - purely heuristic. 
    # If distance > 0.8 (example), might be unrelated. Set high to always assign.
    NOISE_THRESHOLD = 1.0 

    for cid, centroid_list in GLOBAL_STATE["centroids"].items():
        centroid_vec = np.array(centroid_list).reshape(1, -1)
        dist = euclidean_distances(norm_query, centroid_vec)[0][0]
        
        if dist < min_dist:
            min_dist = dist
            best_cluster_id = cid

    # 3. determine result
    if min_dist > NOISE_THRESHOLD:
        return {"cluster_id": -1, "distance": min_dist, "note": "Too far from any cluster"}
    
    # Retrieve cluster info
    cluster_info = GLOBAL_STATE["cluster_map"].get(best_cluster_id)
    
    return {
        "cluster_id": best_cluster_id,
        "representative_question": cluster_info["representative_question"] if cluster_info else None,
        "distance": min_dist
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
