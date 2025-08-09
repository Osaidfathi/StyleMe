from src.models.user import db
from datetime import datetime

class Salon(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    address = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    is_approved = db.Column(db.Boolean, default=False)
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    
    # Location fields for location-based filtering
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    city = db.Column(db.String(100), nullable=True)
    country = db.Column(db.String(100), nullable=True)
    
    owner = db.relationship("User", backref=db.backref("salons", lazy=True))

    barbers = db.relationship("Barber", backref="salon", lazy=True)
    bookings = db.relationship("Booking", backref="salon", lazy=True)

    def __repr__(self):
        return f"<Salon {self.name}>"
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'phone': self.phone,
            'email': self.email,
            'description': self.description,
            'is_approved': self.is_approved,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'city': self.city,
            'country': self.country
        }

class Barber(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    specialty = db.Column(db.String(120), nullable=True)
    salon_id = db.Column(db.Integer, db.ForeignKey("salon.id"), nullable=False)

    bookings = db.relationship("Booking", backref="barber", lazy=True)

    def __repr__(self):
        return f"<Barber {self.name}>"

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    salon_id = db.Column(db.Integer, db.ForeignKey("salon.id"), nullable=False)
    barber_id = db.Column(db.Integer, db.ForeignKey("barber.id"), nullable=True)
    booking_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    status = db.Column(db.String(50), nullable=False, default="pending")
    service_type = db.Column(db.String(100), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    user = db.relationship("User", backref=db.backref("bookings", lazy=True))

    def __repr__(self):
        return f"<Booking {self.id} - {self.status}>"

