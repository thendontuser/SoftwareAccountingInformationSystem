# Generated by Django 5.1.7 on 2025-03-14 10:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Developer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64)),
                ('type_of_company', models.CharField(max_length=64)),
                ('location', models.CharField(max_length=64)),
            ],
        ),
        migrations.CreateModel(
            name='Device',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64)),
                ('os_name', models.CharField(max_length=64)),
                ('ip_address', models.CharField(max_length=16)),
                ('ram_value', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('surname', models.CharField(max_length=64)),
                ('name', models.CharField(max_length=64)),
                ('middlename', models.CharField(max_length=64)),
                ('role_name', models.CharField(max_length=5)),
                ('login', models.CharField(max_length=64)),
                ('password_hash', models.CharField(max_length=256)),
            ],
        ),
        migrations.CreateModel(
            name='Software',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64)),
                ('version', models.CharField(max_length=64)),
                ('license', models.CharField(max_length=64)),
                ('license_begin', models.DateField()),
                ('license_end', models.DateField()),
                ('logo_path', models.CharField(max_length=512)),
                ('id_developer', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='software_accounting.developer')),
                ('id_device', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='software_accounting.device')),
            ],
        ),
        migrations.CreateModel(
            name='Request',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('id_software', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='software_accounting.software')),
                ('id_user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='software_accounting.user')),
            ],
        ),
    ]
