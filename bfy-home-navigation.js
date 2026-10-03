/* Keep existing homepage links pointing to the reorganized resources. */
(() => {
  'use strict';
  const destinations = {
  "kitaplar": "kaynak-magazasi.html#kitaplar",
  "p-fizik11": "kaynak-magazasi.html#p-fizik11",
  "p-kitap10": "kaynak-magazasi.html#p-kitap10",
  "p-kitap": "kaynak-magazasi.html#p-kitap",
  "p-foy": "kaynak-magazasi.html#p-foy",
  "p-kit": "kaynak-magazasi.html#p-kit",
  "p-yazili": "kaynak-magazasi.html#p-yazili",
  "p-deney": "kaynak-magazasi.html#p-deney",
  "p-baglam": "kaynak-magazasi.html#p-baglam",
  "fizo": "kaynak-magazasi.html#fizo",
  "hocam": "kaynak-magazasi.html#hocam",
  "uygulamalar": "kaynak-magazasi.html#uygulamalar",
  "sinav-reklam-detay": "kaynak-magazasi.html#sinav-reklam-detay",
  "featured-kit": "kaynak-magazasi.html#p-kit",
  "featured-exams": "kaynak-magazasi.html#p-yazili",
  "phrase-title": "kaynak-magazasi.html#p-fizikce",
  "f11-baslik": "kaynak-magazasi.html#p-fizik11",
  "kaynaklar": "kaynak-magazasi.html",
  "senin-icin": "ogrenci.html",
  "p-sim": "simulasyonlar.html",
  "p-testler": "testler.html",
  "p-oyun": "oyunlar.html",
  "p-video": "videolar.html",
  "p-plan": "fizik-yillik-plani-indir.html",
  "yillik-planlar": "fizik-yillik-plani-indir.html"
};
  function followLegacyLink() {
    const id = location.hash.slice(1);
    if (!Object.prototype.hasOwnProperty.call(destinations, id)) return;
    const target = new URL(destinations[id], location.href);
    target.search = location.search;
    location.replace(target.href);
  }
  followLegacyLink();
  window.addEventListener('hashchange', followLegacyLink);
})();
