# Create your views here.

from Apps.Accounting.GeneralLedger.models import *
from django.template.context import RequestContext
from django.shortcuts import render_to_response
from django.contrib.admin.views.decorators import staff_member_required

def subledger(request):
    fiscal = Ms_Fiscal_Years.objects.all()
    period = Ms_Period.objects.all()
    account = Ms_Account.objects.filter(Status=True)
    journal = jrn = {}
    debit = 0
    credit = 0
    total = 0
    a = b = fis = per = ''
    if request.method == 'POST' :       
        try:
            fis = request.POST['com_fiscal']
        except:
            pass
                    
        if fis == 'Pilih Tahun -':
            a = ''
        else :
            a = fis

    try:
        journal = Detail_Journal_Entry.objects.filter(Journal_Entry__Journal_Period__Fiscal_Year__Fiscal_Year=a,  Journal_Entry__Status=2)
        for deb in journal:
            debit += deb.Debit
    except:
        pass
        
    try:
        journal = Detail_Journal_Entry.objects.filter(Journal_Entry__Journal_Period__Fiscal_Year__Fiscal_Year=a, Journal_Entry__Status=2)
        for cre in journal:
            credit += cre.Credit
    except:
        pass
        
    if request.method == 'POST' :
        try:
           per = request.POST['com_period'] 
        except:
            pass   
        if per == 'Pilih Bulan -':
            b = ''
        else :
            b = per
    try:
        jrn = Detail_Journal_Entry.objects.filter(Journal_Entry__Journal_Period__Period_Name=b, Journal_Entry__Status=2)
        for deb in jrn:
            debit += deb.Debit
    except:
        pass
    try:
        jrn = Detail_Journal_Entry.objects.filter(Journal_Entry__Journal_Period__Period_Name=b, Journal_Entry__Status=2)
        for cre in jrn:
            credit += cre.Credit
    except:
        pass

    return render_to_response("admin/accounting/subledger.html", {'account':account,'journal':journal,'jrn':jrn,'total':total,'fiscal':fiscal,'period':period, 'a':a, 'b':b,},
                                                                        RequestContext(request,{}),
                                                                        )
report = staff_member_required(subledger)
    
def balance(request):
    account = Ms_Account.objects.all().order_by('Account_Code')
    fiscal = Ms_Fiscal_Years.objects.all()
    period = Ms_Period.objects.all()
    debit = 0
    credit = 0
    journal = jrn = {}
    a = b = fis = per = ''
    akun = Detail_Journal_Entry.objects.filter()
    if request.method == 'POST' :
        try:
            fis = request.POST['com_fiscal']
        except:
            pass
        if fis == 'Pilih Tahun -':
            a = ''
        else :
            a = fis
    try:
        journal = Detail_Journal_Entry.objects.filter(Journal_Entry__Journal_Period__Fiscal_Year__Fiscal_Year=a, Journal_Entry__Status=2)
        for deb in journal:
            debit += deb.Debit
    except:
        pass
    try:
        journal = Detail_Journal_Entry.objects.filter(Journal_Entry__Journal_Period__Fiscal_Year__Fiscal_Year=a, Journal_Entry__Status=2)
        for cre in journal:
            credit += cre.Credit
    except:
        pass

    if request.method == 'POST' :
        try:
           per = request.POST['com_period']
        except:
            pass   
        if per == 'Pilih Bulan -':
            b = ''
        else :
            b = per
    try:
        jrn = Detail_Journal_Entry.objects.filter(Journal_Entry__Journal_Period__Period_Name=b, Journal_Entry__Status=2)
        for deb in jrn:
            debit += deb.Debit
    except:
        pass
    try:
        jrn = Detail_Journal_Entry.objects.filter(Journal_Entry__Journal_Period__Period_Name=b, Journal_Entry__Status=2)
        for cre in jrn:
            credit += cre.Credit
    except:
        pass
    
    statusfis = ''
    try:
        if credit == debit:
            statusfis = 'BALANCE'
        else:
            statusfis = 'TIDAK BALANCE'
    except:
        pass 

    statusper = ''
    try:
        if credit == debit:
            statusper = 'BALANCE'
        else:
            statusper = 'TIDAK BALANCE'
    except:
        pass
    
    return render_to_response("admin/accounting/balance.html", 
                                            {'account':account,'debit':debit,'credit':credit,'fiscal':fiscal,'period':period,
                                            'a':a, 'b':b,'statusfis':statusfis, 'statusper':statusper},
                                                                        RequestContext(request,{}),
                                                                        )
report = staff_member_required(balance)

def lossprofit(request):
    fiscal = Ms_Fiscal_Years.objects.all()
    period = Ms_Period.objects.all()
    debit = 0
    credit = 0
    journal = jrn = {}
    a = b = fis = per = ''
    income = Ms_Account.objects.filter(Account_Code__startswith='4').order_by('Account_Code')
    expense = Ms_Account.objects.filter(Account_Code__startswith='5').order_by('Account_Code')
    debincomefis = creincomefis = debexpensefis = creexpensefis = 0
    debincomeper = creincomeper = debexpenseper = creexpenseper = 0
    if request.method == 'POST' :
        try:
            fis = request.POST['com_fiscal']
        except:
            pass
        if fis == 'Pilih Tahun -':
            a = ''
        else :
            a = fis

    jrincome = Detail_Journal_Entry.objects.filter(Account__Account_Code__startswith='4', Journal_Entry__Journal_Period__Fiscal_Year__Fiscal_Year=a, Journal_Entry__Status=2)
    jrexpense = Detail_Journal_Entry.objects.filter(Account__Account_Code__startswith='5', Journal_Entry__Journal_Period__Fiscal_Year__Fiscal_Year=a, Journal_Entry__Status=2)
    try:
        for deb in jrincome:
            debincomefis += deb.Debit
    except:
        pass
        
    try:
        for cre in jrincome:
            creincomefis += cre.Credit
    except:
        pass
        
    try:
        for deb in jrexpense:
            debexpensefis += deb.Debit
    except:
        pass
    
    try:
        for deb in jrincomefis:
            debexpensefis += deb.Credit
    except:
        pass
            
    if request.method == 'POST' :
        try:
           per = request.POST['com_period']
        except:
            pass   
        if per == 'Pilih Bulan -':
            b = ''
        else :
            b = per

    jrincomeper = Detail_Journal_Entry.objects.filter(Account__Account_Code__startswith='4', Journal_Entry__Journal_Period__Period_Name=b, Journal_Entry__Status=2)
    jrexpenseper = Detail_Journal_Entry.objects.filter(Account__Account_Code__startswith='5', Journal_Entry__Journal_Period__Period_Name=b, Journal_Entry__Status=2)
    try:
        for deb in jrincomeper:
            debincomeper += deb.Debit
    except:
        pass
        
    try:
        for cre in jrincomeper:
            creincomeper += cre.Credit
    except:
        pass
        
    try:
        for deb in jrexpenseper:
            debexpenseper += deb.Debit
    except:
        pass
    
    try:
        for deb in jrexpenseper:
            creexpenseper += deb.Credit
    except:
        pass
    pendapatantahun = bebantahun=lptahun=pendapatanbulan=bebanbulan=lpbulan=0
    pendapatantahun = debincomefis - creincomefis
    bebantahun =  debexpensefis - creexpensefis
    lptahun = pendapatantahun - bebantahun
    pendapatanbulan = debincomeper - creincomeper
    bebanbulan = debexpenseper - creexpenseper
    lpbulan = pendapatanbulan - bebanbulan
    return render_to_response("admin/accounting/lossprofit.html",
                                            {'income':income,'expense':expense,'a':a,'b':b,'fiscal':fiscal,'period':period,
                                            'debincomefis':debincomefis,'creincomefis':creincomefis,
                                            'debexpensefis':debexpensefis,'creexpensefis':creexpensefis,
                                            'debincomeper':debincomeper,'creincomeper':creincomeper,
                                            'debexpenseper':debexpenseper,'creexpenseper':creexpenseper,
                                            'pendapatantahun':pendapatantahun,'bebantahun':bebantahun,'lptahun':lptahun,
                                            'pendapatanbulan':pendapatanbulan,'bebanbulan':bebanbulan,'lpbulan':lpbulan},
                                                                        RequestContext(request,{}),
                                                                        )
report = staff_member_required(lossprofit)
