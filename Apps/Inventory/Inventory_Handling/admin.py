from django.contrib import admin
from Apps.Inventory.Inventory_Handling.models import *
#from Apps.Inventory.Inventory_Handling.models import handling_commodity_in, handling_commodity_out, Mutation, Mutation_material, handling_commodity_material_in, handling_commodity_material_out, master_commodity

class handling_commodity_inAdmin(admin.ModelAdmin):
    list_display = ('commodity_name','date_in','unit','total_commodity','status')
    search_field = ['commodity_name']

admin.site.register(handling_commodity_in, handling_commodity_inAdmin)

class handling_commodity_outAdmin(admin.ModelAdmin):
    list_display = ('commodity_name','date','unit','total_commodity','status')
    search_field = ['commodity_name']

admin.site.register(handling_commodity_out, handling_commodity_outAdmin)

class Ms_commodityAdmin (admin.ModelAdmin):
    list_display = ('warehouse_name','no_commodity','name_commodity','quantity_commodity','unit','total_stock','description')
    search_field = ['name_commodity']

admin.site.register(Ms_commodity, Ms_commodityAdmin)

class MutationAdmin (admin.ModelAdmin):
    list_display = ('commodity_name','warehouse_name','to_warehouse','date','description','agrement')
    search_fields = ['commodity_name']

admin.site.register(Mutation, MutationAdmin)

class Mutation_materialAdmin (admin.ModelAdmin):
    list_display = ('commodity_name','warehouse_name','to_warehouse','date','description','agrement')
    search_fields = ['commodity_name']

admin.site.register(Mutation_material, Mutation_materialAdmin)

class handling_commodity_material_inAdmin(admin.ModelAdmin):
    list_display = ('commodity_name','date_in','unit','total_commodity','status')
    search_field = ['commodity_name']

admin.site.register(handling_commodity_material_in, handling_commodity_material_inAdmin)

#class commoditymaterialoutInline(admin.StackedInline):
#    model = handling_commodity_material_out
#    extra = 0
#    verbose_name_plural = "Detail Barang"
#    verbose_name = "Detail Barang"
#    field = ['warehouse_name','commodity_name','commodity_no','quantity_commodity','type_commodity','unit','total_stock','description']
#    max_num = 10

class handling_commodity_material_outAdmin(admin.ModelAdmin):
    list_display = ('commodity_name','date','unit','total_commodity','status')
    search_field = ['commodity_name']

admin.site.register(handling_commodity_material_out, handling_commodity_material_outAdmin)

class master_commodityAdmin (admin.ModelAdmin):
    list_display = ('warehouse_name','commodity_name','commodity_no','quantity_commodity','type_commodity','unit','total_stock','description', 'print_pdf')
    search_field = ['commodity_name']
#    inlines = [commoditymaterialoutInline]

admin.site.register(master_commodity, master_commodityAdmin)


