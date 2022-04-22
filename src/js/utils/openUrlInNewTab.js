export default function openUrlInNewTab(url) {
  Object.assign(document.createElement('a'), {
    target: '_blank',
    href: url,
  }).click()
}
