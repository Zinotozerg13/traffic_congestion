from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Member


class RegisterSerializer(serializers.Serializer):
    firstname = serializers.CharField(max_length=255, min_length=3,
        error_messages={
            "min_length": "First name must be at least 3 characters long."
        })
    lastname = serializers.CharField(max_length=255,min_length=3,
        error_messages={
            "min_length": "Last name must be at least 3 characters long."
        })
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(max_length=255, write_only=True)
    phone_number = serializers.CharField(max_length=15,min_length=10,
                                         error_messages={
                                             "min_length": "Phone number must be at least 10 characters long."
                                         },
                                         required=False, allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        phone_number = validated_data.pop('phone_number', None)

        # Step 1: Create Django User (handles password hashing + JWT compatibility)
        user = User.objects.create_user(
            username=validated_data['email'],   # use email as username
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['firstname'],
            last_name=validated_data['lastname'],
        )

        # Step 2: Create Member profile linked to User
        Member.objects.create(
            user=user,
            phone_number=phone_number,
        )

        return user


class LoginSerializer(serializers.Serializer):
    """Validates login credentials"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError("Email and password are required.")

        # Authenticate using username (which is the email in your case)
        user = authenticate(username=email, password=password)

        if user is None:
            raise serializers.ValidationError("Invalid email or password.")

        if not user.is_active:
            raise serializers.ValidationError("This account is disabled.")

        # Attach user to validated_data so view can access it
        data['user'] = user
        return data


class MemberProfileSerializer(serializers.Serializer):
    """Read-only serializer to return user info after login/register"""
    firstname = serializers.CharField(source='first_name')
    lastname = serializers.CharField(source='last_name')
    email = serializers.EmailField()
    phone_number = serializers.CharField(source='member.phone_number', allow_null=True)