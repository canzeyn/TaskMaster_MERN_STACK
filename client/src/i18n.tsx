
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // Http backend plugin'ini yükle
  .use(Backend) // backend den gelecek verilere izin verir
  // Otomatik dil algılama için browser language detector plugin'ini yükle
  .use(LanguageDetector) // kullanıcının hangi dili kullanıcağını bulur 
  // react-i18next modülünü geç
  .use(initReactI18next)
  // i18next'i başlat
  .init({
    fallbackLng: 'en', // varsayılan olarak inglizce seçili eğer kişinin kullandığı dil yoksa otomatik olarak ingilizce verir verileri
    debug: true, // hata olursa hataları console kısmına yazdırır
    detection: { // kullanıcının dili aşağıdaki yerlerden alınır sırasıyla hangisindeyse alınır
      order: ['queryString', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
    },
    interpolation: {
      escapeValue: false, // xss saldırlılarına karşı koruma 
    },
    // Çevirilerin yolu
    backend: {
      loadPath: '/translations/{{lng}}.json', // çeviri dosyaları buradan alınır
    },
  });

export default i18n;
