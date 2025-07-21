# conduite/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("dashboard/", views.dashboard, name="dashboard"),
    path("login/", views.login, name="login"),
    path("register/", views.register, name="register"),
    path("", views.accounts, name="accounts"),
]
