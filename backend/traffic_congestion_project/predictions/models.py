from django.db import models

class TrafficPrediction(models.Model):
    distance_km = models.FloatField()
    time_in_hours = models.FloatField()
    road_type = models.CharField(max_length=50)
    weather = models.CharField(max_length=50)
    date = models.DateField()

    congestion_index = models.FloatField()
    travel_time_minutes = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.distance_km} km - {self.travel_time_minutes} min"