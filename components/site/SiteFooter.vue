<template>
  <v-container>
    <v-row>
      <!--      <v-col v-if="user && user.email && canEmail && inviteFriendsEnabled">-->
      <!--        <InviteFriends />-->
      <!--      </v-col>-->
      <!--      <v-spacer />-->
      <v-col v-if="messages.footer_credit">
        <!--eslint-disable vue/no-v-html-->
        <div
          style="font-size: xx-small; text-align: right; position: absolute; bottom: 40px"
          v-html="messages.footer_credit"
        />
        <!--eslint-enable vue/no-v-html-->
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useSessionStore } from "~/stores/session";

const messages = ref(storeToRefs(useSessionStore()).localeMessages);
</script>

<script>
// noinspection NpmUsedModulesInstalled
// import { mapState } from 'vuex'
// import { publicConfigField } from '@/shared'
// import { localeMessagesForUser } from '@/shared/locale'
// import InviteFriends from '@/components/site/InviteFriends.vue'
//
// // noinspection JSUnusedGlobalSymbols
// export default {
//   name: 'SiteFooter',
//   components: { InviteFriends },
//   computed: {
//     ...mapState('user', ['user', 'userStatus', 'anonLocale']),
//     ...mapState(['browserLocale', 'publicConfig']),
//     messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) },
//     canEmail () { return publicConfigField(this, 'emailEnabled') },
//     inviteFriendsEnabled () { return publicConfigField(this, 'inviteFriendsEnabled') }
//   }
// }
</script>
