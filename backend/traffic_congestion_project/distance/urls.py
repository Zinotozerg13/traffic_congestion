from django.urls import path
from .views import geocode_location, get_route,reverse_geocode, search_location

urlpatterns = [
    path("geocode/", geocode_location),
    path("route/", get_route),
    path("reverse/", reverse_geocode),
    path("search/", search_location),
]