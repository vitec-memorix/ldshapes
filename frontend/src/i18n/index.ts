
import { createI18n } from 'vue-i18n'

function loadLocaleMessages () {
  const locales = require.context('./', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages: {[k: string]: any} = {};
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

// 2. Create i18n instance with options
export const translations = createI18n({
  locale: 'nl', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: loadLocaleMessages(), // set locale messages
})
