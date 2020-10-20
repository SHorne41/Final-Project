from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = CustomUser
        fields = ('email', 'first_name', 'last_name', 'group', 'role', 'calendarEmail')
        help_texts = {
            'calendarEmail': 'API link to your Google calendar'
        }
        labels = {
            'email':            '*Email Address  ',
            'first_name':       '*First Name     ',
            'last_name':        '*Last Name      ',
            'role':             'Role            ',
            'group':            'Group           ',
            'calendarEmail':    'Google Calendar '

        }

class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'first_name', 'last_name', 'role', 'group', 'calendarEmail')
