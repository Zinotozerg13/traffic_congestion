import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response


def get_road_type(lat, lon):
    overpass_url = "https://overpass-api.de/api/interpreter"

    query = f"""
    [out:json];
    way(around:50,{lat},{lon})["highway"];
    out tags;
    """

    response = requests.get(overpass_url, params={'data': query})

    if response.status_code != 200:
        return "urban"

    data = response.json()

    if not data.get("elements"):
        return "urban"

    highway_type = data["elements"][0]["tags"].get("highway", "residential")

    if highway_type in ["motorway", "trunk"]:
        return "freeway"
    elif highway_type in ["primary", "secondary"]:
        return "urban"
    else:
        return "congested"
# -------------------------
# 1️⃣ GEOCODE (Address → Lat/Lon)
# -------------------------
@api_view(['GET'])
def geocode_location(request):
    place = request.GET.get("place")

    if not place:
        return Response({"error": "Place is required"}, status=400)

    url = "https://nominatim.openstreetmap.org/search"

    params = {
        "q": place,
        "format": "json",
        "limit": 1
    }

    headers = {
        "User-Agent": "distance-project"
    }

    response = requests.get(url, params=params, headers=headers)

    if response.status_code != 200:
        return Response({"error": "Geocoding failed"}, status=500)

    data = response.json()

    if not data:
        return Response({"error": "Location not found"}, status=404)

    return Response({
        "latitude": data[0]["lat"],
        "longitude": data[0]["lon"],
        "display_name": data[0]["display_name"]
    })


# -------------------------
# 2️⃣ ROUTE + DISTANCE
# -------------------------
from collections import Counter

@api_view(['GET'])
def get_route(request):
    lat1 = request.GET.get("lat1")
    lon1 = request.GET.get("lon1")
    lat2 = request.GET.get("lat2")
    lon2 = request.GET.get("lon2")

    if not all([lat1, lon1, lat2, lon2]):
        return Response({"error": "All coordinates required"}, status=400)

    # 🔥 Request FULL geometry in geojson format
    url = f"http://router.project-osrm.org/route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=full&geometries=geojson"

    response = requests.get(url)

    if response.status_code != 200:
        return Response({"error": "Routing failed"}, status=500)

    data = response.json()

    if data["code"] != "Ok":
        return Response({"error": "Route not found"}, status=404)

    route = data["routes"][0]
    coordinates = route["geometry"]["coordinates"]

    # -----------------------------
    # 🔥 LEVEL 2 ROAD TYPE LOGIC
    # -----------------------------

    if len(coordinates) < 3:
        # fallback to start point only
        road_type = get_road_type(lat1, lon1)
    else:
        sample_points = [
            coordinates[0],                              # start
            coordinates[len(coordinates)//2],           # middle
            coordinates[-1]                             # end
        ]

        detected_types = []

        for lon, lat in sample_points:
            rt = get_road_type(lat, lon)
            detected_types.append(rt)

        # choose most common road type
        road_type = Counter(detected_types).most_common(1)[0][0]

    # -----------------------------

    return Response({
        "distance_km": round(route["distance"] / 1000, 2),
        "duration_minutes": round(route["duration"] / 60, 2),
        "geometry": route["geometry"],
        "road_type": road_type
    })

@api_view(['GET'])
def reverse_geocode(request):
    lat = request.GET.get("lat")
    lon = request.GET.get("lon")

    url = "https://nominatim.openstreetmap.org/reverse"

    params = {
        "lat": lat,
        "lon": lon,
        "format": "json"
    }

    headers = {
        "User-Agent": "distance-project"
    }

    response = requests.get(url, params=params, headers=headers)
    data = response.json()

    return Response({
        "display_name": data.get("display_name")
    })

@api_view(['GET'])
def search_location(request):
    query = request.GET.get("q")

    url = "https://nominatim.openstreetmap.org/search"

    params = {
        "q": query,
        "format": "json",
        "limit": 5
    }

    headers = {
        "User-Agent": "distance-project"
    }

    response = requests.get(url, params=params, headers=headers)
    return Response(response.json())
