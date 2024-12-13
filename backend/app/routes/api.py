from flask import Blueprint, jsonify, request, current_app
from app.services.supabase import supabase
from werkzeug.exceptions import BadRequest, Unauthorized
import requests

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
                'image': product.get('images', ['watch.png'])[0],
                'description': product.get('description', ''),
                'category': product.get('category', 'General')
            })
        
        return jsonify({
            'message': 'Product not found'
        }), 404
        
    except requests.RequestException as e:
        return jsonify({
            'message': f'External API error: {str(e)}'
        }), 503
    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 400