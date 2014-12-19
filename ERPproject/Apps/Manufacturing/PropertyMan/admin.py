from django.contrib import admin
from Apps.Manufacturing.PropertyMan.models import *


class Role_user_man_admin(admin.ModelAdmin):
	list_display = ['user','access_level','intern_occupation','intern_date_register','department']
	list_per_page = 10

admin.site.register(Role_user_man, Role_user_man_admin)
