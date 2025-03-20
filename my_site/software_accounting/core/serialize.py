from rest_framework import serializers, generics
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
        fields = ['surname', 'name', 'middlename', 'role_name', 'login', 'password_hash']
    
    def create(self, validated_data) -> User:
        user = User(**validated_data)
        user.set_password(validated_data['password_hash'])
        user.save()
        return user


class RequestSerializer(serializers.ModelSerializer):
    model = Request
    fields = ['id', 'id_software', 'id_user']