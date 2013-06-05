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
from django.contrib.contenttypes.generic import GenericRelation
try:
	import simplejson as json
except ImportError:
	from django.utils import simplejson as json

@login_required
def save_filter(request):
	if request.method == "POST" and request.is_ajax():
		if 'filter' in request.POST:
			new_filter = json.loads(request.POST['filter'])
			ct = ContentType.objects.get_by_natural_key(new_filter['app'],
				new_filter['model'])

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
			ct = ContentType.objects.get_by_natural_key(request.POST['app'],
				request.POST['model'])
			model = ContentType.model_class(ct)
			for i,x in enumerate(model._meta.get_all_field_names()):
				obj, m, direct, m2m = model._meta.get_field_by_name(x)

				if obj.name == 'id':
					continue
				if not direct:
					continue
				f = {}
				f.update({"type":obj.get_internal_type()})
				f.update({"name":obj.name})
				fields.update( {i: f} )

			r = {}
			r.update({'fields':fields})
			r.update({'operators':LOGICAL_OPERATORS})
			return HttpResponse(json.dumps(r, indent = 4 * ' '), 
				mimetype='application/json; charset=utf8')
	return HttpResponseForbidden('[{"error":"Forbidden"}]', 
		mimetype='application/json; charset=utf8')

@login_required
def use_filter(request):
	if not request.is_ajax():
		if 'filter_id' in request.GET:
			flt = Filter.objects.only('content_type').get(pk = request.GET['filter_id'])
			model = ContentType.model_class(flt.content_type)
			kwargs = {}
			for c in flt.conditions.all():
				field = None
				lookup = c.operator
				field = "%s%s" % (c.field, lookup)
				kwargs.update({field:c.value})
			qs = model.objects.filter(**kwargs)
			response = {}
			for i,q in enumerate(qs):
				field_list = {}
				for f in q._meta.get_all_field_names():
					obj, model, direct, m2m = q._meta.get_field_by_name(f)
					if isinstance(obj, GenericRelation):
						continue
					if not direct:
						continue
					if m2m:
						l = {}
						val = obj.value_from_object(q)
						for m in obj.value_from_object(q):
							l.update({m.pk:m.__unicode__()})
						field_list.update({f:l})
					else:
						field_list.update({f:obj.value_to_string(q)})

				response.update({i:field_list})
			r = json.dumps(response, indent = 4 * ' ')
			return HttpResponse(r, 
				mimetype='application/json; charset=utf8')
	return HttpResponseForbidden('[{"error":"Forbidden. Wrong headers."}]', 
		mimetype='application/json; charset=utf8')

@login_required
def get_typeahead(request):
	if request.is_ajax() and request.method == "POST":
		if ('field' in request.POST and 
			'app' in request.POST and 
			'model' in request.POST):
			ct = ContentType.objects.get_by_natural_key(request.POST['app'],
				request.POST['model'])
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
				l.update({"unicode":obj.__unicode__()}) 
				#not sure about __unicode__, actually
				lst.update({i:l})
			return HttpResponse(json.dumps(lst, indent = 4 * ' '), 
				mimetype='application/json; charset=utf8')
	else:
		return HttpResponseForbidden('[{"error":"Forbidden. Wrong headers."}]', 
			mimetype='application/json; charset=utf8')

def get_filters_by_user(request):
	if request.is_ajax():
		user_filters = Filter.objects.filter(user = request.user)
		f_list = {}
		for f in user_filters:
			f_list.update({'id':f.pk, 'name':f.name, 'quick':f.quick})
		return HttpResponse(json.dumps(f_list, indent = 4 * ' '), 
			mimetype='application/json; charset=utf8')
	return HttpResponseForbidden('[{"error":"Forbidden. Wrong headers."}]', 
		mimetype='application/json; charset=utf8')


