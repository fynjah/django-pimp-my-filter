from django.conf.urls.defaults import *
from filter_manager import views

urlpatterns = patterns('',
   url(r'^get_structure/$', views.get_structure,),
   url(r'^save_filter/$', views.save_filter,),
   url(r'^get_typeahead/$', views.get_typeahead,),
)