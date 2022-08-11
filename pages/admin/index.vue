<template>
  <div>
    <h2>Site Administration</h2>
    <NuxtLink to="/admin/queue">
      Transform Queue
    </NuxtLink>
    <hr/>
    <NuxtLink to="/admin/migrateUsers">
      Migrate users from previous encryption key
    </NuxtLink>
  </div>
</template>

<script>
export default {
  name: 'AdminIndex'
}
</script>
