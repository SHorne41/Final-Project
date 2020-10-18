from django.urls import path

from . import views

urlpatterns = [
    path("", views.loginView, name="index"),
    path("register", views.registerView, name="register"),
    path("calendar", views.calendarView, name="calendar"),
]
