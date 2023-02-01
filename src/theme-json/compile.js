const settings = require('./settings.js')
const styles = require('./styles.js')
const config = require('./config.js')
const fs = require('fs');

const theme = {
  ...config,
  settings: settings,
  styles: styles
}

const json = JSON.stringify(theme, null, "\t")


fs.writeFileSync('theme.json', json)