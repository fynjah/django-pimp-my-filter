from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Blog(models.Model):
	user = models.ForeignKey(User)
	name = models.CharField(max_length=255)
	slug = models.SlugField(max_length=255)
	created = models.DateField(auto_now=True)
	status = models.ForeignKey('Status')
	awesome = models.BooleanField()
	pic = models.ImageField(upload_to='project_pics/%Y/%m/%d', blank=True, null=True)
	#just add any field, 'syncdb' and try it.

	class Meta:
		verbose_name = 'Blog'
		verbose_name_plural = 'Blogs'

	def __unicode__(self):
		return self.name

class Entry(models.Model):
	blog = models.ForeignKey(Blog)
	title = models.CharField(max_length=255)
	body = models.TextField()
	slug = models.SlugField(max_length=255)
	created = models.DateField(auto_now=True)

	class Meta:
		verbose_name = 'Entry'
		verbose_name_plural = 'Entries'

	def __unicode__(self):
		return self.title
		

class Status(models.Model):
	name = models.CharField(max_length=255)

	class Meta:
		verbose_name = 'Status'
		verbose_name_plural = 'Statuses'
	
	def __unicode__(self):
		return self.name