from flask import Blueprint, jsonify, request, current_app
from app.services.supabase import get_products_info, supabase
from werkzeug.exceptions import BadRequest, Unauthorized
import requests
from flask_cors import cross_origin

bp = Blueprint('api', __name__)

@bp.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "API is working!"})

@bp.route('/items', methods=['GET'])
def get_items():
    # Placeholder for database integration
    items = [
        {"barcode": "123", "name": "Test Item", "brand": "Test Brand", "stock": 10}
    ]
    return jsonify(items)

@bp.route('/scan', methods=['POST'])
def scan_barcode():
    data = request.get_json()
    barcode = data.get('barcode')
    return jsonify({
        "barcode": barcode,
        "name": "Sample Item",
        "brand": "Sample Brand",
        "stock": 100
    })

@bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            raise BadRequest('Email and password are required')

        # Sign in with Supabase
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        return jsonify({
            'token': response.session.access_token,
            'user': response.user,
            'message': 'Login successful'
        })
        
    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 401

@bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            raise BadRequest('Email and password are required')

        # Sign up with Supabase
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })
        
        return jsonify({
            'message': 'Signup successful',
            'user': response.user
        })
        
    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 400

@bp.route('/auth/google', methods=['GET'])
def google_auth():
    try:
        provider = 'google'
        redirect_url = f"{request.host_url}auth/callback"
        
        response = supabase.auth.sign_in_with_oauth({
            "provider": provider,
            "options": {
                "redirect_to": redirect_url
            }
        })
        
        return jsonify({
            'url': response.url
        })
        
    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 500

@bp.route('/auth/apple', methods=['GET'])
def apple_auth():
    try:
        provider = 'apple'
        redirect_url = f"{request.host_url}auth/callback"
        
        response = supabase.auth.sign_in_with_oauth({
            "provider": provider,
            "options": {
                "redirect_to": redirect_url
            }
        })
        
        return jsonify({
            'url': response.url
        })
        
    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 500

@bp.route('/auth/callback')
def auth_callback():
    # Handle OAuth callback
    try:
        code = request.args.get('code')
        if not code:
            raise BadRequest('No code provided')
            
        # Exchange code for session
        session = supabase.auth.exchange_code_for_session(code)
        
        # Redirect to frontend with token
        frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:5173')
        return redirect(f"{frontend_url}?token={session.access_token}")
        
    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 400

@bp.route('/barcodescan', methods=['GET'])
def barcode_scan():
    try:
        barcode = request.args.get('barcode')
        if not barcode:
            raise BadRequest('Barcode is required')

        # Get API key from config
        api_key = current_app.config.get('BARCODE_API_KEY')
        if not api_key:
            raise Exception('Barcode API key not configured')

        # Call external barcode API with API key
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        api_url = f"https://api.barcodelookup.com/v3/products?barcode={barcode}&key={api_key}"
        
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        
        # Extract relevant information
        if data.get('products'):
            product = data['products'][0]  # Get first match
            return jsonify({
                'title': product.get('title', 'Unknown Product'),
                'brand': product.get('brand', 'Unknown Brand'),
                'image': product.get('images', '')[0],
                'description': product.get('description', ''),
                'category': product.get('category', 'General')
            })
        
        return jsonify({
            'message': 'Product not found'
        }), 404
        # return jsonify({
        #         'title': f'{barcode}',
        #         'brand': 'Apple Brand',
        #         'image': 'watch.png',
        #         'description': '',
        #         'category': ''
        #     })
        
    except requests.RequestException as e:
        return jsonify({
            'message': f'External API error: {str(e)}'
        }), 503
    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 400

@bp.route('/scanned_products_info', methods=['POST'])
def get_scanned_products_info():
    data = request.get_json()
    barcodes = data.get('barcodes', [])
    scan_history = data.get('scanHistory', [])
    
    if not barcodes:
        return jsonify([])
    
    try:
        # Create scan history lookup dict first to avoid repeated lookups
        scan_dict = {item['barcode']: item for item in scan_history}
        
        # Get all products in a single query
        response = supabase.table('stock').select('*').in_('barcode', barcodes).execute()
        stock_products = {item['barcode']: item for item in response.data}
        
        # Combine results efficiently
        products_info = []
        for barcode in barcodes:
            if barcode in stock_products:
                item = stock_products[barcode]
                products_info.append({
                    'barcode': item['barcode'],
                    'title': item['title'],
                    'quantity': item['quantity'],
                    'fromScan': False
                })
            elif barcode in scan_dict:
                scan_info = scan_dict[barcode]
                products_info.append({
                    'barcode': barcode,
                    'quantity': 0,
                    'brand': scan_info['brand'],
                    'title': scan_info['title'],
                    'image': scan_info['image'],
                    'fromScan': True
                })
        
        return jsonify(products_info)
    except Exception as e:
        print(f"Error in get_scanned_products_info: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('/quantity_update', methods=['POST'])
def update_quantities():
    try:
        data = request.get_json()
        products = data.get('products', [])
        
        if not products:
            return jsonify({'message': 'No products to update'}), 400
        
        for product in products:
            barcode = product['barcode']
            count = product['count']
            
            # Try to get existing product from stock
            existing_product = supabase.table('stock').select('*').eq('barcode', barcode).execute()
            
            if existing_product.data:
                # Update existing product
                current_quantity = existing_product.data[0]['quantity']
                supabase.table('stock').update({
                    'quantity': current_quantity + count
                }).eq('barcode', barcode).execute()
            else:
                # Create new product record with scanned count as quantity
                supabase.table('stock').insert({
                    'barcode': barcode,
                    'title': product.get('title', ''),  # Changed from 'name' to 'title'
                    'quantity': count,  # Using the scanned count as initial quantity
                    'image': product.get('image', ''),
                    'brand': product.get('brand', '')
                }).execute()
        
        return jsonify({'message': 'Successfully updated quantities'}), 200
        
    except Exception as e:
        print(f"Error updating quantities: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('/item_info/<barcode>', methods=['GET'])
def get_item_info(barcode):
    try:
        response = supabase.table('stock').select('*').eq('barcode', barcode).execute()
        
        if not response.data:
            return jsonify({'error': 'Item not found'}), 404
            
        item = response.data[0]
        
        return jsonify({
            'title': item['title'],
            'brand': item['brand'],
            'quantity': item['quantity'],
            'last_edit': item.get('last_edit'),
            'barcode': item['barcode'],
            'category': item['category'],
            'image': item.get('image')
        })
        
    except Exception as e:
        print(f"Error fetching item info: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('/category_info/<category>', methods=['GET'])
def get_category_info(category):
    try:
        # Get all records from stock table
        response = supabase.table('stock').select('*').execute()
        if not response.data:
            return jsonify({
                'categories': [],
                'items': []
            })

        items = response.data
        
        # Get barcodes of direct items in this category
        direct_items = [item['barcode'] for item in items if item.get('category') == category]

        # Get subcategories and their quantities
        categories_info = []
        
        # Find potential subcategories (starting with category name)
        potential_subcats = [
            item['category'] for item in items 
            if item['category'].startswith(category) 
            and item['category'] != category
            and item['category'][len(category):].count('>') == 1
        ]
        
        # For each potential subcategory, calculate total quantity
        for subcat in potential_subcats:
            # Get all items in this subcategory (including nested ones)
            subcat_items = [
                item['quantity'] for item in items 
                if item['category'].startswith(subcat)
            ]
            
            if subcat_items:
                categories_info.append({
                    'categoryName': subcat,
                    'sumQuantity': sum(subcat_items)
                })

        # Calculate total quantity for this category
        subTotalQuantity = sum(
            item['quantity'] for item in items 
            if item.get('category', '').startswith(category)
        )

        return jsonify({
            'categories': categories_info,
            'items': direct_items,
            'subTotalQuantity': subTotalQuantity
        })
        
    except Exception as e:
        print(f"Error fetching category info: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('/categories', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_categories():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})
        
    try:
        # Get all items from stock table
        response = supabase.table('stock').select('category,quantity').execute()
        if not response.data:
            return jsonify([])

        # Process categories
        category_counts = {}
        for item in response.data:
            category = item.get('category', '').split('>')[0]  # Get top-level category
            if category:
                if category not in category_counts:
                    category_counts[category] = {
                        'name': category,
                        'itemCount': 0
                    }
                category_counts[category]['itemCount'] += item.get('quantity', 0)

        return jsonify(list(category_counts.values()))
    except Exception as e:
        print(f"Error fetching categories: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('/stock/update/<barcode>', methods=['PUT'])
def update_stock_item(barcode):
    try:
        data = request.get_json()
        
        # Only include fields that exist in the schema
        update_data = {
            'title': data['title'],
            'barcode': data['barcode'],
            'quantity': data['quantity'],
            'brand': data['brand'],
            'category': data['category'],
            'last_edit': data['last_edit'],
            'image': data.get('image')
        }
        
        response = supabase.table('stock').update(update_data).eq('barcode', barcode).execute()
        
        if not response.data:
            return jsonify({'error': 'Item not found'}), 404
            
        return jsonify({'message': 'Successfully updated stock item'}), 200
        
    except Exception as e:
        print(f"Error updating stock item: {str(e)}")
        return jsonify({'error': str(e)}), 500