# Generated by Django 3.2.14 on 2022-07-09 07:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Questionaire',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('optionType', models.CharField(max_length=100)),
                ('theId', models.CharField(max_length=100)),
                ('theType', models.CharField(max_length=100)),
                ('multiselect', models.CharField(max_length=100)),
                ('parentId', models.CharField(max_length=100)),
                ('options', models.CharField(max_length=100)),
                ('nextRef', models.CharField(max_length=100)),
                ('groupText', models.CharField(max_length=100)),
                ('isEnd', models.CharField(max_length=100)),
                ('endNote', models.CharField(max_length=100)),
                ('questionaire', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='questionaire.questionaire')),
            ],
            options={
                'ordering': ['title'],
            },
        ),
    ]
