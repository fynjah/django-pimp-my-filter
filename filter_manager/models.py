from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType

# Create your models here.
LOGICAL_OPERATORS = (('more','MORE'), 
					 ('more_eq','MORE or EQUAL'),
					 ('less','LESS'),
					 ('less_eq','LESS or EQUAL'),
					 ('eq','IS'),
					 ('not_eq','IS NOT'),
					 ('in','IN'),
					 ('like','LIKE'),
					 ('null','IS NULL'),
					 ('not_in','NOT IN'),
					 )

class Filter(models.Model):
	name = models.CharField(max_length=255)
	user = models.ForeignKey(User)
	for_all = models.BooleanField(default=False)
	quick = models.BooleanField(default=False)
	content_type = models.ForeignKey(ContentType)

	class Meta:
		verbose_name = 'Filter'
		verbose_name_plural = 'Filters'

	def __unicode__(self):
		return self.name

class Condition(models.Model):
	filter = models.ForeignKey(Filter, related_name='conditions')
	field = models.CharField(max_length=255)
	operator = models.CharField(max_length=255, choices=LOGICAL_OPERATORS)
	value = models.CharField(max_length=255)

	class Meta:
		verbose_name = 'Condition'
		verbose_name_plural = 'Conditions'

	def __unicode__(self):
		return '"%s" condition.' % self.filter
    
