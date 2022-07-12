import pymongo
from django.http import request
from django.shortcuts import redirect, render
from django.utils.datastructures import MultiValueDictKeyError
from django.views import View   
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User,auth
from allauth.account.views import PasswordChangeView,PasswordSetView
from django.http import HttpResponse
import json
from bson.json_util import dumps
from django.core.paginator import Paginator
# from ajax_datatable.views import AjaxDatatableView
from django.contrib.auth.models import Permission
# from django.utils.datastructures import MultiValueDictKeyError
#
# try:
#     is_private = request.HttpRequest().POST['is_private']
# except MultiValueDictKeyError:
#     is_private = False
# print (Permission)


from utils import get_db_handle, get_collection_handle
# db_handle, mongo_client = get_db_handle()
# collection_handle = get_collection_handle(db_handle, "auth_user")
# k = collection_handle.find()
# print(k)

app_name = "symox"

class DashboardView(LoginRequiredMixin,View):
    def get(self, request):       
        return render(request, 'dashboard.html')
        
def logout(request):
    auth.logout(request)
    return render(request,'account/logout.html')
        
class MyPasswordChangeView(LoginRequiredMixin, PasswordChangeView):
    success_url = reverse_lazy('dashboard')        

class MyPasswordSetView(LoginRequiredMixin, PasswordSetView):
    success_url = reverse_lazy('dashboard')

def userlist(request):
    db_handle, mongo_client = get_db_handle()
    collection_handle = get_collection_handle(db_handle, "auth_user")
    k = collection_handle.find()
    print(k)
    context = {"data": dumps(k)}
    # return HttpResponse(context)
    return render(request, "auth/demotable2.html", context)

def userlistPaginated(request, rows_per_page=5, page_num=1, search_query="", sort_query="email"):
    db_handle, mongo_client = get_db_handle()
    collection_handle = get_collection_handle(db_handle, "auth_user")
    if search_query == "_":
        search_query = ""

    dummy = "^" + search_query

    k = collection_handle.find({"$or":[{"email": {"$regex": dummy,"$options" : "i"}},
                                       {"username": {"$regex": dummy,"$options" : "i"}},
                                       {"first_name": {"$regex": dummy,"$options" : "i"}},
                                       {"last_name": {"$regex": dummy,"$options" : "i"}}]}).sort(sort_query)
    p = Paginator(list(k),rows_per_page)
    context = {
        "rows_per_page": rows_per_page,
        "page_num": page_num,
        "search_query": search_query,
        "data": p.page(page_num),
        "count": p.count,
        "items_per_page": [5,10,20,50,100],
        "page_range": range(p.page(page_num).start_index(),p.page(page_num).end_index()),
        "num_of_pages": range(p.num_pages),
        "has_next": str(p.page(page_num).has_next()),
        "has_previous": str(p.page(page_num).has_previous()),
        "start_index": p.page(page_num).start_index(),
        "end_index": p.page(page_num).end_index(),
    }
    # return HttpResponse(p.page(page_num))
    # print(k)
    # context = {"data": dumps(k)}
    return render(request, "auth/user-list.html", context)

def userpermissions(request):
    db_handle, mongo_client = get_db_handle()
    collection_handle = get_collection_handle(db_handle, "auth_permission")
    k = collection_handle.find()
    print(k)
    context = {"data": dumps(k)}
    return render(request, "auth/ecommerce/permissions.html", context)

def usergroupd(request):
    db_handle, mongo_client = get_db_handle()
    collection_handle = get_collection_handle(db_handle, "auth_group")
    k = collection_handle.find()
    print(k)
    context = {"data": dumps(k)}
    return render(request, "auth/ecommerce/groups.html", context)

def demotable(request):
    return render(request,"auth/demotable.html")

# class PermissionAjaxDatatableView(AjaxDatatableView):
#     db_handle, mongo_client = get_db_handle()
#     collection_handle = get_collection_handle(db_handle, "auth_permission")
#     k = collection_handle.find()
#     model = list(k)
#     title = 'Permissions'
#     initial_order = [["app_label", "asc"], ]
#     length_menu = [[10, 20, 50, 100, -1], [10, 20, 50, 100, 'all']]
#     search_values_separator = '+'

#     column_defs = [
#         AjaxDatatableView.render_row_tools_column_def(),
#         {'name': 'id', 'visible': False, },
#         # {'name': 'codename', 'visible': True, },
#         {'name': 'name', 'visible': True, },
#         # {'name': 'app_label', 'foreign_field': 'content_type__app_label', 'visible': True, },
#         # {'name': 'model', 'foreign_field': 'content_type__model', 'visible': True, },
#     ]

def dummy(request):
    db_handle, mongo_client = get_db_handle()
    collection_handle = get_collection_handle(db_handle, "auth_user")
    k = collection_handle.find()
    # k = collection_handle.find({}, {"_id": 0, "id": 0, "password": 0, "last_login": 0, "is_superuser": 0,
    #                                 "is_staff": 0, "is_active": 0, "date_joined": 0, "username": 0,
    #                                 })
    p = list(k)
    m = {
        "draw": 1,
        "recordsTotal": len(p),
        "recordsFiltered": len(p),
        "data": p
    }
    h = dumps(m)
    context = {
        "data": h
    }
    return render(request, "auth/demotable2.html", context)

def dummy2(request):
    db_handle, mongo_client = get_db_handle()
    collection_handle = get_collection_handle(db_handle, "auth_user")
    # k = collection_handle.find()
    k = collection_handle.find({},{"_id":0, "id":0, "password":0, "last_login": 0, "is_superuser": 0,
                                   "is_staff": 0, "is_active": 0, "date_joined": 0, "username": 0,
                                   })
    p = list(k)
    m = {
        "draw": 1,
        "recordsTotal": len(p),
        "recordsFiltered": len(p),
        "data": p
    }
    h = dumps(m)
    return HttpResponse(h)


def userdetails(request):
    db_handle, mongo_client = get_db_handle()
    collection_handle = get_collection_handle(db_handle, "auth_user")
    k = collection_handle.find()
    print(k)
    context = {"data": list(k)}
    # return HttpResponse(context)
    return render(request, "auth/demotable3.html", context)

