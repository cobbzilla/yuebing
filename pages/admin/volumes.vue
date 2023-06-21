<template>
  <v-container>
    <OrmAdmin
      :type-def="typeDef"
      :type-name-message="'admin_label_volume'"
      :type-admin-message="`admin_title_${typeDef.typeName}_administration`"
      :label-prefixes="['admin_label_volume_', 'label_volumeType_', 'label_']"
      :object-list="volumeList"
      :total-object-count="totalVolumeCount"
      :add-object-object="newVolume"
      :add-object-success="addVolumeSuccess || {}"
      :add-object-error="addVolumeError || {}"
      :edit-object-success="editVolumeSuccess || {}"
      :edit-object-error="editVolumeError || {}"
      :object-submitted="newVolumeSubmitted"
      :can-delete="vol => !selfVolume(vol)"
      :read-only-object="vol => selfVolume(vol)"
      :can-edit="() => true"
      :delete-object-message="'admin_button_delete_volume'"
      :delete-object-success="deleteVolumeSuccess || {}"
      :delete-object-error="deleteVolumeError || {}"
      :delete-confirmation-message="'admin_label_confirm_volume_delete'"
      :object-operation-in-progress="volumeOperationRunning"
      :action-configs="{
        browse: {
          when: v => v.readOnly,
          path: '/admin/browse',
          message: 'admin_button_browse_volume'
        }
      }"
      @query="onQuery"
      @newObjectUpdate="onNewObjectUpdate"
      @newObjectSubmit="onNewObjectSubmit"
      @editObjectSubmit="onEditObjectSubmit"
      @deleteObject="onDeleteObject"
    />
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import OrmAdmin from '@/components/orm/OrmAdmin'
import { isSelfVolume, publicConfigField, deepUpdate } from '@/shared'
import { localeMessagesForUser } from '@/shared/locale'
import { VOLUME_TYPEDEF, setCryptoConfig } from '@/shared/type/volumeType'

export default {
  name: 'ManageVolumes',
  components: { OrmAdmin },
  data () {
    return {
      typeDef: VOLUME_TYPEDEF,
      volumeOperationRunning: false,
      newVolume: VOLUME_TYPEDEF.newFullInstance(),
      newVolumeSubmitted: false
    }
  },
  computed: {
    ...mapState(['publicConfig', 'browserLocale']),
    ...mapState('user', ['user']),
    ...mapState('admin', [
      'volumeList', 'totalVolumeCount', 'findingVolumes',
      'addVolumeSuccess', 'addVolumeError',
      'editVolumeSuccess', 'editVolumeError',
      'deleteVolumeSuccess', 'deleteVolumeError'
    ]),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    title () { return publicConfigField(this, 'title') }
  },
  watch: {
    publicConfig (newConfig) {
      setCryptoConfig(newConfig)
    },
    addVolumeSuccess (success) {
      console.log(`volumes: addVolumeSuccess received: ${JSON.stringify(success)}`)
      if (success) {
        Object.assign(this.newVolume, VOLUME_TYPEDEF.newFullInstance())
      }
    }
  },
  created () {
    this.loadPublicConfig()
  },
  methods: {
    ...mapActions(['loadPublicConfig']),
    ...mapActions('admin', ['findVolumes', 'addVolume', 'editVolume', 'deleteVolume']),
    onQuery (query) {
      if (query) {
        this.findVolumes({ query })
      }
    },
    onNewObjectUpdate (update) {
      console.log(`onNewObjectUpdate received: ${JSON.stringify(update)}`)
      if (update.field && typeof (update.value) !== 'undefined') {
        console.log(`onNewObjectUpdate APPLYING: ${JSON.stringify(update)}`)
        deepUpdate(this.newVolume, update.field, update.value)
      }
    },
    onNewObjectSubmit () {
      const volume = this.newVolume
      this.addVolume({ volume })
    },
    onEditObjectSubmit (volume) {
      this.editVolume({ volume })
    },
    onDeleteObject (obj) {
      const volume = obj.name
      if (!volume) {
        return
      }
      this.deleteVolume({ volume })
    },
    selfVolume (volume) { return isSelfVolume(volume) }
  }
}
</script>
