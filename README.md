django-pimp-my-filter
=====================

Use it at your own risk! Alpha-dev version, as is.

#### Required: 
- Twitter Bootsrap 2.3+
- jQuery 1.9+

#### App designed to pimp your filter for any model, but for now it's unfinnished :)

![PIMP](https://raw.github.com/fynjah/django-pimp-my-filter/master/filter_manager/static/Untitled.png "PIMP")

How to use:
===========
1. Open your shell, ``cd /to/some/path``
2. Run ``git clone https://github.com/fynjah/django-pimp-my-filter.git``
3. Run ``cd django-pimp-my-filter``
4. Run ``[sudo] python setup install``
5. Now app is installed.

Install app in your project:
============================
1. Open ``settings.py`` of your project. At the end of file write ``INSTALLED_APPS += ('filter_manager',)``
2. Open ``urls.py`` file. Edit ``urlpatterns`` by adding ``('^pimp-my-filter/', include('filter_manager.urls')),``
3. Add [this code](https://raw.github.com/fynjah/django-pimp-my-filter/master/filter_manager/templates/base.html) to your template, somewhere.
4. Add to your template, on the top of file: ``{% get_static_prefix as static_prefix %}``
5. Add somewhere *after* jQuery and Twitter Bootstrap inits, this: ``<script type="text/javascript" src="{{ static_prefix }}filter_manager/filter_manager.js "></script>``
6. Place somewhere after jQuery, Twitter Bootstrap and PimpMyFilter inits, something like this:
<pre>
    $(document).ready(function(){
        $(document).on('click', '#new-filter-button', function(e){
                    e.preventDefault()
                    $('#new-filter').pimpMyFilter({
                        name:'Name of your modal',
                        app:'your_app_to_use_filter_manager',
                        model:'your_model_of_the_app_to_use_filter',
                        modalWidth:1000, //width of modal, req. >800m but <1000. Anyway it's fluid.
                    });
                });
            });
</pre>
7. that's it.
