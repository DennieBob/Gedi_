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

# class PagesView(LoginRequiredMixin,TemplateView):
#     pass


# questionaire = PagesView.as_view(template_name="questionaire/index.html")

def questionaire_home(request):
    questions=serializers.serialize("json", Question.objects.all() )#.values()
    context={"questions":questions}
    # print('over her this prt is working')
    return render(request,"questionaire/home.html",context)

def questionaire(request):
    questions=serializers.serialize("json", Questionaire.objects.filter(pk=1) )#.values()               this
    context={"questions":questions}
    # print('over her this prt is working')
    return render(request,"questionaire/index.html",context)

def get_questionaire_by_id(request):
    # questions=serializers.serialize("json", Questionaire.objects.filter(pk=1) )#.values()               this
    # questions=serializers.serialize("json", Questionaire.objects.all() )#.values()               this
    # questions=serializers.serialize("json", Question.objects.get(reporter=1) )# get only one
    if Question.objects.filter(questionaire=2).count() ==0:
        questions=json.dumps([0]) 
        # question=json.loads(serializers.serialize("json", Question.objects.filter(questionaire=2) ))# filter      and this
        
        # print(question[len(question)-1]['fields']['options'])
        # print(len(question))
        # print(len(questions)) 
        return JsonResponse(questions,safe=False)
        # return HttpResponse(questions)
    
    else:
        questions=serializers.serialize("json", Question.objects.filter(questionaire=2) )# filter      and this
        # question=json.loads(serializers.serialize("json", Question.objects.filter(questionaire=2) ))# filter      and this

        # print(question[len(question)-1]['fields']['options'])
        # print(len(question))
        # print(len(questions)) 
        return JsonResponse(questions,safe=False)
        # return HttpResponse(questions)

# def new_user(request):
def update_questionaire(request):
    # print('hereklsfklskdfls')
    if request.method == 'POST':
        # fetch data from the ajax post
        body_unicode = request.body.decode('utf-8')
        received_data = json.loads(body_unicode) 
        # print(received_data["questionaire_id"])
        # print(received_data[0]['nextRef'])
        # print(received_data[0]['groupText'])
        # print(received_data[1])
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
        # save to the question but reference the questionaire id
        # # update the user object
        # u = User.objects.create(email=person['email'], username=person['username'],
        #                         password=person['password'], first_name=person['first_name'],
        #                         last_name=person['last_name'], phone=person['phone'],
        #                         group=person['group'], permission=person['permission'])
        # u.save()

        # # pack response:
        response = dumps({
            'status': 'ok',
            # "user": u,
            "data": received_data,
            # "person": int(person['id'])
        })

        return HttpResponse(response)

    