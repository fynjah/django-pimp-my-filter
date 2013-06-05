Change list
===========
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