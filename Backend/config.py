from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    
    # Neo4j Aura Database Connection
    NEO4J_URI = os.getenv('NEO4J_URI')
    NEO4J_USER = os.getenv('NEO4J_USER')
    NEO4J_PASSWORD = os.getenv('NEO4J_PASSWORD')
    
    # JWT Authentication
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600))  # Default: 1 hour
    
    # File Uploads
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}
    
    @staticmethod
    def is_allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS
