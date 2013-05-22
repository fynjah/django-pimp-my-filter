from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseNotFound, HttpResponseForbidden
from django.shortcuts import render_to_response, RequestContext
from django.core.context_processors import csrf
from django.contrib.auth.decorators import login_required
from django.db.models import Q
import datetime
from filter_manager.models import Filter, Condition, LOGICAL_OPERATORS
from django.contrib.contenttypes.models import ContentType
import simplejson as json

@login_required
def save_filter(request):
	if request.method == "POST" and request.is_ajax():
		if 'filter' in request.POST:
			new_filter = json.loads(request.POST['filter'])
			ct = ContentType.objects.get_by_natural_key(new_filter['app'],new_filter['model'])
			if new_filter['quick'] == 'true':
				quick = True
			else:
				quick = False
			f = Filter(name=new_filter['name'], 
						user_id=request.user.id, 
						quick=quick, 
						content_type = ct,)
			f.save()
			for k,c in new_filter['conditions'].iteritems():
				con = Condition(filter=f, 
								operator = c['operator'],
								value=c['value'],
								field=c['field'],)
				con.save()
			r = {'filter_id':f.id}
			return HttpResponse(json.dumps(r, indent = 4 * ' '), 
				mimetype='application/json; charset=utf8')
		else:
			return HttpResponseForbidden('[{"error":"Forbidden. Wrong headers."}]', 
				mimetype='application/json; charset=utf8')

@login_required
def get_structure(request):
	if request.method == "POST" and request.is_ajax():
		if 'app' in request.POST and 'model' in request.POST:
			fields = {}
			ct = ContentType.objects.get_by_natural_key(request.POST['app'],request.POST['model'])
			instance = ContentType.model_class(ct)
			for i,x in enumerate(instance._meta.get_all_field_names()):
				z = instance._meta.get_field_by_name(x)
				if(z[0].name == 'id'):
					continue
				f = {}
				try:
					f.update({"type":z[0].get_internal_type()})
				except AttributeError:
					continue
				else:
					f.update({"name":z[0].name})
				fields.update( {i: f} )
			r = {}
			r.update({'fields':fields})
			r.update({'operators':LOGICAL_OPERATORS})
			return HttpResponse(json.dumps(r, indent = 4 * ' '), 
				mimetype='application/json; charset=utf8')
	return HttpResponseForbidden('[{"error":"Forbidden"}]', 
		mimetype='application/json; charset=utf8')

@login_required
def get_typeahead(request):
	if request.is_ajax() and request.method == "POST":
		if 'field' in request.POST and 'app' in request.POST and 'model' in request.POST:
			ct = ContentType.objects.get_by_natural_key(request.POST['app'],request.POST['model'])
			instance = ContentType.model_class(ct)
			f = dict([(x,x) for x in instance._meta.get_all_field_names() ])
			try:
				o = f[request.POST['field']]
				o = instance._meta.get_field_by_name(o)[0]
			except KeyError:
				return HttpResponseForbidden('[{"error":"Forbidden"}]', 
					mimetype='application/json; charset=utf8')
			o = o.related.parent_model
			obj_list = o.objects.all()
			lst = {}
			for i,obj in enumerate(obj_list):
				l = {}
				l.update({"id":obj.id})
				l.update({"unicode":obj.__unicode__()}) #not sure about __unicode__, actually
				lst.update({i:l})
			return HttpResponse(json.dumps(lst, indent = 4 * ' '), 
				mimetype='application/json; charset=utf8')
	else:
		return HttpResponseForbidden('[{"error":"Forbidden. Wrong headers."}]', 
			mimetype='application/json; charset=utf8')

def use_filter(request):
	if request.is_ajax():
		if 'filter_id' in request.GET:
			f = Filter.objects.get(pk = request.GET['filter_id'])
	return HttpResponseForbidden('[{"error":"Forbidden. Wrong headers."}]', 
		mimetype='application/json; charset=utf8')
