"""Develop By - Achmad Afiffudin N"""

from django.db import models
from django.utils.translation import ugettext as _
from django.db.models import signals
from Apps.Procurement.purchaseOrder.models import *
from Apps.Accounting.GeneralLedger.models import *
from datetime import datetime, timedelta
from decimal import Decimal
from django.db.models import Q
from Apps.Accounting.AccountPayable.const import *
from Apps.Procurement.internal.models import *
from Apps.Procurement.vendor.const.const import *
from Apps.Hrm.FromHrm.models import *

class Detail_Purchase_Account(models.Model):
    PO = models.ForeignKey(Purchase_Order, verbose_name=_('PO '))
    Account = models.ForeignKey(Ms_Account, verbose_name=_('Akun '))
    Type = models.IntegerField(_('Tipe Akun'), choices=ACCOUNT_VALUE)

    class Meta:
        verbose_name = _('Detail Akun PP')
        verbose_name_plural = _('Detail Akun PP')
        ordering = ['-id']
        db_table = "FAAP | Akun PO"

    def __unicode__(self):
        return '%s' % self.PO


def create_detail_Journal(sender, created, instance, **kwargs):
    from Apps.Accounting.GeneralLedger.models import Detail_Journal_Entry, Tr_Journal_Entry
    if created:
        if instance.Type == 1:
            b=0
            try:
                je = Tr_Journal_Entry.objects.filter(Reference=instance.PO.no_reg)
                b = je.count()
                if b == 1:
                    for j in je: Detail_Journal_Entry.objects.create(Reference=instance.PO.no_reg, 
                    Account=instance.Account, Journal_Entry=j,  Debit=instance.PO.total_expenditure(), Credit=0)
                else:
                    for j in je: Detail_Journal_Entry.objects.update(Reference=instance.PO.no_reg, 
                    Account=instance.Account, Journal_Entry=j,  Debit=instance.PO.total_expenditure(), Credit=0)
            except:
                pass
        else:
            b=0
            try:
                je = Tr_Journal_Entry.objects.filter(Reference=instance.PO.no_reg)
                b = je.count()
                if b == 1:
                    for j in je: Detail_Journal_Entry.objects.create(Reference=instance.PO.no_reg, 
                    Account=instance.Account, Journal_Entry=j, Debit=0, Credit=instance.PO.total_expenditure())
                else:
                    for j in je: Detail_Journal_Entry.objects.update(Reference=instance.PO.no_reg, 
                    Account=instance.Account, Journal_Entry=j,  Debit=instance.PO.total_expenditure(), Credit=0)
            except:
                pass
signals.post_save.connect(create_detail_Journal, sender=Detail_Purchase_Account, weak=False, dispatch_uid='create_detail_Journal')

PAYMENT_STATUS =  getattr(settings, 'PAYMENT_STATUS', ((1, ugettext('Credit')), (2, ugettext('Lunas'))))
class Tr_Purchase_Pay(models.Model):
    PO = models.OneToOneField(Purchase_Order, verbose_name=_('PO '))
    Total_Payment = models.DecimalField(_('Total yang harus dibayar '), max_digits=19, decimal_places=2, default=0)
    Total_Credit = models.DecimalField(_('Hutang Terbayar '), max_digits=19, decimal_places=2, default=0)
    Total_Residu = models.DecimalField(_('Sisa Hutang '), max_digits=19, decimal_places=2, default=0)
    Payment_Status = models.IntegerField(_('Status Pembayaran '), choices=PAYMENT_STATUS)

    class Meta:
        verbose_name = _('Pembayaran Pembelian')
        verbose_name_plural = _('Pembayaran Pembelian')
        ordering = ['-id']
        db_table = "FAAP | Info Pembayaran PO"

    def __unicode__(self):
        return '%s' % self.PO

    def total_payment(self):
        total_payment = self.PO.total_expenditure()
        return total_payment
    total_payment.short_description = _('Total yang harus dibayar')

    def total_credit(self):
        total_credit = 0
        try:
            b = Tr_Purchase_Payment.objects.filter(PO__id=self.id)
            for bs in b:
                total_credit += bs.Paid_Amount
        except:
            pass
            
        return total_credit
    total_credit.short_description = _('Hutang Terbayar')

    def total_residu(self):
        total_residu = 0
        total_residu = self.total_payment() - self.total_credit()
        return total_residu
    total_residu.short_description = _('Sisa Hutang')

    def payment_status(self):
        if self.total_residu() == 0:
            status = 'Lunas'
        elif self.total_credit() == 0:
            status = 'Belum Dibayar'
        else:
            status = 'Kredit'
        return status
    payment_status.short_description = _('Status Pembayaran')

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        self.Total_Payment = self.total_payment()
        self.Total_Credit = self.total_credit()
        self.Total_Residu = self.total_residu()
        if self.Total_Residu > 0: self.Payment_Status = 1
        else: self.Payment_Status = 2
        super(Tr_Purchase_Pay, self).save()
        
PAYMENT_METHOD =  getattr(settings, 'PAYMENT_METHOD', ((1, ugettext('Cash')), (2, ugettext('Bank'))))        
class Tr_Purchase_Payment(models.Model):
    Payment_No = models.CharField(verbose_name=_('Nomor Pembayaran '), null=True, blank=True, max_length=20)
    PO = models.ForeignKey(Tr_Purchase_Pay, verbose_name=_('PO '))
    Paid_Amount = models.DecimalField(_('Jumlah Pembayaran '), max_digits=19, decimal_places=2, default=0)
    Bank_Payment = models.ForeignKey(Ms_Bank, verbose_name=_('Bayar Dari Bank'), blank=True, null=True, on_delete=models.SET_NULL,
    help_text='*) Jika Membayar Melalui Bank, Pilih Bank')
    Cash_Payment = models.ForeignKey(Ms_Cash, verbose_name=_('Bayar Dari Kas'), blank=True, null=True, on_delete=models.SET_NULL,
    help_text='*) Jika Membayar Melalui Kas, Pilih Kas')
    Date = models.DateField(_('Tanggal Pembayaran'), default=datetime.now())
    Memo = models.TextField(verbose_name=_('Memo '), null=True, blank=True, max_length=50)
    Period = models.ForeignKey(Ms_Period, verbose_name=_('Periode '))
    Journal = models.ForeignKey(Ms_Journal, verbose_name=_('Jurnal '))
    Control = models.BooleanField(verbose_name=_('Persetujuan'), default=False, 
    help_text='*) Persetujuan Dilakukan Oleh Kasi Keuangan')

    class Meta:
        verbose_name = _('Pembayaran Belanja')
        verbose_name_plural = _('Pembayaran Belanja')
        ordering = ['-id']
        db_table = "FAAP | Pembayaran Belanja"

    def __unicode__(self):
        return '%s' % self.Payment_No

    def incstring(self):
        try:
            data = Tr_Purchase_Payment.objects.all().order_by('-Date')
            jml = data.count()
        except:
            jml=0
            pass
        no = 0
        if jml == 0:
            no = 0
        else:
            for d in data:
                split = str(d.Payment_No).split('/')
                no = int(split[3])
        num = no + 1
        cstring = str(num)
        return cstring
	
    def inclen(self):
        leng = len(self.incstring())
        return leng

    def purchase_payment_id(self):
        date = datetime.now()
        now = date.strftime("%m")
        nowyear = date.strftime("%Y")
        intnow = int(now)
        intyear = int(nowyear)
        strnow = str(intnow)
        if len(strnow) < 2 :
            strnow = '0%(strnow)s' % {'strnow' : strnow}
        nol = 5 - self.inclen()
        if nol == 1: num = "0"
        elif nol == 2: num = "00"
        elif nol == 3: num = "000"
        elif nol == 4: num = "0000"
        number = num + self.incstring()
        if self.Bank_Payment is None and self.Cash_Payment is not None:
            prefik = "CS"
        else :
            prefik = "BK"
        return '%(prefix)s/%(year)s/%(month)s/%(unik)s' % {'prefix': prefik, 'year': intyear, 'month': strnow, 'unik': number}

    def jurnal(self):
        a = Ms_Journal.objects.get(Type=4)
        if self.Bank_Payment is None and self.Cash_Payment is not None:
            a = Ms_Journal.objects.get(Type=4)
        elif self.Cash_Payment is None and self.Bank_Payment is not None:
            a = Ms_Journal.objects.get(Type=5)
        return a
 
    def status(self):
        ac = 0
        try:
            data = Detail_Purchase_Payment_Account.objects.filter(Payment__id=self.id)
            ac = data.count()
        except:
            pass
        if ac == 2:
            sts = 'Akun Terisi'
        elif ac == 1:
            sts = 'Akun Tidak Lengkap'
        else:
            sts = 'Akun Kosong'
        return sts

    def period(self):
        today = datetime.now().date()
        a = 0
        try:
            per = Ms_Period.objects.filter(Start_Period__lte=today, End_Period__gte=today)
            a = per.count()
        except:
            pass
        if a == 1:
            for x in per:
               b = x.Code
               c = Ms_Period.objects.get(Code=b)
        else:
            c = self.Period
        return c
                
    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        if self.Payment_No is None:
            self.Payment_No = self.purchase_payment_id()
        else:
            self.Payment_No = self.Payment_No
        self.Period = self.period()
        self.Journal = self.jurnal()
        super(Tr_Purchase_Payment, self).save()

def create_Journal(sender, created, instance, **kwargs):
    from Apps.Accounting.GeneralLedger.models import Tr_Journal_Entry
    from Apps.Accounting.CashBank.models import Tr_Cash, Tr_Bank
    if instance.Control == True:
        n=0
        try:
            a = Tr_Journal_Entry.objects.filter(Reference=instance.Payment_No)
            n = a.count()
            if n == 0 :
                Tr_Journal_Entry.objects.create(Journal=instance.Journal, Journal_Period=instance.Period,
                Reference=instance.Payment_No)
                if instance.Bank_Payment is None and instance.Cash_Payment is not None:
                    Tr_Cash.objects.create(Reference=instance.Payment_No, Cash=instance.Cash_Payment, Debit=0,
                    Credit=instance.Paid_Amount)  
                else:
                    Tr_Bank.objects.create(Reference=instance.Payment_No, Bank=instance.Bank_Payment, Debit=0,
                    Credit=instance.Paid_Amount)
        except:
            pass
signals.post_save.connect(create_Journal, sender=Tr_Purchase_Payment, weak=False, dispatch_uid='create_Journal')

def delete_journal(sender,instance, **kwargs):
    from Apps.Accounting.GeneralLedger.models import Tr_Journal_Entry, Detail_Journal_Entry
    from Apps.Accounting.CashBank.models import Tr_Cash, Tr_Bank
    n=0
    try:
        a = Tr_Journal_Entry.objects.filter(Reference=instance.Payment_No)
        n = a.count()
        if n == 1 :
            for x in a:
                b = x.Reference
                Tr_Journal_Entry.objects.filter(Reference=b).delete()
                Detail_Journal_Entry.objects.filter(Reference=b).delete()
                Tr_Cash.objects.filter(Reference=b).delete()
                Tr_Bank.objects.filter(Reference=b).delete()
    except:
        pass                             
signals.post_delete.connect(delete_journal, sender=Tr_Purchase_Payment, weak=False, dispatch_uid='delete_Journal')

class Detail_Purchase_Payment_Account(models.Model):
    Payment = models.ForeignKey(Tr_Purchase_Payment, verbose_name=_('Pembayaran '))
    Account = models.ForeignKey(Ms_Account, verbose_name=_('Akun '))
    Type = models.IntegerField(_('Tipe Akun'), choices=ACCOUNT_VALUE)

    class Meta:
        verbose_name = _('Jurnal Item Pembayaran')
        verbose_name_plural = _('Jurnal Item Pembayaran')
        ordering = ['-id']
        db_table = "FAAP | Akun Pembayaran Belanja"

    def __unicode__(self):
        return '%s' % self.Payment

def create_detail_journal_payment(sender, created, instance, **kwargs):
    from Apps.Accounting.GeneralLedger.models import Detail_Journal_Entry, Tr_Journal_Entry
    from Apps.Accounting.CashBank.models import Tr_Bank, Tr_Cash
    if created:
        if instance.Type == 1:
            b=0
            try:
                je = Tr_Journal_Entry.objects.filter(Reference=instance.Payment.Payment_No)
                b = je.count()
                if b == 1:
                    for j in je: Detail_Journal_Entry.objects.create(Reference=instance.Payment.Payment_No,
                    Account=instance.Account, Journal_Entry=j,  Debit=instance.Payment.Paid_Amount, Credit=0)
                else:
                    Detail_Journal_Entry.objects.create(Reference=instance.Payment.Payment_No, Account=instance.Account,
                    Debit=instance.Payment.Paid_Amount, Credit=0)
            except:
                pass
                
        else:
            b=0
            try:
                je = Tr_Journal_Entry.objects.filter(Reference=instance.Payment.Payment_No)
                b = je.count()
                if b == 1:
                    for j in je: Detail_Journal_Entry.objects.create(Reference=instance.Payment.Payment_No,
                    Account=instance.Account,
                    Journal_Entry=j, Debit=0, Credit=instance.Payment.Paid_Amount)
                else:
                    Detail_Journal_Entry.objects.create(Reference=instance.Payment.Payment_No, Account=instance.Account, Debit=0,
                    Credit=instance.Payment.Paid_Amount)
            except:
                pass
signals.post_save.connect(create_detail_journal_payment, sender=Detail_Purchase_Payment_Account, weak=False, dispatch_uid='create_detail_journal_payment')

class Payroll(Tr_Payroll):
    class Meta:
        proxy = True
        verbose_name = 'Akun Penggajian'
        verbose_name_plural = 'Akun Penggajian'

    def status(self):
        ac = 0
        try:
            data = Detail_Payroll_Account.objects.filter(Payroll__id=self.id)
            ac = data.count()        
        except:
            pass
        if ac == 2:
            sts = 'Akun Terisi'
        elif ac == 1:
            sts = 'Akun Tidak Lengkap'
        else:
            sts = 'Akun Kosong'
        return sts

class Detail_Payroll_Account(models.Model):
    Payroll = models.ForeignKey(Tr_Payroll, verbose_name=_('Gaji '))
    Account = models.ForeignKey(Ms_Account, verbose_name=_('Akun '))
    Type = models.IntegerField(_('Tipe Akun'), choices=ACCOUNT_VALUE)

    class Meta:
        verbose_name = _('Akun Pembayaran Gaji')
        verbose_name_plural = _('Akun Pembayaran Gaji')
        ordering = ['-id']
        db_table = "FAAP | Akun Pembayaran Gaji"

    def __unicode__(self):
        return '%s' % self.Payroll

def create_detail_journal_payment(sender, created, instance, **kwargs):
    from Apps.Accounting.GeneralLedger.models import Detail_Journal_Entry, Tr_Journal_Entry
    from Apps.Accounting.CashBank.models import Tr_Bank, Tr_Cash
    if created:
        if instance.Type == 1:
            b=0
            try:
                je = Tr_Journal_Entry.objects.filter(Reference=instance.Payroll.Payroll_No)
                b = je.count()
                if b == 1:
                    for j in je: Detail_Journal_Entry.objects.create(Reference=instance.Payroll.Payroll_No,
                    Account=instance.Account, Journal_Entry=j, Debit=instance.Payroll.total(), Credit=0)
                else:
                    Detail_Journal_Entry.objects.create(Reference=instance.Payroll.Payroll_No, Account=instance.Account,
                    Debit=instance.Payroll.total(), Credit=0)
            except:
                pass
                
        else:
            b=0
            try:
                je = Tr_Journal_Entry.objects.filter(Reference=instance.Payroll.Payroll_No)
                b = je.count()
                if b == 1:
                    for j in je: Detail_Journal_Entry.objects.create(Reference=instance.Payroll.Payroll_No,
                    Account=instance.Account,
                    Journal_Entry=j, Debit=0, Credit=instance.Payroll.total())
                else:
                    Detail_Journal_Entry.objects.create(Reference=instance.Payroll.Payroll_No, Account=instance.Account, Debit=0,
                    Credit=instance.Payroll.total())
            except:
                pass
signals.post_save.connect(create_detail_journal_payment, sender=Detail_Payroll_Account, weak=False, dispatch_uid='create_detail_journal_payment')
