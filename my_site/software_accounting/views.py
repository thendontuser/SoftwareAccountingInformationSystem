from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.generics import DestroyAPIView, UpdateAPIView
from software_accounting.models import *
from rest_framework.response import Response
from software_accounting.core.serialize import *
from django.forms.forms import ValidationError
from django.core import mail
from django.conf import settings

from django.http import JsonResponse
import json


class SoftwareAPIView(APIView):
    def get(self, request) -> Response:
        if request.GET.get('is_all') == 'true':
            datail = [
                {
                    'id': software.id,
                    'name': software.name,
                    'version': software.version,
                    'license': software.license,
                    'license_begin': software.license_begin,
                    'license_end': software.license_end,
                    'developer': {
                        'id': software.id_developer.id,
                        'name': software.id_developer.name,
                    },
                    'device': {
                        'id': software.id_device.id,
                        'name': software.id_device.name
                    },
                    'logo_path': software.logo_path
                }
                for software in Software.objects.all()
            ]
            return Response(datail)
        serializer = SoftwareSerializer()
        return Response(serializer.get_multiple())
    
    def post(self, request) -> Response | None:
        serializer = SoftwareSerializer(data=request.data)
        instance = None

        if serializer.is_valid(raise_exception=True):
            instance = serializer.save()
            return Response({'id' : instance.id})
        
class SoftwareUpdateView(UpdateAPIView):
    queryset = Software.objects.all()
    serializer_class = SoftwareSerializer
    lookup_field = 'pk'
        
class SoftwareDestroyAPIView(DestroyAPIView):
    queryset = Software.objects.all()
    serializer_class = SoftwareSerializer
        

class DeveloperAPIView(APIView):
    def get(self, request) -> Response:
        datail = [ {'id' : datail.id, 'name' : datail.name, 'type_of_company' : datail.type_of_company, 'location' : datail.location} for datail in Developer.objects.all() ]
        return Response(datail)
    
    def post(self, request) -> Response | None:
        serializer = DeveloperSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        
class DeveloperUpdateView(UpdateAPIView):
    queryset = Developer.objects.all()
    serializer_class = DeveloperSerializer
    lookup_field = 'pk'
        
class DeveloperDestroyAPIView(DestroyAPIView):
    queryset = Developer.objects.all()
    serializer_class = DeveloperSerializer
        

class DeviceAPIView(APIView):
    def get(self, request) -> Response:
        datail = [ {'number' : datail.id, 'name' : datail.name, 'os_name' : datail.os_name, 'ip_address' : datail.ip_address, 'ram_value' : datail.ram_value, 
                     'department' : {'number' : datail.number_of_department.number, 'name' : datail.number_of_department.name}} 
                     for datail in Device.objects.all() ]
        return Response(datail)
    
    def post(self, request) -> Response | None:
        serializer = DeviceSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        
class DeviceUpdateView(UpdateAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    lookup_field = 'pk'
        
class DeviceDestroyAPIView(DestroyAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
        

class DepartmentAPIView(APIView):
    def get(self, request) -> Response:
        if request.GET.get('is_all') == 'true':
            datail = [ {'number' : datail.number, 'name' : datail.name} for datail in Department.objects.all() ]
        else:
            department = Department.objects.get(number=request.GET.get('number'))
            datail = {'number' : department.number, 'name' : department.name}
        return Response(datail)
    
    def post(self, request) -> Response | None:
        serializer = DepartmentSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data)
    
class DepartmentUpdateView(UpdateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    lookup_field = 'number'
    
class DepartmentDestroyAPIView(DestroyAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    lookup_field = 'number'
        

class UserRegistrationAPIView(APIView):
    def get(self, request) -> Response:
        datail = [ {'id' : datail.id, 'surname' : datail.surname, 'name' : datail.name, 'middlename' : datail.middlename, 'role_name' : datail.role_name, 
                    'email' : datail.email, 'department' : {'number' : datail.department_number.number, 'name' : datail.department_number.name},  
                    'login' : datail.login, 'password_hash' : datail.password_hash} for datail in User.objects.all() ]
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
        
class UserUpdateView(UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    lookup_field = 'pk'
        
class UserDestroyAPIView(DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
            
        
class RequestAPIView(APIView):
    def get(self, request) -> Response:
        if request.GET.get('is_all_users') == 'true':
            datails = []
            for datail in Request.objects.all():
                datails.append({'number' : datail.id, 'software' : datail.id_software.name, 'user' : f'{datail.id_user.surname} {datail.id_user.name} {datail.id_user.middlename}', 'status' : datail.status})
            return Response(datails)
        else:
            serializer = RequestSerializer()
            return Response(data=serializer.get_user_requests(int(request.GET.get('id_user'))))
    
    def post(self, request) -> Response | None | ValidationError:
        serializer = RequestSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data)
    
class RequestUpdateView(UpdateAPIView):
    queryset = Request.objects.all()
    serializer_class = RequestUpdateSerializer
    lookup_field = 'pk'
    

class ReportAPIView(APIView):
    def get(self, request):
        serializer = SoftwareSerializer()

        if request.GET.get('department') == 'all':
            return get_report(Software.objects.all(), 'all')
        else:
            department = request.GET.get('department')
            softwares = serializer.get_softwares_by_department(department)
            return get_report(softwares, department)

    def post(self, request):
        pass
    

class CheckRequestAPIView(APIView):
    def get(self, request) -> Response:
        return Response('GET')
    
    def post(self, req) -> Response:
        if req.method == 'POST':
            serializer = RequestSerializer()
            deviceAPIView = DeviceAPIView()
            device = None
            is_valid = False

            software = req.data['software']
            user = req.data['user']
            devices = deviceAPIView.get(request=None).data

            for d in devices:
                if software['id_device'] == d['number']:
                    device = d
                    break

            result = serializer.request_message(software, device)
            if result['state']:
                is_valid = True
            
            send_result = send_mail(user['email'], 'Ответ на заявку установки ПО', result['message'])
            return Response({'state' : is_valid})
        return Response({'error': 'Invalid request method'}, status=405)


def send_mail(to : str, subject : str, message : str) -> str:
    context = {}

    if to and subject and message:
        try:
            mail.send_mail(subject, message, settings.EMAIL_HOST_USER, [to])
            context['result'] = 'Email sent successfully'
        except Exception as e:
            context['result'] = f'Error sending email: {e}'
    else:
        context['result'] = 'All fields are required'
    
    return context