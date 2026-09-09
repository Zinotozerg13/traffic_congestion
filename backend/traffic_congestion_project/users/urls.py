# urls.py
from django.urls import path
from .views import register_member,login_member,logout_member,profile_member



urlpatterns = [
    path('users/register/', register_member, name='register_member'),
    path('users/login/', login_member, name='login_member'),
    path('users/logout/', logout_member, name='logout_member'),
    path('users/profile/', profile_member, name='profile_member'),
]
