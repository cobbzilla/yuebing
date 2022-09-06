<template>
  <v-container>
    <v-row>
      <ListObjects/>
    </v-row>
  </v-container>
</template>

<script>
import ListObjects from '@/components/ListObjects'

export default {
  name: 'IndexPage',
  components: { ListObjects }
}
</script>
