import { createVuetify } from 'vuetify'
import 'vuetify/styles' // pre-build css styles
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { mdi, aliases as allAliases } from 'vuetify/iconsets/mdi-svg';
const aliases = allAliases;

export default defineNuxtPlugin(nuxtApp => {
    const vuetify = createVuetify({
        ssr: true,
        components,
        directives,
        icons: {
            defaultSet: 'mdi',
            aliases,
            sets: { mdi }
        }
    })

    nuxtApp.vueApp.use(vuetify)
})
