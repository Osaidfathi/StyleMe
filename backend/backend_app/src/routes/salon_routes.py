from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.booking import Salon, Barber
import math

salon_routes_bp = Blueprint('salon_routes_bp', __name__)

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two points using Haversine formula"""
    if not all([lat1, lon1, lat2, lon2]):
        return float('inf')
    
    # Convert latitude and longitude from degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Radius of earth in kilometers
    r = 6371
    
    return c * r

@salon_routes_bp.route('/nearby', methods=['POST'])
def get_nearby_salons():
    try:
        data = request.json
        user_lat = data.get('latitude')
        user_lon = data.get('longitude')
        radius = data.get('radius', 50)  # Default 50km radius
        
        if not user_lat or not user_lon:
            return jsonify({'error': 'User location (latitude and longitude) is required'}), 400
        
        # Get all approved salons
        salons = Salon.query.filter_by(is_approved=True).all()
        
        nearby_salons = []
        for salon in salons:
            if salon.latitude and salon.longitude:
                distance = calculate_distance(user_lat, user_lon, salon.latitude, salon.longitude)
                if distance <= radius:
                    salon_data = salon.to_dict()
                    salon_data['distance'] = round(distance, 2)
                    nearby_salons.append(salon_data)
        
        # Sort by distance
        nearby_salons.sort(key=lambda x: x['distance'])
        
        return jsonify({
            'salons': nearby_salons,
            'total_count': len(nearby_salons),
            'search_radius': radius
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@salon_routes_bp.route('/by_city', methods=['GET'])
def get_salons_by_city():
    try:
        city = request.args.get('city')
        country = request.args.get('country')
        
        query = Salon.query.filter_by(is_approved=True)
        
        if city:
            query = query.filter(Salon.city.ilike(f'%{city}%'))
        if country:
            query = query.filter(Salon.country.ilike(f'%{country}%'))
        
        salons = query.all()
        
        salon_list = []
        for salon in salons:
            salon_data = salon.to_dict()
            # Get barbers for this salon
            barbers = Barber.query.filter_by(salon_id=salon.id).all()
            salon_data['barbers'] = [{'id': b.id, 'name': b.name, 'specialty': b.specialty} for b in barbers]
            salon_list.append(salon_data)
        
        return jsonify({
            'salons': salon_list,
            'total_count': len(salon_list),
            'filters': {'city': city, 'country': country}
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@salon_routes_bp.route('/all', methods=['GET'])
def get_all_salons():
    try:
        # Get all approved salons
        salons = Salon.query.filter_by(is_approved=True).all()
        
        salon_list = []
        for salon in salons:
            salon_data = salon.to_dict()
            # Get barbers for this salon
            barbers = Barber.query.filter_by(salon_id=salon.id).all()
            salon_data['barbers'] = [{'id': b.id, 'name': b.name, 'specialty': b.specialty} for b in barbers]
            salon_list.append(salon_data)
        
        return jsonify({
            'salons': salon_list,
            'total_count': len(salon_list)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@salon_routes_bp.route('/<int:salon_id>', methods=['GET'])
def get_salon_details(salon_id):
    try:
        salon = Salon.query.get(salon_id)
        if not salon:
            return jsonify({'error': 'Salon not found'}), 404
        
        if not salon.is_approved:
            return jsonify({'error': 'Salon is not approved'}), 403
        
        salon_data = salon.to_dict()
        
        # Get barbers for this salon
        barbers = Barber.query.filter_by(salon_id=salon.id).all()
        salon_data['barbers'] = [{'id': b.id, 'name': b.name, 'specialty': b.specialty} for b in barbers]
        
        return jsonify({'salon': salon_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

