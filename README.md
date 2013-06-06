django-pimp-my-filter
=====================

Use it at your own risk! Alpha-dev version, as is.

#### Required: 
- Twitter Bootstrap 2.3+
- jQuery 1.9+

#### This app is designed to pimp your filter for any model, but for now it's unfinnished.. yet :)

![PIMP](https://raw.github.com/fynjah/django-pimp-my-filter/master/filter_manager/static/Untitled.png "PIMP")

How to use:
===========
1. Open your shell, ``cd /to/some/path``
2. Run ``git clone https://github.com/fynjah/django-pimp-my-filter.git``
3. Run ``cd django-pimp-my-filter``
4. Run ``[sudo] python setup.py install``
5. Now app is installed.

Connect app to your project:
============================
1. Open ``settings.py`` of your project. At the end of the file write ``INSTALLED_APPS += ('filter_manager',)``.
2. Also add this: 
<pre>
    PIMP_MY_FILTER = {
        'ALLOWED_MODELS': (
            'your_app1.your_model1', 
            'your_app2.your_model2',
            ...
            'appN.modelN',
        ),
    }
<pre>
Any other models will be ignored with error.
3. Open ``urls.py`` file. Edit ``urlpatterns`` by adding ``('^pimp-my-filter/', include('filter_manager.urls')),``
4. Open your shell, find your project and run `python manage.py syncdb`.
5. Insert [this code](https://raw.github.com/fynjah/django-pimp-my-filter/master/filter_manager/templates/base.html) to your template, somewhere.
6. Insert ``{%load% static%}`` and ``{% get_static_prefix as static_prefix %}`` to your template, at the top of the file.
7. Insert somewhere *after* jQuery and Twitter Bootstrap inits, this: ``<script type="text/javascript" src="{{ static_prefix }}filter_manager/filter_manager.js "></script>``
8. Place somewhere in template, this:
<pre>
	    $(document).ready(function(){
	        $(document).on('click', '#new-filter-button', function(e){
	                    e.preventDefault()
	                    $('#new-filter').pimpMyFilter({
	                        name:'Name of your modal',
	                        app:'your_app_to_use_filter_manager',
	                        model:'your_model_of_the_app_to_use_filter', 
	                        modalWidth:1000, //width of modal, req. from "800" to "1000". But, anyway it's fluid. default:"800"
	                        url:"/your_url_pattern_to_filter_manager/" //default: "/pimp-my-filter/",
	                        limit:10, //default: '0'. Limit num of conditions.
	                    });
	                });
	            });
</pre>
9. Start your project, jump to page with edited template and click this pretty button `New filter`
10. You'll see modal window, something like on the pic at the top of this README.
11. Try to select some field. Each type of field has own `value` field, that corresponds to type of field in model.
12. Try to select `ForeignKey` field(find name of field in your model), and try to start typing in `value` field.
13. That's it.

JS API
======
1. Resize modal: `pimpMyFilter.setModalWidth(1000)`
2. Redefine `value` field( *not tested* ): 
	<pre>
		pimpFields.[type_of_field] = function(ModelField){ 
		//ModelField comes from pimpMyFilter.settings.structure
		//ModelField = {"name":"some_name","type":"some_type"}. Use it.

	                    field = this.__AbstractInputField();
	                    //or field = this.__AbstractSelectField();
	                    //..
	                    //... Your definition of field, e.g field.css(), etc
	                    //..
	                    return field;
		}
	</pre>
3. Get filters by current user:
<pre>
	pimpMyFilter.getFiltersByUser();
</pre>
It returs object with `id`, `name` and `quick`.
4. Use saved filter:
<pre>
	pimpMyFilter.userFilter(filter_id);
</pre>
where `filter_id` - is from `pimpMyFilter.getFiltersByUser();`


Known issues
============
1. Some bugs with HTML markup, but works nice with Chrome.
2. For this moment you CAN use filters, but some fields do not work at this moment.
3. Lot of other bugs, which I will fix soon:)

TODO
====
1. Tags
2. Fix fields in `views.py`
3. API

PS: This app is designed for modern browsers! *Stop supporting old versions of IE!*
