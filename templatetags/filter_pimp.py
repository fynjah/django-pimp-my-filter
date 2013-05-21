from django import template

register = template.Library()

@register.simple_tag
def pimp_tag(app):
		return '<div id="pimp-my-tag" rel="%s" style="display:none;"></div>' % app