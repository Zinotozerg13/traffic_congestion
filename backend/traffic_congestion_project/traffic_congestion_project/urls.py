
from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path('', include('users.urls')),
    path('admin/', admin.site.urls),
    path('', include('predictions.urls')),
    path('', include('distance.urls')),
]