﻿""" Develop By - Fery Febriyan Syah """

from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from Apps.Hrm.Data_Personel_Management.models import Employee
from Apps.Accounting.GeneralLedger.models import Ms_Journal, Ms_Period
from library.const.days import DAY_STATUS
from datetime import datetime, date, time, timedelta
from django.contrib.admin.filters import ChoicesFieldListFilter
from library.const.month import MONTH
from Apps.Hrm.Salary.models import *

class Header_Absent (models.Model):
    date_now =  models.DateField (verbose_name="Hari", auto_now_add=True)
    day_status = models.IntegerField (choices=DAY_STATUS, verbose_name="Status Hari")
    period = models.ForeignKey (Ms_Period, verbose_name="Periode")
    lock = models.BooleanField (verbose_name="Kunci",
                                help_text=')* Jangan Dicentang terlebih dahulu Sebelum Data Pegawai Di inputkan')

    class Meta:
        verbose_name = _('Absensi')
        verbose_name_plural = _('Absensi')


    def __unicode__(self):
        return '%s' % self.date_now

class Data_Absent (models.Model):
    header = models.ForeignKey (Header_Absent, verbose_name="Hari")
    employee = models.ForeignKey (Employee, verbose_name="Nama Pegawai")
    start_work = models.TimeField (verbose_name="Mulai Kerja",
                                   help_text=_('*) format durasi (HH:MM:SS) ex: 07:00'))
    end_work = models.TimeField (verbose_name="Pulang Kerja",
                                 help_text=_('*) format durasi (HH:MM:SS) ex: 15:30'))

    class Meta:
        verbose_name = _('Data Absensi')
        verbose_name_plural = _('Data Absensi')
        ordering = ['id']

    def lembur(self):
        a = time(15,30,00)
        #a = val.strftime('%H:%M')
        b = self.end_work
        #sb = end.strftime('%H:%M')
        c = timedelta(hours=b.hour-a.hour, minutes=b.minute-a.minute)
        days, seconds = c.days, c.seconds
        hours = days * 24 + seconds // 3600
        bulat = hours
        minutes = (seconds % 3600) // 60
        if minutes > 30:
            bulat += 1
        #c = b - a
        return '%(h)s jam %(m)s menit = %(bulat)s' % {'h':hours,'m':minutes,'bulat':bulat}
        #return bulat
	
    def Total_Rupiah (self):
        total = 0
        const1 = 1.5
        now = datetime.now()
        nowm = now.strftime("%m")
        nowy = now.strftime("%Y")
        strnow = '%(m)s%(y)s' % {'y':nowy,'m':nowm}
        header = Header_Salary.objects.get(employee=self.employee, period=strnow)
        pokok = Salary_Employee.objects.get(header=header)
        for i in xrange(int(self.lembur())):
            jam = self.lembur() * const1 * (1/173) * pokok.basic_salary
            const1 += 0.5
            total += jam
        return total

    def __unicode__(self):


        return '%s' % self.id
