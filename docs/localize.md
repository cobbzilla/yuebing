Localizing Yuebing
==================
In an effort to reach as much of the world's population as we can,
I've tried to make localizing Yuebing as simple as possible

## hokeylization
[hokeylization](https://github.com/cobbzilla/hokeylization) ("hokey localization") uses Google Translate to
create all the locale-specific resources for a new language, based on a default language

#### *Please help refine Yuebing's hokeylized translations*
Yuebing has already been hokeylized from English into 21 other languages; these translations are undoubtedly
flawed -- *corrections are very welcome!* Please send a [pull request on GitHub](https://github.com/cobbzilla/yuebing/pulls),
or if you're not comfortable doing that, [open an issue](https://github.com/cobbzilla/yuebing/issues).

When you create a new GitHub issue about a translation, please do:
* include the page URL (copy/paste from browser address bar)
* include the exact text that is wrong (copy/paste from browser)
* kindly offer a suggestion of a better translation
* **Thank you!**

### Bootstrapping a new language with hokeylization
In the example below, we use a locale name `qq`, which is not a valid 2-letter ISO language code.

The only languages that will work with hokeylization are the language codes
[recognized by Google Translate](https://cloud.google.com/translate/docs/languages)

In the example below, the default locale is `en`, but you can set a different value for the default locale
by setting the `YB_DEFAULT_LOCALE` env var. Or if you really want to hard-code things, edit `nuxt.config.js` and
set the `publicRuntimeConfig.defaultLocale` property.

To bootstrap a locale `qq`:
* Edit `nuxt.config.json`, add the 2-letter language code (`qq` in this example) to the `publicRuntimeConfig.locales` array
* Edit `shared/messages/en_messages.json`, define a new key `locale_qq: 'QQish'` (others for example: `locale_fr: 'French'` or `locale_ur: 'Urdu'`)
* Run `yarn hokeylize`, this will:
  * Generate `shared/messages/qq_messages.json` with Google Translate versions of the `en` file
  * Update all the other `shared/messages/*_messages.json` files (**except `en`**) with their translations for `locale_qq: 'QQish'`
  * Generate files in `serverMiddleware/templates/email/qq/...` for all the email templates

Examine the files for errors and corrections!

----

## Adding a new locale from scratch
To add support for a new locale without hokeylization, you will need to:
* Define email templates in `serverMiddleware/templates/email/`
* Define a string table in `shared/messages/`

The email templates determine the language-specific emails that get sent out, based on the user's locale

The string table determines what appears in the web UI, based on the user's local

### Locale naming for examples
In the examples below, we use a locale name `qq`, which is not a valid 2-letter ISO code

You should use the appropriate code for your translation

Use one of the 2-letter abbreviations in the `639-1` column on this
<a href="https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes">list of ISO language codes</a> 

### Email templates
Create a directory in `serverMiddleware/templates/email/qq/`

Populate this directory with translations of every file from one of the other locale-specific template directories

### String table
Create a file named `shared/messages/qq_messages.js` (copy another one of the locale files)

Provide translations for all of the string messages

### Update the Nuxt locales list
Edit `nuxt.config.js` and add your locale to the `publicRuntimeConfig.locales` array

### Help the community!
Commit your changes and submit a pull request on GitHub to help everyone else out!
