import { commentService } from '@/services/commentService'

export const state = () => ({
  fetchingComments: false,
  comments: null,
  commentsError: null,

  addingComment: false,
  newCommentError: null,
  newComment: null,

  editingComment: false,
  editCommentError: null,
  editedComment: null,

  removingComment: false,
  removeCommentError: null,
  removedComment: null
})

export const actions = {
  findCommentsForPath ({ commit }, { path }) {
    console.log(`findCommentsForPath - finding for path: ${path}`)
    commit('findCommentsForPathRequest')
    commentService.fetchCommentsForPath(path)
      .then(
        (comments) => {
          commit('findCommentsForPathSuccess', { comments })
        },
        (error) => {
          commit('findCommentsForPathFailure', { error })
        }
      )
  },
  createComment ({ commit }, { path, comment }) {
    commit('createCommentRequest')
    commentService.createComment(path, comment)
      .then(
        (comments) => {
          commit('createCommentSuccess', { comments })
        },
        (error) => {
          commit('createCommentFailure', { error })
        }
      )
  },
  editComment ({ commit }, { path, commentId, comment }) {
    commit('editCommentRequest')
    commentService.editComment(path, commentId, comment)
      .then(
        (updatedComment) => {
          commit('editCommentSuccess', { updatedComment })
        },
        (error) => {
          commit('editCommentFailure', { error })
        }
      )
  },
  removeComment ({ commit }, { path, comment }) {
    commit('removeCommentRequest')
    commentService.removeComment(path, comment)
      .then(
        (removed) => {
          commit('removeCommentSuccess', { removed })
        },
        (error) => {
          commit('removeCommentFailure', { error })
        }
      )
  }
}

export const mutations = {
  findCommentsForPathRequest (state) {
    state.fetchingComments = true
  },
  findCommentsForPathSuccess (state, { comments }) {
    state.fetchingComments = false
    state.commentsError = null
    state.comments = comments
  },
  findCommentsForPathFailure (state, { error }) {
    state.fetchingComments = false
    state.commentsError = error
  },

  createCommentRequest (state) {
    state.addingComment = true
  },
  createCommentSuccess (state, { comment }) {
    state.addingComment = false
    state.newCommentError = null
    state.newComment = comment
  },
  createCommentFailure (state, { error }) {
    state.addingComment = false
    state.newCommentError = error
  },

  editCommentRequest (state) {
    state.editingComment = true
  },
  editCommentSuccess (state, { updatedComment }) {
    state.editingComment = false
    state.editCommentError = null
    state.editedComment = updatedComment
  },
  editCommentFailure (state, { error }) {
    state.editingComment = false
    state.editCommentError = error
  },

  removeCommentRequest (state) {
    state.removingComment = true
  },
  removeCommentSuccess (state, { removed }) {
    state.removingComment = false
    state.removeCommentError = null
    state.removedComment = removed
  },
  removeCommentFailure (state, { error }) {
    state.removingComment = false
    state.removeCommentError = error
  }
}
