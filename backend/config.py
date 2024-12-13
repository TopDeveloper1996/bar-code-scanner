import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

class Config:
    BASE_DIR = Path(__file__).resolve().parent
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-please-change'
    DEBUG = os.environ.get('FLASK_DEBUG', True)
    
    # Supabase configuration
    SUPABASE_URL = os.environ.get('SUPABASE_URL')
    SUPABASE_KEY = os.environ.get('SUPABASE_KEY')
    SUPABASE_JWT_SECRET = os.environ.get('SUPABASE_JWT_SECRET')
    
    # Barcode API configuration
    BARCODE_API_KEY = os.environ.get('BARCODE_API_KEY')