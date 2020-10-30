from django.urls import path

from . import views

urlpatterns = [
    path("", views.loginView, name="index"),
    path("register", views.registerUser, name="register"),
    path("calendar", views.calendarView, name="calendar"),
    path("sendMessage", views.newMessage, name="send")
]
