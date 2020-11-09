from django.shortcuts import render, HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from .forms import CustomUserCreationForm
from django.views.decorators.csrf import csrf_exempt
from .models import Message, CustomUser
from datetime import datetime
from django.http import JsonResponse


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

def registerUser(request):
    if request.method == 'POST':
        newCustomUserForm = CustomUserCreationForm(request.POST)
        if newCustomUserForm.is_valid():
            newUser = newCustomUserForm.save()
        else:
            print("User not created")
            print(newCustomUserForm.errors)

    return HttpResponseRedirect(reverse("index"))


def calendarView(request):
    return render(request, "familyApp/calendar.html")

@csrf_exempt
def sendMessage(request):
    if request.method == "POST":
        data = request.POST
        sendingUser = CustomUser.objects.get(pk = request.user.id)
        newMessage = Message(sender = sendingUser, content = data['content'], timestamp = datetime.now())
        newMessage.save()
        return JsonResponse({"error": "Email not found."}, status=201)
    return JsonResponse({"error": "Email not found."}, status=404)
