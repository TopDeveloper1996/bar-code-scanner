from flask import Flask, render_template, send_from_directory
from flask_cors import CORS
from config import Config

def create_app(config_class=Config):
    # app = Flask(__name__)
    app = Flask(__name__, 
            static_folder='static',
            template_folder='templates')

    @app.route('/')
    def serve_react():
        return render_template('index.html')

    @app.route('/static/<path:path>')
    def serve_static(path):
        return send_from_directory('static', path)
    
    app.config.from_object(config_class)
    
    # Configure CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",  # Development
                "https://bls.unitopsmedia.com"  # Production
            ],
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Register blueprints
    from app.routes.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}
    
    return app