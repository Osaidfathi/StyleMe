from flask import Blueprint, render_template, send_from_directory
import os

admin_ui_bp = Blueprint("admin_ui_bp", __name__, url_prefix="/admin_panel")

# Serve the admin panel static files (HTML, CSS, JS)
@admin_ui_bp.route("/<path:filename>")
def serve_admin_static(filename):
    return send_from_directory(os.path.join(admin_ui_bp.root_path, "static"), filename)

@admin_ui_bp.route("/")
def admin_panel_index():
    # This will serve the index.html for the admin panel
    return send_from_directory(os.path.join(admin_ui_bp.root_path, "static"), "index.html")


