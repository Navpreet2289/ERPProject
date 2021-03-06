''' @author: Rhiyananta Catur Y.W '''


from django.conf import settings
ugettext = lambda s: s
from django.utils.translation import ugettext


GROUP = getattr (settings, 'GROUP', ((1, ugettext ('Gudang Hasil Produksi')),
                                     (2, ugettext ('Gudang Material')),
                                     (3, ugettext ('Gudang Pengembalian'))))

Kualitas = getattr (settings, 'Kualitas', ((1, ugettext ('Baik')),
                                           (2, ugettext ('Cacat')),
                                           (3, ugettext ('Rusak'))))

Jenis = getattr (settings, 'Jenis', ((1, ugettext ('Material')),
                                     (2, ugettext ('Botol')),
                                     (3, ugettext ('Alat Pabrik'))))

Jenis_Barang = getattr (settings, 'Jenis_Barang', ((1, ugettext ('Bahan Dasar Cair')),
                                                   (2, ugettext ('Bahan Dasar Padat')),
                                                   (3, ugettext ('Botol')),
                                                   (4, ugettext ('Alat Pabrik')),
                                                   (5, ugettext ('Material'))))

gudang = getattr (settings, 'gudang', ((1, ugettext ('Gudang A')),
                                       (2, ugettext ('Gudang B')),
                                       (3, ugettext ('Gudang C')),
                                       (4, ugettext ('Gudang D')),
                                       (5, ugettext ('Gudang E')),
                                       (6, ugettext ('Gudang F')),
                                       (7, ugettext ('Gudang G'))))

LEVEL_AKSES =  getattr(settings, 'LEVEL_AKSES', (('Direktur', ugettext('Direktur')),
                                                 ('Kadep', ugettext('Kepala Departemen ')),
                                                 ('Kabag', ugettext('Kepala Bagian')),
                                                 ('Admin', ugettext('Admin SDM'))))
                        
