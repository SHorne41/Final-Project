from django.shortcuts import render,  HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from .forms import CustomUserCreationForm

# Create your views here.

def loginView(request):
    if request.method == "POST":
        # Attempt to sign user in
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=email, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("calendar"))
        else:
            return render(request, "familyApp/login.html", {
                "message": "Invalid email and/or password."
            })
    else:
        newCustomUserForm = CustomUserCreationForm()
        context = {'form': newCustomUserForm}
        return render(request, "familyApp/login.html", context)

def registerView(request):
    return render(request, "familyApp/register.html")

def calendarView(request):
    return render(request, "familyApp/calendar.html")
