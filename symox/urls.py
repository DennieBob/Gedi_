from django.contrib import admin
from django.urls import path,include
#from django.conf.urls import url
from symox import views
#from django.contrib.auth import views as auth_views
from django.contrib.auth import views as auth_views
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
#from . import MyPasswordChangeView
from .views import MyPasswordChangeView, MyPasswordSetView, userlist, userpermissions, userlistPaginated, \
    dummy, dummy2, userdetails#, PermissionAjaxDatatableView, 

urlpatterns = [
    path('admin/', admin.site.urls),
    #Dashboard
    path('',views.DashboardView.as_view(),name='dashboard'),
    #Apps
    path('apps/',include('apps.urls')),
    #Bootstrap
    path('bootstrap/',include('bootstrap.urls')),
    #Components
    path('components/',include('components.urls')),
    #Pages
    path('pages/',include('pages.urls')),
    #Accounts    
    path("account/", include("allauth.urls")),

    path('userslist', userlist),
    path('userslistpaginated/<int:rows_per_page>/<int:page_num>/<str:search_query>/<str:sort_query>/', userlistPaginated, name="my-paginated_list"),
    path('userslistpaginated/<int:rows_per_page>/<int:page_num>/<str:search_query>/', userlistPaginated, name="my-paginated_list"),
    path('userslistpaginated/<int:rows_per_page>/<int:page_num>/', userlistPaginated, name="my-paginated_list"),
    path('userslistpaginated/<int:rows_per_page>/', userlistPaginated, name="my-paginated_list"),
    path('userspermissions', userpermissions),

    path('logout',views.logout,name ='logout'),

    path('accounts/password/change/', login_required(MyPasswordChangeView.as_view()), name="account_change_password"),
    path('accounts/password/set/', login_required(MyPasswordSetView.as_view()), name="account_set_password"),

    # path('ajax_datatable/permissions/', PermissionAjaxDatatableView.as_view(), name="ajax_datatable_permissions"),
    path('dummy', dummy, name="dummy_view"),
    path('dummy2', dummy2, name="dummy_view2"),
    path('dummy3', userdetails, name="dummy3"),

    # path("gedi/", include("gedi.urls")) ,
    path("questionaire/", include("questionaire.urls"))  
]