from rest_framework import serializers
from software_accounting.models import *

class SoftwareSerializer(serializers.ModelSerializer):
    model = Software
    fields = ['id', 'name', 'version', 'license', 'license_begin', 'license_end', 'id_device', 'id_developer', 'logo_path']


class DeveloperSerializer(serializers.ModelSerializer):
    model = Developer
    fields = ['id', 'name', 'type_of_company', 'location']


class DeviceSerializer(serializers.ModelSerializer):
    model = Device
    fields = ['id', 'name', 'os_name', 'ip_address', 'ram_value']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['surname', 'name', 'middlename', 'email', 'role_name', 'login', 'password_hash']
    
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
                    'login' : user.login
                }
        except User.DoesNotExist:
            return False
        return False


class RequestSerializer(serializers.ModelSerializer):
    model = Request
    fields = ['id', 'id_software', 'id_user']