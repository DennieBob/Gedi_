from django.http import request
import json
from bson.json_util import dumps
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.views import View   
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.views.generic import TemplateView


from .models import Questionaire,Question 
from django.http import JsonResponse
from django.core import serializers
User = get_user_model()

 
def questionaire_home(request):
    questions=serializers.serialize("json", Question.objects.all() ) 
    context={"questions":questions}
    return render(request,"questionaire/home.html",context)

def questionaire(request):
    questions=serializers.serialize("json", Questionaire.objects.filter(pk=1) ) 
    context={"questions":questions}
    return render(request,"questionaire/index.html",context)

def get_questionaire_by_id(request): 
    if Question.objects.filter(questionaire=2).count() ==0:
        questions=json.dumps([0]) 
        return JsonResponse(questions,safe=False) 
    else:
        questions=serializers.serialize("json", Question.objects.filter(questionaire=2) )
        return JsonResponse(questions,safe=False)

def update_questionaire(request):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        received_data = json.loads(body_unicode) 
        Question.objects.all().delete()
        for i in range(len(received_data)):
            obj=Question(
                questionaire_id=2,
                title= received_data[i]['title'],
                optionType= received_data[i]['optionType'],
                theId= received_data[i]['theId'],
                theType= received_data[i]['theType'],
                multiselect= received_data[i]['multiselect'],
                parentId= received_data[i]['parentId'],
                options= received_data[i]['options'],
                nextRef= received_data[i]['nextRef'],
                groupText= received_data[i]['groupText'],
                isEnd=received_data[i]['isEnd'],
                endNote= received_data[i]['endNote'],
            )
            obj.save() 
        response = dumps({
            'status': 'ok',
            "data": received_data,
        })

        return HttpResponse(response)

    