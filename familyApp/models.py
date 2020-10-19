from django.contrib.auth.models import AbstractUser
from django.db import models
import datetime

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=30)
    role = models.CharField(max_length=15, blank=True)
    group = models.CharField(max_length=50, blank=True)
    calendarEmail = models.EmailField(blank=True)
    profile_pic = models.ImageField(blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name']


class CalendarEvent(models.Model):
    name = models.CharField(max_length=100)
    date = models.DateField()
    time = models.TimeField()
    owner = models.ForeignKey("CustomUser", on_delete=models.CASCADE)
    members = models.ManyToManyField("CustomUser", related_name="event_members")

class Calendar(models.Model):
    owner = models.ForeignKey("CustomUser", on_delete=models.CASCADE)
    events = models.ForeignKey("CalendarEvent", on_delete=models.PROTECT)

class TodoList(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey("CustomUser", on_delete=models.CASCADE)
    members = models.ManyToManyField("CustomUser", related_name="list_members")

class TodoEvent(models.Model):
    name = models.CharField(max_length=100)
    dealine = models.DateTimeField()
    owner = models.ForeignKey("CustomUser", on_delete=models.CASCADE)
    list = models.ForeignKey("TodoList", on_delete=models.CASCADE)

class Message(models.Model):
    sender = models.ForeignKey("CustomUser", on_delete=models.CASCADE)
    timestamp = models.DateTimeField()
    content = models.TextField(max_length=480)
