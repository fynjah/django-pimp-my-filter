from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseForbidden, HttpResponseRedirect
from django.shortcuts import render_to_response, RequestContext
from example.forms import Login
from django.core.context_processors import csrf
from django.contrib.auth.decorators import login_required

@login_required
def example(request):
	return render_to_response('index.html', {}, context_instance=RequestContext(request))

def logout(request):
    auth.logout(request)
    return HttpResponseRedirect("/login/")

def login(request,other_stuff=None):
	if request.user.is_authenticated():
  			return HttpResponseRedirect(request.GET.get('next',"/login/"))
	else:
	    if request.method == 'POST':
	        username = request.POST['username']
	        password = request.POST['password']
	        user = auth.authenticate(username=username, password=password)
	        if user is not None and user.is_active:
	            auth.login(request, user)        

	            return HttpResponseRedirect(request.GET.get('next',"/"))
	        else:        
	            return HttpResponseRedirect("/login/invalid/?next=%s" % request.GET.get('next',"/") )
	    else:
	        form = Login()
	        mdict = {'form': form}
	        mdict.update(csrf(request))
	        if other_stuff: 
	        	mdict.update(other_stuff)
	        return render_to_response('login.html', mdict)  

def login_invalid(request):
	form = Login()
	mdict = {'form': form}
	return render_to_response('login.html', mdict, context_instance=RequestContext(request)) 	

