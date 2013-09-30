Change list
===========
####06/06/2013

1. Added `use_filter` view. Now filtersm with almost all fields, works fine.
2. Added `PIMP_MY_FILTER` width `ALLOWED_MODELS` in `settings.py`, to store allowed models. Any other models will be forbidden to use by `var pimpMyFilter`. **CASE SENSITIVE**
<pre>
    PIMP_MY_FILTER = {
        'ALLOWED_MODELS': (
            'app1.model', 
            'app2.model',
            ...
            'appN.modelN',
        ),
    }
<pre>
3. Added new API to `var pimpMyFilter`: 
3.1. `.useFilter(filter_id)` - returns filtered list of objects.
3.2. `.getFitlersByUser()` - returns list of filters created by user.
4. Rewritten `abstract fields` in `pimpFields`, now using `.data()` to store `name`,`type` and `fk_id` on choice.
5. Bug fixes. More to come.
6. Added minified version of js - `filter_manager.min.js`

####05/06/2013
1. `use_filter` init. For this moment you CAN use filters, but no API yet. Also, lot of bugs. At this moment works filters, such as:`name` `equal` `some_value`. `http://<your_host>/pimp-my-filter/use_filter/?filter_id=2`

####04/06/2013
1. Some minor fixes
2. Added simple validation, before saving filter.
3. Fixed `modal('hide')`

####22/05/2013
1. Fix of hardcoded urls in `$.pimpMyFilter()`.
2. Bootstrap `typeahead` fix.
3. Added simple support of `ManyToManyField`.
4. Added `limit` to settings. Now you can limit num of conditions for user. Default `limit:0` (unlimited).
5. Updated fields declaration.
6. Added regexp html5 validation to fields, using `pattern` attribute. Not tested yet.

####21/05/2013
1. Init
2. Cleaning
3. Setup.py
4. How to use
