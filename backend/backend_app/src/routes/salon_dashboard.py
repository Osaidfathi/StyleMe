from flask import Blueprint, request, jsonify
from src.models.user import db, User
from src.models.booking import Salon, Barber, Booking
from datetime import datetime, timedelta

salon_dashboard_bp = Blueprint('salon_dashboard_bp', __name__)

@salon_dashboard_bp.route('/salon/<int:salon_id>/dashboard', methods=['GET'])
def get_salon_dashboard(salon_id):
    try:
        salon = Salon.query.get_or_404(salon_id)
        
        # Get today's bookings
        today = datetime.now().date()
        today_bookings = Booking.query.filter(
            Booking.salon_id == salon_id,
            db.func.date(Booking.booking_time) == today
        ).all()
        
        # Get this week's bookings
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)
        week_bookings = Booking.query.filter(
            Booking.salon_id == salon_id,
            db.func.date(Booking.booking_time) >= week_start,
            db.func.date(Booking.booking_time) <= week_end
        ).all()
        
        # Get pending bookings
        pending_bookings = Booking.query.filter(
            Booking.salon_id == salon_id,
            Booking.status == 'pending'
        ).all()
        
        dashboard_data = {
            'salon_name': salon.name,
            'today_bookings_count': len(today_bookings),
            'week_bookings_count': len(week_bookings),
            'pending_bookings_count': len(pending_bookings),
            'today_bookings': [
                {
                    'id': b.id,
                    'user_name': b.user.username,
                    'barber_name': b.barber.name if b.barber else None,
                    'booking_time': b.booking_time.isoformat(),
                    'status': b.status
                } for b in today_bookings
            ],
            'pending_bookings': [
                {
                    'id': b.id,
                    'user_name': b.user.username,
                    'barber_name': b.barber.name if b.barber else None,
                    'booking_time': b.booking_time.isoformat(),
                    'status': b.status
                } for b in pending_bookings
            ]
        }
        
        return jsonify(dashboard_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@salon_dashboard_bp.route('/salon/<int:salon_id>/barbers', methods=['GET'])
def get_salon_barbers(salon_id):
    try:
        barbers = Barber.query.filter_by(salon_id=salon_id).all()
        barber_list = [
            {
                'id': b.id,
                'name': b.name,
                'specialty': b.specialty
            } for b in barbers
        ]
        return jsonify({'barbers': barber_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@salon_dashboard_bp.route('/salon/<int:salon_id>/barbers', methods=['POST'])
def add_barber(salon_id):
    try:
        data = request.json
        if 'name' not in data:
            return jsonify({'error': 'Barber name is required'}), 400
        
        barber = Barber(
            name=data['name'],
            specialty=data.get('specialty', ''),
            salon_id=salon_id
        )
        
        db.session.add(barber)
        db.session.commit()
        
        return jsonify({'message': 'Barber added successfully', 'barber_id': barber.id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@salon_dashboard_bp.route('/salon/<int:salon_id>/barber/<int:barber_id>', methods=['PUT'])
def update_barber(salon_id, barber_id):
    try:
        data = request.json
        barber = Barber.query.filter_by(id=barber_id, salon_id=salon_id).first_or_404()
        
        if 'name' in data:
            barber.name = data['name']
        if 'specialty' in data:
            barber.specialty = data['specialty']
        
        db.session.commit()
        
        return jsonify({'message': 'Barber updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@salon_dashboard_bp.route('/salon/<int:salon_id>/barber/<int:barber_id>', methods=['DELETE'])
def delete_barber(salon_id, barber_id):
    try:
        barber = Barber.query.filter_by(id=barber_id, salon_id=salon_id).first_or_404()
        
        db.session.delete(barber)
        db.session.commit()
        
        return jsonify({'message': 'Barber deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@salon_dashboard_bp.route('/salon/<int:salon_id>/analytics', methods=['GET'])
def get_salon_analytics(salon_id):
    try:
        # Get bookings for the last 30 days
        thirty_days_ago = datetime.now() - timedelta(days=30)
        recent_bookings = Booking.query.filter(
            Booking.salon_id == salon_id,
            Booking.booking_time >= thirty_days_ago
        ).all()
        
        # Calculate analytics
        total_bookings = len(recent_bookings)
        completed_bookings = len([b for b in recent_bookings if b.status == 'completed'])
        cancelled_bookings = len([b for b in recent_bookings if b.status == 'cancelled'])
        
        analytics_data = {
            'total_bookings_30_days': total_bookings,
            'completed_bookings_30_days': completed_bookings,
            'cancelled_bookings_30_days': cancelled_bookings,
            'completion_rate': (completed_bookings / total_bookings * 100) if total_bookings > 0 else 0
        }
        
        return jsonify(analytics_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

