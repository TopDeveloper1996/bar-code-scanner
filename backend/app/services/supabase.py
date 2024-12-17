from supabase import create_client
from config import Config
import os

def get_supabase_client():
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_KEY')
    
    if not url or not key:
        print(f"Supabase URL: {url}")  # For debugging
        print(f"Supabase Key length: {len(key) if key else 'None'}")  # For debugging
        raise ValueError("Supabase URL and Key must be provided")
        
    return create_client(url, key)

supabase = get_supabase_client()

def get_products_info(barcodes):
    try:
        response = supabase.table('stock').select('*').in_('barcode', barcodes).execute()
        
        products = []
        for item in response.data:
            products.append({
                'barcode': item['barcode'],
                'title': item['title'],
                'quantity': item['quantity'],
                'fromScan': False
            })
        
        return products
    except Exception as e:
        print(f"Error fetching products from Supabase: {str(e)}")
        raise e 