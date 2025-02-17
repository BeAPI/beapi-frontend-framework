export default function isRTL(container = document.documentElement) {
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

  return container.dir === 'rtl' || rtlLanguages.includes(container.lang)
}
