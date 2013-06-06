from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType

LOGICAL_OPERATORS = (('__gt','MORE'), 
					 ('__gte','MORE or EQUAL'),
					 ('__lt','LESS'),
					 ('__lte','LESS or EQUAL'),
					 ('__exact','IS'),
					 #('not_eq','IS NOT'),
					 ('__in','IN'),
					 ('__iexact','LIKE'),
					 ('__isnull','IS NULL'),
					 #('not_in','NOT IN'),
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
	field_type = models.CharField(max_length=255)
	operator = models.CharField(max_length=255, choices=LOGICAL_OPERATORS)
	value = models.CharField(max_length=255)
	oid = models.IntegerField(blank=True, null=True)

	class Meta:
		verbose_name = 'Condition'
		verbose_name_plural = 'Conditions'

	def __unicode__(self):
		return '"%s" condition.' % self.filter
    
