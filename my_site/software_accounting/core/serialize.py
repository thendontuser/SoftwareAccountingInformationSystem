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