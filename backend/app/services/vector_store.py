import chromadb
from chromadb.config import Settings
import os

# This creates a folder called 'chroma_db' inside your backend/data directory
DB_PATH = os.path.join(os.path.dirname(__file__), "../../data/chroma_db")

def get_vector_db():
    client = chromadb.PersistentClient(path=DB_PATH)
    # Create or load the collection for your product catalog
    collection = client.get_or_create_collection(name="products_services")
    return collection