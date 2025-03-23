from django.shortcuts import render
from rest_framework.views import APIView
from software_accounting.models import *
from rest_framework.response import Response
from software_accounting.core.serialize import *
from django.forms.forms import ValidationError


class SoftwareAPIView(APIView):
    def get(self, request) -> Response:
        datail = [ {'name' : datail.name, 'version' : datail.version, 'license' : datail.license,
                    'license_begin' : datail.license_begin, 'license_end' : datail.license_end,
                    'id_device' : datail.id_device, 'id_developer' : datail.id_developer, 'logo_path' : datail.logo_path } 
                    for datail in Software.objects.all() ]
        return Response(datail)
    
    def post(self, request) -> Request | None:
        serializer = SoftwareSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return  Response(serializer.data)
        

class DeveloperAPIView(APIView):
    def get(self, request) -> Response:
        datail = [ {'name' : datail.name, 'type_of_company' : datail.type_of_company, 'location' : datail.location} for datail in Developer.objects.all() ]
        return Response(datail)
    
    def post(self, request) -> Response | None:
        serializer = DeveloperSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return  Response(serializer.data)
        

class DeviceAPIView(APIView):
    def get(self, request) -> Response:
        datail = [ {'name' : datail.name, 'os_name' : datail.os_name, 'id_address' : datail.ip_address, 'ram_value' : datail.ram_value} for datail in Device.objects.all() ]
        return Response(datail)
    
    def post(self, request) -> Response | None:
        serializer = DeviceSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return  Response(serializer.data)
        

class UserRegistrationAPIView(APIView):
    def get(self, request) -> Response:
        datail = [ {'surname' : datail.surname, 'name' : datail.name, 'middlename' : datail.middlename, 'role_name' : datail.role_name, 
                    'email' : datail.email, 'login' : datail.login, 'password_hash' : datail.password_hash} 
                    for datail in User.objects.all() ]
        return Response(datail)
    
    def post(self, request) -> Response | None:
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            if serializer.is_login_busy(request.data) == False:
                serializer.save()
            else:
                return Response('userIsExists')
            return Response(serializer.data)
        

class UserLoginAPIView(APIView):
    def get(self, request) -> Response:
        userReg = UserRegistrationAPIView()
        return userReg.get(request=request)
    
    def post(self, request) -> Response:
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            return Response(serializer.user_is_exists(request.data))
            
        
class RequestAPIView(APIView):
    def get(self, request) -> Response:
        datail = [ {'id_software' : datail.id_software, 'id_user' : datail.id_user} for datail in Request.objects.all() ]
        return Response(datail)
    
    def post(self, request) -> Response | None | ValidationError:
        serializer = RequestSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return  Response(serializer.data)