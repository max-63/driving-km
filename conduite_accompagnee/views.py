# conduite/views.py
from django.shortcuts import render, redirect
from .models import SessionConduite
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login as login_user
from django.contrib.auth.models import User
from datetime import timedelta
import json
from django.http import JsonResponse
from django.db.models.functions import TruncDate
from django.utils.timezone import localtime
from collections import defaultdict 
import locale

def dashboard(request):
    if request.method == "POST":
        distance = float(request.POST.get("distance", 0))
        duration_seconds = int(request.POST.get("duration", 0))
        SessionConduite.objects.create(
            distance_km=distance,
            duree=timedelta(seconds=duration_seconds),
            user=request.user
        )
        return redirect('dashboard')

    sessions = SessionConduite.objects.filter(user=request.user).order_by('-date')

    total_seconds = sum(session.duree.total_seconds() for session in sessions)
    total_duration = timedelta(seconds=total_seconds)


    daily_distances = defaultdict(float)
    for session in sessions:
        date = localtime(session.date).date()
        daily_distances[date] += session.distance_km

    sorted_data = sorted(daily_distances.items())
    # ⚠️ Forcer le français (Linux/macOS). Sur Windows, ça dépend de la config
    try:
        locale.setlocale(locale.LC_TIME, "fr_FR.UTF-8")
    except:
        locale.setlocale(locale.LC_TIME, "fr_FR")

    chart_labels = [date.strftime("%A %d").capitalize() for date, _ in sorted_data]
    chart_data = [round(distance, 2) for _, distance in sorted_data]
    context = {
        'sessions': sessions,
        'total_distance': sum(session.distance_km for session in sessions),
        'total_duration': total_duration,
        'chart_labels': chart_labels,
        'chart_data': chart_data,
    }

    return render(request, "index.html", context)

def login(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login_user(request, user)
            return redirect("dashboard")
    return render(request, "accounts.html")

def register(request):
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        password1 = request.POST.get("password1")
        password2 = request.POST.get("password2")
        if password1 == password2:
            user = User.objects.create_user(username=username, email=email, password=password1)
            user.save()
            return render(request, "accounts.html")
    return render(request, "accounts.html")

def accounts(request):
    return render(request, "accounts.html")


def get_all_data_user(request):
    if request.method == "GET":
        user = request.user
        sessions = SessionConduite.objects.filter(user=user).order_by('-date')
        total_distance = sum(session.distance_km for session in sessions)
        total_duration = sum(session.duree.total_seconds() for session in sessions)
        return JsonResponse({"total_distance": total_distance, "total_duration": total_duration, "user": user.username})
    return JsonResponse({"error": "Invalid request method"})