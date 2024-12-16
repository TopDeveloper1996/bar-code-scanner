from supabase import create_client
from config import Config

# Create a single supabase client instance
supabase = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY) 

def get_products_info(barcodes):
    try:
        response = supabase.table('stock').select('*').in_('barcode', barcodes).execute()
        
        # Transform the response to match the expected format
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