from django.urls import path

from .views import questionaire,update_questionaire,questionaire_home,get_questionaire_by_id

urlpatterns = [
   path("", questionaire_home, name="questionaire"), 
   path("add-new/", questionaire, name="add-new"),   
   path("get/", get_questionaire_by_id, name="get"),  
   path("update/", update_questionaire, name="update"), 
  #  path("update/<int:id>", update_questionaire, name="update"), 
 ]
