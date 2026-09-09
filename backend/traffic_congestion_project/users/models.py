from django.db import models
from django.contrib.auth.models import User


class Member(models.Model):
    # Links to Django's User — this is what makes JWT work
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='member')

    # Only keep fields that Django's User doesn't already have
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"