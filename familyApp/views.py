import json
from django.shortcuts import render, HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from .forms import CustomUserCreationForm
from django.views.decorators.csrf import csrf_exempt
from .models import Message, CustomUser
from datetime import datetime
from django.http import JsonResponse
from django.core import serializers


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
        timestamp = datetime.now()
        newMessage = Message(sender = sendingUser, content = data['content'], timestamp = timestamp)
        newMessage.save()
        justSent = Message.objects.get(timestamp = timestamp)
        return JsonResponse([justSent.serialize()], safe=False)
    return JsonResponse({"error": "Email not found."}, status=404)

@csrf_exempt
def retrieveMessages(request):
    if request.method == "POST":
        data = json.loads(request.body)

        #Determine index of most recent message not being displayed to the user; retrieve that message's ID
        newestMessageID = Message.objects.filter().last().pk
        mostRecentIndex = newestMessageID - data.get("messageCount")
        mostRecentID = Message.objects.get(pk=mostRecentIndex).pk

        #Determine the index of the least recent message to display to the user based on the total number of messages
        numMessages = Message.objects.count()
        oldestMessageID = Message.objects.filter().first().pk
        if numMessages < 5:
            leastRecentID = oldestMessageID
        elif mostRecentIndex < (oldestMessageID + 4):
            leastRecentID = oldestMessageID
        elif mostRecentIndex > (oldestMessageID + 4):
            leastRecentID = mostRecentID - 5

        #Retrieve messages found in range leastRecentID -> mostRecentID
        recentMessages = Message.objects.filter(id__range=(leastRecentID, mostRecentID))

        return JsonResponse([message.serialize() for message in recentMessages], safe=False)
