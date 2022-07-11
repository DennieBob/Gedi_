from django.db.models import IntegerField, Model
from django_mysql.models import ListTextField

# Create your models here.
 


class Question (Model):
    question = ListTextField(
        base_field=IntegerField(),
        size=100,  # Maximum of 100 ids in list
    )
     

    # def __str__(self):
    #     return self.reporter