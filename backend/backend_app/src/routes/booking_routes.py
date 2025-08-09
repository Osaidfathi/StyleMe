from flask import Blueprint, request, jsonify
from src.models.user import db, User
from src.models.booking import Salon, Barber, Booking
from datetime import datetime

booking_bp = Blueprint('booking_bp', __name__)

@booking_bp.route('/salons', methods=['GET'])
def get_salons():
    try:
        salons = Salon.query.filter_by(is_approved=True).all()
        salon_list = []
        for salon in salons:
            salon_data = {
                'id': salon.id,
                'name': salon.name,
                'address': salon.address,
                'phone': salon.phone,
                'description': salon.description,
                'barbers': [{'id': b.id, 'name': b.name, 'specialty': b.specialty} for b in salon.barbers]
            }
            salon_list.append(salon_data)
        return jsonify({'salons': salon_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@booking_bp.route('/salon/<int:salon_id>', methods=['GET'])
def get_salon_details(salon_id):
    try:
        salon = Salon.query.get_or_404(salon_id)
        salon_data = {
            'id': salon.id,
            'name': salon.name,
            'address': salon.address,
            'phone': salon.phone,
            'description': salon.description,
            'barbers': [{'id': b.id, 'name': b.name, 'specialty': b.specialty} for b in salon.barbers]
        }
        return jsonify({'salon': salon_data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@booking_bp.route('/book', methods=['POST'])
def create_booking():
    try:
        data = request.json
        required_fields = ['user_id', 'salon_id', 'booking_time']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400

        # Parse booking time
        booking_time = datetime.fromisoformat(data['booking_time'])

        # Create new booking
        booking = Booking(
            user_id=data['user_id'],
            salon_id=data['salon_id'],
            barber_id=data.get('barber_id'),
            booking_time=booking_time,
            status='pending'
        )

        db.session.add(booking)
        db.session.commit()

        return jsonify({'message': 'Booking created successfully', 'booking_id': booking.id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@booking_bp.route('/bookings/<int:user_id>', methods=['GET'])
def get_user_bookings(user_id):
    try:
        bookings = Booking.query.filter_by(user_id=user_id).all()
        booking_list = []
        for booking in bookings:
            booking_data = {
                'id': booking.id,
                'salon_name': booking.salon.name,
                'barber_name': booking.barber.name if booking.barber else None,
                'booking_time': booking.booking_time.isoformat(),
                'status': booking.status
            }
            booking_list.append(booking_data)
        return jsonify({'bookings': booking_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@booking_bp.route('/salon/<int:salon_id>/bookings', methods=['GET'])
def get_salon_bookings(salon_id):
    try:
        bookings = Booking.query.filter_by(salon_id=salon_id).all()
        booking_list = []
        for booking in bookings:
            booking_data = {
                'id': booking.id,
                'user_name': booking.user.username,
                'barber_name': booking.barber.name if booking.barber else None,
                'booking_time': booking.booking_time.isoformat(),
                'status': booking.status
            }
            booking_list.append(booking_data)
        return jsonify({'bookings': booking_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@booking_bp.route('/booking/<int:booking_id>/status', methods=['PUT'])
def update_booking_status(booking_id):
    try:
        data = request.json
        if 'status' not in data:
            return jsonify({'error': 'Status is required'}), 400

        booking = Booking.query.get_or_404(booking_id)
        booking.status = data['status']
        db.session.commit()

        return jsonify({'message': 'Booking status updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

