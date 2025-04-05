from django.shortcuts import render
from rest_framework.views import APIView
from software_accounting.models import *
from rest_framework.response import Response
from software_accounting.core.serialize import *
from django.forms.forms import ValidationError


class SoftwareAPIView(APIView):
    def get(self, request) -> Response:
        datail = [
            {
                'name': software.name,
                'version': software.version,
                'license': software.license,
                'license_begin': software.license_begin,
                'license_end': software.license_end,
                'developer': {
                    'id': software.id_developer.id,
                    'name': software.id_developer.name,
                },
                'logo_path': software.logo_path
            }
            for software in Software.objects.all()
            ]
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
        datail = [ {'number' : datail.id, 'name' : datail.name, 'os_name' : datail.os_name, 'id_address' : datail.ip_address, 'ram_value' : datail.ram_value} for datail in Device.objects.all() ]
        return Response(datail)
    
    def post(self, request) -> Response | None:
        serializer = DeviceSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return  Response(serializer.data)
        

class DepartmentAPIView(APIView):
    def get(self, request) -> Response:
        datail = [ {'number' : datail.number, 'name' : datail.name} for datail in Department.objects.all() ]
        return Response(datail)
    
    def post(self, request) -> Response | None:
        serializer = DepartmentSerializer(data=request.data)
        #if serializer.is_valid(raise_exception=True):
        #serializer.save()
        return Response(serializer.get_name(request.data))
        

class UserRegistrationAPIView(APIView):
    def get(self, request) -> Response:
        datail = [ {'surname' : datail.surname, 'name' : datail.name, 'middlename' : datail.middlename, 'role_name' : datail.role_name, 
                    'email' : datail.email, 'department_number' : datail.department_number.id,  'login' : datail.login,
                      'password_hash' : datail.password_hash} for datail in User.objects.all() ]
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