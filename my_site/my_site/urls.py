"""
URL configuration for my_site project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from software_accounting.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', UserLoginAPIView.as_view(), name="login"),
    path('reg/', UserRegistrationAPIView.as_view(), name="register"),
    path('software/', SoftwareAPIView.as_view(), name="softwares"),
    path('departments/', DepartmentAPIView.as_view(), name='departments'),
    path('developers/', DeveloperAPIView.as_view(), name='developers'),
    path('devices/', DeviceAPIView.as_view(), name='devices'),
    path('request/', RequestAPIView.as_view(), name='request'),
    path('users/', UserRegistrationAPIView.as_view(), name='users'),

    path('check_request/', CheckRequestAPIView.as_view(), name='check_request'),
    path('report/', ReportAPIView.as_view(), name='report'),

    path('softwares/<int:pk>/delete/', SoftwareDestroyAPIView.as_view(), name='software-delete'),
    path('developers/<int:pk>/delete/', DeveloperDestroyAPIView.as_view(), name='developer-delete'),
    path('devices/<int:pk>/delete/', DeviceDestroyAPIView.as_view(), name='device-delete'),
    path('departments/<int:number>/delete/', DepartmentDestroyAPIView.as_view(), name='department-delete'),
    path('users/<int:pk>/delete/', UserDestroyAPIView.as_view(), name='user-delete'),

    path('softwares/<int:pk>/update/', SoftwareUpdateView.as_view(), name='software-update'),
    path('developers/<int:pk>/update/', DeveloperUpdateView.as_view(), name='developer-update'),
    path('devices/<int:pk>/update/', DeviceUpdateView.as_view(), name='device-update'),
    path('departments/<int:number>/update/', DepartmentUpdateView.as_view(), name='deprtment-update'),
    path('users/<int:pk>/update/', UserUpdateView.as_view(), name='user-update'),
    path('requests/<int:pk>/update/', RequestUpdateView.as_view(), name='request-update')
]
