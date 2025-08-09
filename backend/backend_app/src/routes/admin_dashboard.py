from flask import Blueprint, request, jsonify
from src.models.user import db, User
from src.models.booking import Salon, Barber, Booking
from datetime import datetime, timedelta
from sqlalchemy import func

admin_dashboard_bp = Blueprint('admin_dashboard_bp', __name__)

@admin_dashboard_bp.route('/admin/dashboard', methods=['GET'])
def get_admin_dashboard():
    try:
        # Get overall statistics
        total_users = User.query.count()
        total_salons = Salon.query.count()
        approved_salons = Salon.query.filter_by(is_approved=True).count()
        pending_salons = Salon.query.filter_by(is_approved=False).count()
        total_bookings = Booking.query.count()
        
        # Get recent activity (last 7 days)
        week_ago = datetime.now() - timedelta(days=7)
        recent_users = User.query.filter(User.id >= week_ago).count()  # Assuming id is auto-increment and correlates with time
        recent_bookings = Booking.query.filter(Booking.booking_time >= week_ago).count()
        
        dashboard_data = {
            'total_users': total_users,
            'total_salons': total_salons,
            'approved_salons': approved_salons,
            'pending_salons': pending_salons,
            'total_bookings': total_bookings,
            'recent_users_7_days': recent_users,
            'recent_bookings_7_days': recent_bookings
        }
        
        return jsonify(dashboard_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_dashboard_bp.route('/admin/users', methods=['GET'])
def get_all_users():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        users = User.query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        user_list = [
            {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'bookings_count': len(user.bookings) if hasattr(user, 'bookings') else 0
            } for user in users.items
        ]
        
        return jsonify({
            'users': user_list,
            'total': users.total,
            'pages': users.pages,
            'current_page': page
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_dashboard_bp.route('/admin/salons', methods=['GET'])
def get_all_salons():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')  # 'approved', 'pending', or None for all
        
        query = Salon.query
        if status == 'approved':
            query = query.filter_by(is_approved=True)
        elif status == 'pending':
            query = query.filter_by(is_approved=False)
        
        salons = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        salon_list = [
            {
                'id': salon.id,
                'name': salon.name,
                'address': salon.address,
                'phone': salon.phone,
                'email': salon.email,
                'is_approved': salon.is_approved,
                'owner_name': salon.owner.username,
                'barbers_count': len(salon.barbers),
                'bookings_count': len(salon.bookings)
            } for salon in salons.items
        ]
        
        return jsonify({
            'salons': salon_list,
            'total': salons.total,
            'pages': salons.pages,
            'current_page': page
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_dashboard_bp.route('/admin/salon/<int:salon_id>/approve', methods=['PUT'])
def approve_salon(salon_id):
    try:
        salon = Salon.query.get_or_404(salon_id)
        salon.is_approved = True
        db.session.commit()
        
        return jsonify({'message': 'Salon approved successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_dashboard_bp.route('/admin/salon/<int:salon_id>/reject', methods=['PUT'])
def reject_salon(salon_id):
    try:
        salon = Salon.query.get_or_404(salon_id)
        salon.is_approved = False
        db.session.commit()
        
        return jsonify({'message': 'Salon rejected successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_dashboard_bp.route('/admin/bookings', methods=['GET'])
def get_all_bookings():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')  # Filter by status if provided
        
        query = Booking.query
        if status:
            query = query.filter_by(status=status)
        
        bookings = query.order_by(Booking.booking_time.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        booking_list = [
            {
                'id': booking.id,
                'user_name': booking.user.username,
                'salon_name': booking.salon.name,
                'barber_name': booking.barber.name if booking.barber else None,
                'booking_time': booking.booking_time.isoformat(),
                'status': booking.status
            } for booking in bookings.items
        ]
        
        return jsonify({
            'bookings': booking_list,
            'total': bookings.total,
            'pages': bookings.pages,
            'current_page': page
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_dashboard_bp.route('/admin/analytics', methods=['GET'])
def get_admin_analytics():
    try:
        # Get booking trends for the last 30 days
        thirty_days_ago = datetime.now() - timedelta(days=30)
        
        # Daily booking counts for the last 30 days
        daily_bookings = db.session.query(
            func.date(Booking.booking_time).label('date'),
            func.count(Booking.id).label('count')
        ).filter(
            Booking.booking_time >= thirty_days_ago
        ).group_by(
            func.date(Booking.booking_time)
        ).all()
        
        # Top performing salons (by booking count)
        top_salons = db.session.query(
            Salon.name,
            func.count(Booking.id).label('booking_count')
        ).join(Booking).group_by(Salon.id).order_by(
            func.count(Booking.id).desc()
        ).limit(5).all()
        
        analytics_data = {
            'daily_bookings': [
                {
                    'date': str(booking.date),
                    'count': booking.count
                } for booking in daily_bookings
            ],
            'top_salons': [
                {
                    'salon_name': salon.name,
                    'booking_count': salon.booking_count
                } for salon in top_salons
            ]
        }
        
        return jsonify(analytics_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

