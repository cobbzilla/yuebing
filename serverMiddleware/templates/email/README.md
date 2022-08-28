Locale Resources
================
These are the email templates for all emails sent by Yuebing

# Adding support for new locales

## Define locale email templates
Create a directory in `serverMiddleware/templates/email/ln_CT/` named after the locale,
where `ln` is the language and `CT` is the country. Populate this directory with translations
of every file from one of the other locale-specific template directories.

## Define locale strings
You will then *ALSO* need to create a file named `shared/messages/ln_CT.js` (copy another one of the locale files),
and provide translations for all of those string messages.

## Update the Nuxt locales list
Edit `nuxt.config.js` and add your locale to the `publicRuntimeConfig.locales` array.

## Help the community!
Commit your changes and submit a pull request on GitHub to help everyone else out!
