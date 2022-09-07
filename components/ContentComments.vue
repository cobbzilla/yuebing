<template>
  <v-container>
    <v-row v-if="comments && comments.length > 0">
      <v-col>
        <h4>{{ messages.label_header_comments }}</h4>
      </v-col>
    </v-row>
    <v-row v-else-if="loggedIn">
      <v-col>
        <h4>{{ messages.label_header_no_comments }}</h4>
      </v-col>
    </v-row>
    <v-row v-for="(comment, index) in comments" :key="index">
      <v-col>
        <v-container>
          <v-row dense>
            <v-col>
              <v-card
                :min-height="40"
                :min-width="400"
                :max-height="100"
                :max-width="700"
              >
                <v-card-title class="commentTitle">
                  <v-container>
                    <v-row dense>
                      <v-col>
                        <span v-if="comment.avatar">
                          <v-avatar size="48px">
                            <v-img :src="comment.avatar" contain :alt="`avatar image for ${comment.author}`" />
                          </v-avatar>
                        </span>
                        <span v-else>
                          <v-btn icon>
                            <v-icon>mdi-account</v-icon>
                          </v-btn>
                        </span>
                        <span>
                          <b>{{ comment.author }}</b>
                        </span>
                      </v-col>
                      <v-col>
                        <div>
                          <small>{{ messages.label_date_and_time_short.parseDateMessage(comment.ctime, messages) }}</small>
                          <div v-if="comment.mtime">
                            <small><em><b>{{ messages.label_comment_modified }}</b> {{ messages.label_date_and_time_short.parseDateMessage(comment.mtime, messages) }}</em></small>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-title>
              </v-card>
              <v-card-text>
                <v-container>
                  <v-row dense>
                    <v-col>
                      <div v-if="removeCommentError" class="error">
                        {{ removeCommentError }}
                      </div>
                      <div v-if="selectedCommentId === comment.id">
                        <div v-if="editCommentError" class="error">
                          {{ editCommentError }}
                        </div>
                        <v-textarea
                          v-model="editCommentText"
                          :label="messages.label_comment"
                          type="text"
                          name="editCommentText"
                          class="form-control"
                        />
                        <v-btn @click.stop="doEditComment">
                          {{ messages.button_update_comment }}
                        </v-btn>
                      </div>
                      <div v-else>
                        <v-container>
                          <v-row dense>
                            <v-col @click.stop="toggleEditComment(comment)">
                              {{ comment.comment }}
                            </v-col>
                          </v-row>
                        </v-container>
                      </div>
                    </v-col>
                    <v-col>
                      <div v-if="user && user.username && (user.username === comment.author || user.admin)">
                        <v-btn icon @click.stop="toggleEditComment(comment)">
                          <v-icon v-if="!selectedCommentId">
                            mdi-pencil
                          </v-icon>
                          <v-icon v-else>
                            mdi-close
                          </v-icon>
                        </v-btn>
                        <v-btn icon @click.stop="doRemoveComment(comment.id)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <v-row v-if="loggedIn && !addingComment" dense>
      <v-col>
        <div v-if="newCommentError" class="error">
          {{ newCommentError }}
        </div>
        <v-textarea
          v-model="newCommentText"
          :label="messages.label_comment"
          type="text"
          name="newCommentText"
          class="form-control"
        />
        <v-btn @click.stop="doAddComment">
          {{ messages.button_add_comment }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapActions, mapState } from 'vuex'
import { localeMessagesForUser } from '@/shared/locale'

export default {
  name: 'ContentComments',
  props: {
    object: { type: Object, default: null }
  },
  data () {
    return {
      newCommentText: '',
      editCommentText: null,
      selectedCommentId: null
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus', 'anonLocale']),
    ...mapState(['browserLocale']),
    ...mapState('comments', [
      'fetchingComments', 'comments', 'commentsError',
      'addingComment', 'newCommentError', 'newComment',
      'editingComment', 'editCommentError', 'editedComment',
      'removingComment', 'removeCommentError', 'removedComment'
    ]),
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) },
    loggedIn () { return this.user && this.userStatus && this.user.email },
    objectPath () { return this.object.path || this.object.name || null }
  },
  watch: {
    object (newObject) {
      if (newObject && (newObject.path || newObject.name)) {
        this.findCommentsForPath({ path: newObject.path || newObject.name })
      }
    },
    newComment (comment) {
      if (comment) { this.findCommentsForPath({ path: this.objectPath }) }
    },
    editedComment (comment) {
      if (comment) {
        this.selectedCommentId = null
        this.editCommentText = ''
        this.findCommentsForPath({ path: this.objectPath })
      }
    },
    removedComment (comment) {
      if (comment) { this.findCommentsForPath({ path: this.objectPath }) }
    }
  },
  created () {
    if (this.object && this.objectPath) {
      this.findCommentsForPath({ path: this.objectPath })
    }
  },
  methods: {
    ...mapActions('comments', [
      'findCommentsForPath', 'createComment', 'editComment', 'removeComment'
    ]),
    doAddComment () {
      const path = this.objectPath
      const comment = this.newCommentText
      this.createComment({ path, comment })
      this.newCommentText = ''
    },
    doEditComment () {
      if (this.selectedCommentId) {
        const path = this.objectPath
        const commentId = this.selectedCommentId
        const comment = this.editCommentText
        const messages = this.messages
        this.editComment({ path, commentId, comment, messages })
        this.selectedCommentId = null
      }
    },
    toggleEditComment (comment) {
      if (this.selectedCommentId === comment.id) {
        this.selectedCommentId = null
        this.editCommentText = ''
      } else {
        this.selectedCommentId = comment.id
        this.editCommentText = comment.comment
      }
    },
    doRemoveComment (commentId) {
      if (commentId) {
        const path = this.objectPath
        const messages = this.messages
        this.removeComment({ path, commentId, messages })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.commentTitle {
  height: 60px;
  margin-top: 20px;
}
</style>
