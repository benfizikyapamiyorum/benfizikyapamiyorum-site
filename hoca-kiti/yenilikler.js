// Hoca Kiti "Yeni" listesi: hocaların görmediği eklemeler (giriş sayfasındaki sınıf kartlarında "N yeni" rozeti,
// kit menüsünün üstünde "🔔 Yeni" şeridi). Görüldü durumu hocanın cihazında tutulur (localStorage bfy_hk_yeni, sınıf bazında).
// Yeni bir ekleme ya da düzeltme yayımlanınca listenin BAŞINA bir satır ekleyin, sonra node hocakiti/sifrele.js:
//   id        benzersiz ve kalıcı (değiştirmeyin; değişirse herkese yeniden "yeni" görünür)
//   tarih     YYYY-AA-GG (60 günden eski satırlar "yeni" sayılmaz, listede kalır)
//   siniflar  [9], [10, 11] gibi
//   baslik, aciklama  kısa; gizli bilgi yazmayın (bu dosya sitede açık yayımlanır, içerik değil yalnız başlıklar)
//   link      kit klasörü içindeki sayfa; {S} sınıf numarasıyla değişir (ör. BFY{S}_Aylik_Kasim_DENEME_interaktif.html)
window.BFY_HK_YENI = [
  { id: '2026-11-aylik-kasim', tarih: '2026-11-10', siniflar: [9, 10, 11], baslik: 'Kasım aylık denemesi eklendi', aciklama: '20 soru, 40 dakika, Maarif Modeli\'ne uygun çoktan seçmeli deneme: tahtada soru soru sunum, cevaplı ve çözümlü nüsha, öğrenci kâğıdı ve PDF\'ler.', link: 'BFY{S}_Aylik_Kasim_DENEME_interaktif.html' }
];
