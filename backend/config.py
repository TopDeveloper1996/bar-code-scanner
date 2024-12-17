import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')
    BARCODE_API_KEY = os.getenv('BARCODE_API_KEY')
    FLASK_ENV = os.getenv('FLASK_ENV', 'production')