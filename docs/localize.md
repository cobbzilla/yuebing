Localizing Yuebing
==================
In an effort to reach as much of the world's population as we can,
I've tried to make localizing Yuebing as simple as possible.

# Adding support for new locales
To add support for a new locale, you will need to:
* Define email templates in `serverMiddleware/templates/email/`
* Define a string table in `shared/messages/`

The email templates determine the language-specific emails that get sent out, based on the user's locale.

The string table determines what appears in the web UI, based on the user's local.

## Locale naming for examples
In the examples below, we use a locale name `qq`, which is not a valid 2-letter ISO code.
You should use the appropriate code for your translation.

Use one of the 2-letter abbreviations in the `639-1` column on this
<a href="https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes">list of ISO language codes</a> 

## Email templates
Create a directory in `serverMiddleware/templates/email/qq/`.

Populate this directory with translations of every file from one of the other
locale-specific template directories.

## String table
Create a file named `shared/messages/qq_messages.js` (copy another one of the locale files)

Provide translations for all of the string messages.

## Update the Nuxt locales list
Edit `nuxt.config.js` and add your locale to the `publicRuntimeConfig.locales` array.

## Help the community!
Commit your changes and submit a pull request on GitHub to help everyone else out!
