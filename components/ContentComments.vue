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
          <v-row>
            <v-col>
              <v-card
                :min-height="40"
                :min-width="400"
                :max-height="300"
                :max-width="700"
              >
                <v-card-title>
                  <v-container>
                    <v-row>
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
                  <v-row>
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
                          <v-row>
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
    <v-row v-if="loggedIn">
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
    loggedIn () { return this.user && this.userStatus && this.user.email }
  },
  watch: {
    object (newObject) {
      console.log(`watch.object - received new object: ${JSON.stringify(newObject)}`)
      if (newObject && newObject.path) {
        this.findCommentsForPath({ path: newObject.path })
      }
    },
    newComment (comment) {
      if (comment) { this.findCommentsForPath({ path: this.object.path }) }
    },
    editedComment (comment) {
      if (comment) {
        this.selectedCommentId = null
        this.editCommentText = ''
        this.findCommentsForPath({ path: this.object.path })
      }
    },
    removedComment (comment) {
      if (comment) { this.findCommentsForPath({ path: this.object.path }) }
    }
  },
  created () {
    if (this.object && this.object.path) {
      this.findCommentsForPath({ path: this.object.path })
    }
  },
  methods: {
    ...mapActions('comments', [
      'findCommentsForPath', 'createComment', 'editComment', 'removeComment'
    ]),
    doAddComment () {
      const path = this.object.path
      const comment = this.newCommentText
      this.createComment({ path, comment })
    },
    doEditComment () {
      if (this.selectedCommentId) {
        const path = this.object.path
        const commentId = this.selectedCommentId
        const comment = this.editCommentText
        this.editComment({ path, commentId, comment, messages: this.messages })
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
        const path = this.object.path
        this.removeComment({ path, commentId })
      }
    }
  }
}
</script>
