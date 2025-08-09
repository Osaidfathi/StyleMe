import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS # Import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.ai_routes import ai_bp # Import AI blueprint
from src.routes.booking_routes import booking_bp # Import Booking blueprint
from src.routes.salon_dashboard import salon_dashboard_bp # Import Salon Dashboard blueprint
from src.routes.admin_dashboard import admin_dashboard_bp # Import Admin Dashboard blueprint
from src.routes.admin_ui_routes import admin_ui_bp # Import Admin UI blueprint
from src.routes.salon_routes import salon_routes_bp # Import Salon Routes blueprint
app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

CORS(app) # Enable CORS for all routes

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(ai_bp, url_prefix='/api/ai') # Register AI blueprint
app.register_blueprint(booking_bp, url_prefix='/api/booking') # Register Booking blueprint
app.register_blueprint(salon_dashboard_bp, url_prefix='/api/salon') # Register Salon Dashboard blueprint
app.register_blueprint(admin_dashboard_bp, url_prefix="/api/admin") # Register Admin Dashboard blueprint
app.register_blueprint(admin_ui_bp) # Register Admin UI blueprint
app.register_blueprint(salon_routes_bp, url_prefix='/api/salons') # Register Salon Routes blueprint

# Database configuration - use PostgreSQL if available, fallback to SQLite
DATABASE_URL = os.environ.get('DATABASE_URL', 'postgresql://neondb_owner:npg_LclTi3Qmu5nR@ep-lingering-mountain-a1vi7jm0-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require')

# If DATABASE_URL is not set or PostgreSQL is not available, fallback to SQLite
if DATABASE_URL.startswith('postgresql://'):
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
with app.app_context():
    db.create_all()

@app.route('/', defaults={'path': ''}) 
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


