from django.contrib import admin
from example.testapp import models

class BlogAdmin(admin.ModelAdmin):
    list_display = ('__unicode__','user', 'created', 'status')
    list_filter = ('user','status')


class EntryAdmin(admin.ModelAdmin):
    list_display = ('__unicode__', 'blog', 'created')
    list_filter = ('blog', 'created',)

class StatusAdmin(admin.ModelAdmin):
    list_display = ('__unicode__',)


admin.site.register(models.Blog, BlogAdmin)
admin.site.register(models.Entry, EntryAdmin)
admin.site.register(models.Status, StatusAdmin)