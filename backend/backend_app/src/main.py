import os
import sys
from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.ai_routes import ai_bp
from src.routes.booking_routes import booking_bp
from src.routes.salon_dashboard import salon_dashboard_bp
from src.routes.admin_dashboard import admin_dashboard_bp
from src.routes.admin_ui_routes import admin_ui_bp
from src.routes.salon_routes import salon_routes_bp

# إصلاح مسار المشروع
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# تهيئة التطبيق
app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'change-this-secret')

# تفعيل CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})

# تسجيل الـ Blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(ai_bp, url_prefix='/api/ai')
app.register_blueprint(booking_bp, url_prefix='/api/booking')
app.register_blueprint(salon_dashboard_bp, url_prefix='/api/salon')
app.register_blueprint(admin_dashboard_bp, url_prefix="/api/admin")
app.register_blueprint(admin_ui_bp)
app.register_blueprint(salon_routes_bp, url_prefix='/api/salons')

# إعداد قاعدة البيانات
DATABASE_URL = os.environ.get(
    'DATABASE_URL',
    'sqlite:///' + os.path.join(os.path.dirname(__file__), 'database', 'app.db')
)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
with app.app_context():
    db.create_all()

# تقديم ملفات الواجهة الأمامية
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if not static_folder_path or not os.path.exists(static_folder_path):
        return "Static folder not configured", 404

    if path and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    elif os.path.exists(os.path.join(static_folder_path, 'index.html')):
        return send_from_directory(static_folder_path, 'index.html')
    else:
        return "index.html not found", 404

# لا نستخدم app.run لأن Vercel يدير الخادم
# الكائن app سيكون هو نقطة الدخول في Vercel
