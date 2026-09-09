from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .serializers import RegisterSerializer, MemberProfileSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register_member(request):
    serializer = RegisterSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # This creates both User + Member profile
    user = serializer.save()

    # Now JWT works — user is a real Django User
    refresh = RefreshToken.for_user(user)

    return Response({
        "message": "Registration successful",
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": MemberProfileSerializer(user).data,
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_member(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response(
            {"error": "Email and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Authenticate using email (which is also the username)
    user = authenticate(request, username=email, password=password)

    if user is None:
        return Response(
            {"error": "Invalid email or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)

    return Response({
        "message": "Login successful",
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": MemberProfileSerializer(user).data,
    }, status=status.HTTP_200_OK)
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Requires valid access token
def logout_member(request):
    """
    POST /api/logout/
    Headers: Authorization: Bearer <access_token>
    Body: { "refresh": "<refresh_token>" }
    
    Blacklists the refresh token so it cannot be reused.
    """
    refresh_token = request.data.get('refresh')

    if not refresh_token:
        return Response(
            {"error": "Refresh token is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Blacklist the refresh token
        token = RefreshToken(refresh_token)
        token.blacklist()
        
        return Response(
            {"message": "Logout successful. Token has been blacklisted."},
            status=status.HTTP_200_OK
        )
    except TokenError:
        return Response(
            {"error": "Invalid or expired refresh token"},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Requires valid access token
def profile_member(request):
    """
    GET /api/profile/
    Headers: Authorization: Bearer <access_token>
    
    Returns the currently authenticated user's profile information.
    """
    user = request.user  # Automatically loaded from the JWT token
    serializer = MemberProfileSerializer(user)
    
    return Response({
        "user": serializer.data
    }, status=status.HTTP_200_OK)