Locale Resources
================
These are the string tables that define every message that appears in the web interface

# Adding support for new locales

## Define locale strings
Create a file in this directory, named after the locale, `ln_CT.js` where `ln` is the language and `CT` is the country.

## Define locale email templates
You will then *ALSO* need to create a directory in `serverMiddleware/templates/email/ln_CT/` and populate it
with translations of every file from one of the other locale-specific template directories.

## Update the Nuxt locales list
Edit `nuxt.config.js` and add your locale to the `publicRuntimeConfig.locales` array.

## Help the community!
Commit your changes and submit a pull request on GitHub to help everyone else out!
