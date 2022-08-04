<template>
  <div>
    Welcome to {{ $config.title }}
    <div>
      <ListObjects/>
    </div>
  </div>
</template>

<script>
const c = require('~/util/shared')

export default {
  name: 'IndexPage',
  created () {
    console.log(`NUXT = ${JSON.stringify(c.NUXT, null, 2)}`)
  }
}
</script>
