from django.urls import path

from . import views

urlpatterns = [
    path("", views.loginView, name="index"),
    path("register", views.registerUser, name="register"),
    path("calendar", views.calendarView, name="calendar"),
    path("send", views.sendMessage, name="send"),
    path("getMessages", views.retrieveMessages, name="retrieve"),
    path("createList", views.createList, name="create")
]
