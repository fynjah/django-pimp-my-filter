from django.contrib import admin
from filter_manager import models

class FilterAdmin(admin.ModelAdmin):
    list_display = ('__unicode__','user', 'quick','content_type')
    list_filter = ('user','quick')


class ConditionAdmin(admin.ModelAdmin):
    list_display = ('__unicode__', 'filter', 'field', 'operator', 'value')
    list_filter = ('filter', 'operator',)


admin.site.register(models.Filter, FilterAdmin)
admin.site.register(models.Condition, ConditionAdmin)