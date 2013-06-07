# -*- coding: utf8 -*- 
from django import forms


class Login(forms.Form):
	name = forms.CharField(
		widget=forms.TextInput(attrs={'class':'special','type':'text','name':'username'}))
	password = forms.CharField(
		widget=forms.TextInput(attrs={'class':'special','type':'text','name':'password'}))
