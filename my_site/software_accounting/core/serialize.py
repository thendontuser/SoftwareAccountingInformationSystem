from rest_framework import serializers
from software_accounting.models import *
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from django.http import FileResponse
from django.conf import settings
import io
import os

class SoftwareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Software
        fields = ['id', 'name', 'version', 'license', 'license_begin', 'license_end', 'id_device', 'id_developer', 'logo_path']
    
    def __add_software(self, softwares: list, software: Software) -> list:
        softwares.append(
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
                'logo_path': software.logo_path
            }
        )
        return softwares
    
    def get_multiple(self) -> list[dict]:
        softwares = []
        softwares = self.__add_software(softwares, Software.objects.get(id=1))
        is_match = False

        for s in Software.objects.all():
            for temp in softwares:
                if s.name == temp['name']:
                    is_match = True
                    break
            if is_match:
                is_match = False
                continue
            softwares = self.__add_software(softwares, s)
        return softwares
    
    def get_softwares_by_department(self, department: str) -> list[Software]:
        softwares = []
        for request in Request.objects.all():
            if request.id_software != None:
                if request.id_user.department_number.name == department:
                    softwares.append(Software.objects.get(id=request.id_software.id))
        return softwares


class DeveloperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Developer
        fields = ['id', 'name', 'type_of_company', 'location']


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ['id', 'name', 'os_name', 'ip_address', 'ram_value']


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['number', 'name']

    def get_name(self, data) -> str:
        try:
            department = Department.objects.get(number=data['number'])
            return department.name
        except Department.DoesNotExist:
            return 'None'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['surname', 'name', 'middlename', 'email', 'role_name', 'department_number', 'login', 'password_hash']
    
    def create(self, validated_data) -> User:
        user = User(**validated_data)
        user.set_password(validated_data['password_hash'])
        user.save()
        return user
    
    def is_login_busy(self, validated_data) -> bool:
        try:
            user = User.objects.get(login=validated_data['login'])
            return True
        except User.DoesNotExist:
            return False
        
    def user_is_exists(self, validated_data) -> bool | dict:
        try:
            user = User.objects.get(login=validated_data['login'])
            if (user.check_password(validated_data['password_hash'])):
                return {
                    'id' : user.id,
                    'surname' : user.surname, 
                    'name' : user.name, 
                    'middlename' : user.middlename,
                    'email' : user.email,
                    'role_name' : user.role_name,
                    'department_number' : user.department_number.id,
                    'login' : user.login
                }
        except User.DoesNotExist:
            return False
        return False


class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = ['id', 'id_software', 'id_user', 'status']

    def get_user_requests(self, id_user) -> str:
        result = ''
        num = 1
        for request in Request.objects.all():
            if request.id_user.id == id_user:
                if request.id_software == None:
                    result += f'№{num}\nПрограммное обеспечение: ---\nУстройство: ---\nСтатус: {request.status}\n\n'
                    num += 1
                else:
                    software = Software.objects.get(id=request.id_software.id)
                    result += f'№{num}\nПрограммное обеспечение: {software.name}\nУстройство: {Device.objects.get(id=software.id_device.id).name}\nСтатус: {request.status}\n\n'
                    num += 1
        if (len(result) > 0):
            return result
        return 'У вас пока нет заявок'

    def request_message(self, software : dict, device : dict) -> dict:
        if (device['ram_value'] < 4):
            return {'state' : False, 'message' : 'На устройство ' + device['name'] + ' нельзя установить ' + software['name'] + ', так как не хватает оперативной памяти\nРекомендуемое значение: 8 Гб\nИмеющееся: ' + str(device['ram_value'])}
        return {'state' : True, 'message' : 'Ваша заявка прошла проверку и программное обеспечение ' + software['name'] + ' можно установить на устройство ' + device['name']}
    

def get_report(softwares : list[Software], department : str) -> FileResponse:
    # Формирование записей в нужном формате
    content = []
    for software in softwares:
        content.append({'software' : software.name, 'version' : software.version, 'developer' : software.id_developer.name, 'device' : software.id_device.name})

    # Добавление записей в PDF файл
    pdfmetrics.registerFont(TTFont("TimesNewRoman", os.path.join(settings.BASE_DIR, 'software_accounting', 'fonts', 'tnr.ttf')))

    buffer = io.BytesIO()

    pdf = canvas.Canvas(buffer)
    pdf.setFont('TimesNewRoman', 14)
    pdf.drawString(170, 750, f'Перечень Программного обеспечения отдела {department}')

    y, stepY = 700, 20
    for c in content:
        pdf.drawString(50, y, f'Программное обеспечение: {c['software']}')
        y -= stepY
        pdf.drawString(50, y, f'Версия: {c['version']}')
        y -= stepY
        pdf.drawString(50, y, f'Разработчик: {c['developer']}')
        y -= stepY
        pdf.drawString(50, y, f'Установлено на устройстве: {c['device']}')
        y -= (stepY * 2)

    pdf.save()
    
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename=f'Перечень_ПО_{department}.pdf', content_type='application/pdf')