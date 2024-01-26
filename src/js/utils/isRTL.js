export default function isRTL() {
  return (
    document.documentElement.dir === 'rtl' ||
    document.documentElement.lang === 'ar' ||
    document.documentElement.lang === 'iw'
  )
}
