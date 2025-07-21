# conduite/models.py
from django.db import models
from django.contrib.auth.models import User

class SessionConduite(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    distance_km = models.FloatField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    duree = models.DurationField(blank=True)
    meteo = models.TextField(blank=True)

    def __str__(self):
        return f"Session {self.date} - {self.distance_km:.2f} km"
