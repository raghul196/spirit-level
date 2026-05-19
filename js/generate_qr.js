const QRCode = require('qrcode');

const languages = {
  en: 'https://spiritlevel.online/',
  it: 'https://spiritlevel.online/it/',  
  es: 'https://spiritlevel.online/es/',
  de: 'https://spiritlevel.online/de/',
  fr: 'https://spiritlevel.online/fr/',
  pt: 'https://spiritlevel.online/pt/',
  id: 'https://spiritlevel.online/id/',
  ru: 'https://spiritlevel.online/ru/',
};


function generateQRs() {
  for (const [lang, url] of Object.entries(languages)) {
    try {
      QRCode.toFile(`./qr/${lang}.png`, url, {
        margin: 2,
        color: {
          dark: '#000',
          light: '#FFF'
        }
      });
      console.log(`✅ Generated: ${lang}.png`);
    } catch (err) {
      console.error(`❌ Error generating ${lang}:`, err);
    }
  }
  console.log('--- All done! ---');
}

generateQRs();

