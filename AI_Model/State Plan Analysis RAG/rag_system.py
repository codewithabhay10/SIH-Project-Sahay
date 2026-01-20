import os
from dotenv import load_dotenv

load_dotenv()
import glob
from typing import List, Dict, Optional

# Back to Docling
from docling.document_converter import DocumentConverter
from docling.chunking import HybridChunker
from transformers import AutoTokenizer

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document

class PMAjayRAG:
    def __init__(
        self, 
        docs_path: str = "./documents",
        persist_directory: str = "./chroma_db",
        embedding_model_name: str = "sentence-transformers/all-mpnet-base-v2",  
        collection_name: str = "pmajay_knowledge_base"
    ):
        """
        Initializes the RAG System.
        """
        self.docs_path = docs_path
        self.persist_directory = persist_directory
        self.collection_name = collection_name
        
        print(f"Loading embedding model: {embedding_model_name}...")
        
        if "nomic" in embedding_model_name:
            self.embedding_function = OllamaEmbeddings(
                model=embedding_model_name
            )
        else:
            self.embedding_function = HuggingFaceEmbeddings(
                model_name=embedding_model_name,
                model_kwargs={'device': 'cpu'},
                encode_kwargs={'normalize_embeddings': True}
            )
            
        self.vector_db = self._initialize_db()

    def _initialize_db(self) -> Chroma:
        """
        Internal method to load or create the ChromaDB instance.
        """
        if os.path.exists(self.persist_directory) and os.listdir(self.persist_directory):
            print(f"📂 Loading existing Vector DB from {self.persist_directory}...")
        else:
            print(f"🆕 No existing DB found at {self.persist_directory}. A new one will be created upon ingestion.")
            
        return Chroma(
            persist_directory=self.persist_directory,
            embedding_function=self.embedding_function,
            collection_name=self.collection_name
        )

    def _get_file_metadata(self, file_path: str) -> Dict:
        """
        Classifies documents and extracts metadata from FOLDER STRUCTURE.
        Expected: documents/{SCHEME}/{COMPONENT}/filename.pdf
        """
        filename = os.path.basename(file_path).lower()
        
        # Default Meta
        meta = {
            "source": os.path.basename(file_path),
            "scheme": "General",
            "component": "General"
        }

        # Extract Folder Info
        try:
            norm_path = os.path.normpath(file_path)
            parts = norm_path.split(os.sep)
            
            if len(parts) >= 3:
                meta["component"] = parts[-2]
                meta["scheme"] = parts[-3]
        except Exception:
            pass

        # Content Type Tagging
        if "guideline" in filename or "format" in filename:
            meta.update({"category": "rules", "doc_type": "policy", "priority": "high"})
        elif "state" in filename or "plan" in filename or "example" in filename:
            meta.update({"category": "precedent", "doc_type": "implementation", "priority": "medium"})
        elif "ppt" in filename or "presentation" in filename:
            meta.update({"category": "summary", "doc_type": "overview", "priority": "low"})
        else:
            meta.update({"category": "general", "doc_type": "uncategorized"})

        return meta

    def clear_database(self):
        """
        Clears all documents from the existing ChromaDB collection.
        """
        try:
            existing_docs = self.vector_db.get()
            ids = existing_docs['ids']
            if ids:
                print(f"🗑️  Clearing {len(ids)} documents from existing DB...")
                self.vector_db.delete(ids=ids)
                print("✅ Database Cleared.")
            else:
                print("ℹ️  Database is already empty.")
        except Exception as e:
            print(f"⚠️  Error clearing database: {e}")

    def ingest_documents(self):
        """
        Parses PDFs using Docling, chunks them, and adds to DB.
        """
        doc_count = 0
        try:
            doc_count = self.vector_db._collection.count()
        except: pass
        print(f"📊 Current DB Count: {doc_count}")

        print("🔧 Initializing Docling Converter & HybridChunker...")
        converter = DocumentConverter()
        
        model_id = "sentence-transformers/all-mpnet-base-v2"
        tokenizer = AutoTokenizer.from_pretrained(model_id)
        chunker = HybridChunker(
            tokenizer=tokenizer,
            max_tokens=384, 
            merge_peers=True
        )

        # Walk Directories
        files = []
        for root, dirs, filenames in os.walk(self.docs_path):
            for filename in filenames:
                files.append(os.path.join(root, filename))

        if not files:
            print(f"❌ No files found in {self.docs_path}")
            return

        print(f"🔍 Found {len(files)} files to process.")
        
        all_chunks_for_db = []
        
        for file_path in files:
            if not (file_path.lower().endswith(".pdf") or file_path.lower().endswith(".md")): 
                continue
                
            try:
                print(f"📄 Parsing: {file_path}")
                result = converter.convert(file_path)
                doc = result.document
                
                # Get Metadata
                base_meta = self._get_file_metadata(file_path)
                
                # Verify we have text
                if not doc.export_to_markdown().strip():
                    print(f"⚠️  Warning: No text found in {os.path.basename(file_path)}")
                    continue
                
                # Chunking
                chunk_iter = chunker.chunk(dl_doc=doc)
                
                file_chunk_count = 0
                for chunk in chunk_iter:
                    combined_meta = base_meta.copy()
                    if chunk.meta: combined_meta.update(chunk.meta)
                    
                    sanitized_meta = {}
                    for k, v in combined_meta.items():
                        if isinstance(v, (str, int, float, bool)):
                            sanitized_meta[k] = v
                        else:
                            sanitized_meta[k] = str(v)

                    text_content = chunker.contextualize(chunk=chunk)
                    all_chunks_for_db.append(Document(page_content=text_content, metadata=sanitized_meta))
                    file_chunk_count += 1
                
                print(f"   -> {file_chunk_count} chunks.")

            except Exception as e:
                print(f"❌ Error processing {file_path}: {e}")

        if not all_chunks_for_db: return

        # 3. Add to ChromaDB in Batches
        print(f"💾 Adding {len(all_chunks_for_db)} chunks to ChromaDB...")
        batch_size = 10
        for i in range(0, len(all_chunks_for_db), batch_size):
            batch = all_chunks_for_db[i:i + batch_size]
            self.vector_db.add_documents(batch)
            print(f"   Processed batch {i // batch_size + 1}...")

        print("✅ Ingestion Complete.")

    def query(self, query_text: str, k: int = 4, filters: Optional[Dict] = None) -> str:
        """
        Queries self.vector_db and returns formatted string context.
        """
        # print(f"🔍 Semantic Search: '{query_text}' | Filters: {filters}")
        
        search_kwargs = {"k": k}
        if filters:
            search_kwargs["filter"] = filters        
        retriever = self.vector_db.as_retriever(search_kwargs=search_kwargs)
        docs = retriever.invoke(query_text)
        # docs = self.vector_db.similarity_search(query_text, k, filter=filters)

        if not docs:
            return "No relevant documents found in knowledge base."

        formatted_context = ""
        for doc in docs:
            source = doc.metadata.get("source", "unknown")
            category = doc.metadata.get("category", "general")
            formatted_context += f"\n[Source: {source} | Type: {category}]\n{doc.page_content}\n"
            
        return formatted_context

if __name__ == "__main__":
    print("="*60)
    print("Testing PM AJAY RAG System with Chroma")
    print("="*60)

    rag = PMAjayRAG()

    rag._initialize_db()
    rag.ingest_documents()
    
    query_text = 'what are the main objectives of this scheme'
    response = rag.query(query_text, k=5)
    print("\n")
    
    print("\n" + "="*60)
    print(f"Query: {query_text}")
    print("-" * 60)
    print(response)
    print("="*60)

    query_text = "scheme objectives"
    response = rag.query(query_text, k=2, filters={"category": "rules"})
    print("\n")

    print("\n" + "="*60)
    print(f"Query: {query_text}")
    print("-" * 60)
    print(response)
    print("="*60)
    