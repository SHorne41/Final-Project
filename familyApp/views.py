from django.shortcuts import render

# Create your views here.

def loginView(request):
    return render(request, "familyApp/login.html")

def registerView(request):
    return render(request, "familyApp/register.html")

def calendarView(request):

    return render(request, "familyApp/calendar.html")
