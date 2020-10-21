# Generated by Django 3.0.8 on 2020-10-18 23:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('familyApp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='calendarEmail',
            field=models.EmailField(blank=True, max_length=254),
        ),
        migrations.AddField(
            model_name='customuser',
            name='group',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='customuser',
            name='profile_pic',
            field=models.ImageField(blank=True, upload_to=''),
        ),
        migrations.AddField(
            model_name='customuser',
            name='role',
            field=models.CharField(blank=True, max_length=15),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='first_name',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='last_name',
            field=models.CharField(max_length=30),
        ),
    ]
