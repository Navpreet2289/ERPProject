# Create your views here.
from Apps.Manufacturing.ProductionPlanning.models import *
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404, render_to_response
from django.contrib.auth.models import Group
from django.template import RequestContext, loader

def reportmanufacturing(request,id):
	data = production_plans.objects.get(id=id)    
	return render(request,'templatemanufacturing/print_schedule.html',{'data':data})
    
