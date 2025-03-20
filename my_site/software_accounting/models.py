from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class Software(models.Model):
    '''
        Определяет модель таблицы Software в базе данных
    '''

    name = models.CharField(max_length=64)
    version = models.CharField(max_length=64)
    license = models.CharField(max_length=64)
    license_begin = models.DateField()
    license_end = models.DateField()
    id_device = models.ForeignKey('Device', on_delete=models.PROTECT)
    id_developer = models.ForeignKey('Developer', on_delete=models.PROTECT)
    logo_path = models.CharField(max_length=512)


class Developer(models.Model):
    '''
        Определяет модель таблицы Developer в базе данных
    '''

    name = models.CharField(max_length=64)
    type_of_company = models.CharField(max_length=64)
    location = models.CharField(max_length=64)


class Device(models.Model):
    '''
        Определяет модель таблицы Device в базе данных
    '''

    name = models.CharField(max_length=64)
    os_name = models.CharField(max_length=64)
    ip_address = models.CharField(max_length=16)
    ram_value = models.IntegerField()


class User(models.Model):
    '''
        Определяет модель таблицы User в базе данных
    '''

    surname = models.CharField(max_length=64)
    name = models.CharField(max_length=64)
    middlename = models.CharField(max_length=64)
    role_name = models.CharField(max_length=5)
    login = models.CharField(max_length=64)
    password_hash = models.CharField(max_length=512)

    def set_password(self, password):
        """
            Хеширует пароль и сохраняет его
        """
        self.password_hash = make_password(password)

    def check_password(self, password):
        """
            Проверяет пароль на соответствие хешу
        """
        return check_password(password)
        

class Request(models.Model):
    '''
        Определяет модель таблицы Request в базе данных
    '''

    id_software = models.ForeignKey('Software', on_delete=models.PROTECT)
    id_user = models.ForeignKey('User', on_delete=models.PROTECT)