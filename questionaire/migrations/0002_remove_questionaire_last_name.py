# Generated by Django 3.2.14 on 2022-07-11 05:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('questionaire', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='questionaire',
            name='last_name',
        ),
    ]