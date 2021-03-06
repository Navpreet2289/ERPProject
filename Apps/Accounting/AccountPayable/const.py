from django.conf import settings
# coding: utf-8
ugettext = lambda s: s

# Payment Status.
PAYMENT_STATUS_CHOICES =  getattr(settings, 'PAYMENT_STATUS_CHOICES', ((1, ugettext('Kredit')),
                                                                     (2, ugettext('Lunas'))))
                                                                     
PAYMENT_STATUS_LUNAS =  getattr(settings, 'PAYMENT_STATUS_LUNAS', ((1, ugettext('Kredit'))))

# Payment Type choices.
PAYMENT_TYPE_CHOICES =  getattr(settings, 'PAYMENT_TYPE_CHOICES', ((1, ugettext('Uang Muka')),
                                                                   (2, ugettext('Pembayaran Pertama')),
                                                                     (3, ugettext('Pembayaran Kedua')),
                                                                     (4, ugettext('Pembayaran Denda'))))

PAYMENT_METHOD_CHOICES = getattr(settings, 'PAYMENT_METHOD_CHOICES', ((1, ugettext('Bank')),
                                                                   (2, ugettext('Tunai'))))

ACCOUNT_VALUE =  getattr(settings, 'ACCOUNT_VALUE', ((1, ugettext('Kredit')),
                                                    (2, ugettext('Debit'))))
