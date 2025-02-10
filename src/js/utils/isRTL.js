export default function isRTL() {
  const rtlLanguages = [
    'ar', // Arabic
    'fa', // Persian (Farsi)
    'he', // Hebrew (modern code)
    'iw', // Hebrew (legacy code)
    'ur', // Urdu
    'ps', // Pashto
    'sd', // Sindhi
    'ug', // Uyghur
    'dv', // Divehi (Maldivian)
    'ku', // Kurdish (Sorani)
    'yi', // Yiddish
  ]

  return document.documentElement.dir === 'rtl' || rtlLanguages.includes(document.documentElement.lang)
}
