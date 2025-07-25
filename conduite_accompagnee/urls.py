# conduite/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("dashboard/", views.dashboard, name="dashboard"),
    path("login/", views.login, name="login"),
    path("register/", views.register, name="register"),
    path("", views.accounts, name="accounts"),
    path('api/badges/', views.badges, name='badges_progress'),
    path('api/session_toutes', views.sessions_toutes, name='sessions_toutes'),
    path('api/meteo', views.meteo, name='meteo'),
]
