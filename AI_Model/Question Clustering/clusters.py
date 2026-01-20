import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.cluster import HDBSCAN
from sklearn.preprocessing import normalize
from sklearn.metrics.pairwise import euclidean_distances

df = pd.read_csv('processed_issues_uuid.csv')
# if 'id' not in df.columns:
#     df['id'] = range(1, len(df) + 1)
df2 = pd.read_csv("pm_ajay_final_simulated_data.csv")
df2.columns = df2.columns.str.strip()
for col in df2.select_dtypes(include=['object']).columns:
    df2[col] = df2[col].str.strip()
df2['id'] = range(1, len(df2) + 1)
# df2["questions"] = df2["Doubt"].astype(str) + " " + df2["Issue_Raised"].astype(str)
df2["questions"] = df2["Doubt"]
def get_clusters_with_representatives(questions, ids, embed_model=None):

    df = pd.DataFrame({
        "Questions": list(questions),
        "id": list(ids)
    })

    print(f"Prepared {len(df)} questions for embedding.")

    if embed_model:
        embed_function = embed_model
    else:
        print("Loading SentenceTransformer model...")
        embed_function = SentenceTransformer('all-mpnet-base-v2')
        
    all_embeddings = []
    batch_size = 25
    
    # Use the list of questions from the internal dataframe
    qs = df["Questions"].tolist()
    
    for i in range(0, len(qs), batch_size):
        batch_questions = qs[i:i + batch_size]
        batch_embeddings = embed_function.encode(batch_questions)
        all_embeddings.extend(batch_embeddings)
        print(f"Processed batch {i // batch_size + 1}/{(len(qs) + batch_size - 1) // batch_size}")

    norm_embeddings = normalize(all_embeddings, norm='l2')

    print("Clustering with HDBSCAN...")
    clusterer = HDBSCAN(min_cluster_size=30, min_samples=10  , metric='euclidean')
    df['cluster'] = clusterer.fit_predict(norm_embeddings)
    print(f"Clustering complete. Found {len(set(df['cluster']))} clusters (including noise).")

    output_report = []
    
    # Iterate over unique clusters (excluding -1 which is noise)
    unique_labels = set(df['cluster'])
    if -1 in unique_labels:
        unique_labels.remove(-1)

    centroid_map = {}
    cluster_mapping = {}

    for label in unique_labels:
        # 1. Get all rows for this cluster
        mask = df['cluster'] == label
        cluster_rows = df[mask]
        cluster_vectors = norm_embeddings[mask]

        # 2. Calculate Centroid (Average Vector)
        centroid = np.mean(cluster_vectors, axis=0).reshape(1, -1)
        centroid_map[int(label)] = centroid[0].tolist() # Store as list for JSON serialization

        # 3. Find the question closest to the Centroid
        # We calculate distance from every point in this cluster to the centroid
        distances = euclidean_distances(cluster_vectors, centroid)
        closest_index_local = np.argmin(distances)
        
        # 4. Get the actual text and ID of that "Central" question
        representative_row = cluster_rows.iloc[closest_index_local]
        
        # 5. Collect all IDs in this cluster
        all_ids = cluster_rows['id'].tolist()

        # 6. Build Output Object
        cluster_info = {
            "cluster_id": int(label),
            "representative_question": representative_row['Questions'],
            "question_ids": all_ids,
            "count": len(all_ids)
        }
        output_report.append(cluster_info)
        cluster_mapping[int(label)] = cluster_info

    return {
        "report": output_report,
        "centroids": centroid_map,
        "cluster_map": cluster_mapping
    }

# Run it
if __name__ == "__main__":
    # Clean columns first
    df.columns = df.columns.str.strip()
    for col in df.select_dtypes(include=['object']).columns:
        df[col] = df[col].str.strip()

    # Call the function with specific columns
    # 'Issue' contains the questions, 'Issue_Id' contains the IDs matches processed_issues_uuid.csv
    results = get_clusters_with_representatives(df2["questions"], df2["id"])

    # Print Result
    import json
    import re
    
    json_output = json.dumps(results, indent=2)
    
    # Compact the question_ids lists to be horizontal
    # Matches "question_ids": [ ... ] and collapses the content
    def compact_list(match):
        content = match.group(1)
        # Remove newlines and extra spaces
        compacted = re.sub(r'\s+', ' ', content)
        return f'"question_ids": [{compacted}]'

    json_output = re.sub(r'"question_ids": \[\s+(.*?)\s+\]', compact_list, json_output, flags=re.DOTALL)
    
    print(json_output)
