from rest_framework import serializers
from software_accounting.models import *

class SoftwareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Software
        fields = ['id', 'name', 'version', 'license', 'license_begin', 'license_end', 'id_device', 'id_developer', 'logo_path']


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
        fields = ['id', 'id_software', 'id_user']

    def get_user_requests(self, id_user) -> str:
        result = ''
        num = 1
        for request in Request.objects.all():
            if request.id_user.id == id_user:
                software = Software.objects.get(id=request.id_software.id)
                result += f'№{num}\nПрограммное обеспечение: {software.name}\nУстройство: {Device.objects.get(id=software.id_device.id).name}\n\n'
                num += 1
        if (len(result) > 0):
            return result
        return 'У вас пока нет заявок'

    def request_message(self, software : dict, device : dict) -> dict:
        if (device['ram_value'] < 4):
            return {'state' : False, 'message' : 'На устройство ' + device['name'] + ' нельзя установить ' + software['name'] + ', так как не хватает оперативной памяти\nРекомендуемое значение: 8 Гб\nИмеющееся: ' + device['ram_value']}
        return {'state' : True, 'message' : 'Ваша заявка прошла проверку и программное обеспечение ' + software['name'] + ' можно установить на устройство ' + device['name']}