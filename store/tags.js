import { tagService } from '@/services/tagService'

export const state = () => ({
  tags: {},
  fetchingTags: {},
  fetchTagsError: {},

  addingTags: {},
  addTagsSuccess: {},
  addTagsError: {},

  removingTags: {},
  removeTagsSuccess: {},
  removeTagsError: {}
})

export const actions = {
  fetchTags ({ commit }, { sourceAndPath }) {
    commit('fetchTagsRequest', { sourceAndPath })
    tagService.fetchTags(sourceAndPath)
      .then(
        (tags) => { commit('fetchTagsSuccess', { sourceAndPath, tags }) },
        (error) => { commit('fetchTagsFailure', { sourceAndPath, error }) }
      )
  },

  addTags ({ commit }, { sourceAndPath, tags }) {
    commit('addTagsRequest', { sourceAndPath })
    tagService.addTags(sourceAndPath, tags)
      .then(
        (tags) => { commit('addTagsSuccess', { sourceAndPath, tags }) },
        (error) => { commit('addTagsFailure', { sourceAndPath, error }) }
      )
  },

  removeTags ({ commit }, { sourceAndPath, tags }) {
    commit('removeTagsRequest', { sourceAndPath })
    tagService.removeTags(sourceAndPath, tags)
      .then(
        (tags) => { commit('removeTagsSuccess', { sourceAndPath, tags }) },
        (error) => { commit('removeTagsFailure', { sourceAndPath, error }) }
      )
  }
}

export const mutations = {
  fetchTagsRequest (state, { sourceAndPath }) {
    const update = {}
    update[sourceAndPath] = true
    state.fetchingTags = Object.assign({}, state.fetchingTags, update)
  },
  fetchTagsSuccess (state, { sourceAndPath, tags }) {
    let update = {}
    update[sourceAndPath] = false
    state.fetchingTags = Object.assign({}, state.fetchingTags, update)
    update = {}
    update[sourceAndPath] = tags
    state.tags = Object.assign({}, state.tags, update)
    update = {}
    update[sourceAndPath] = null
    state.fetchTagsError = Object.assign({}, state.fetchTagsError, update)
  },
  fetchTagsFailure (state, { sourceAndPath, error }) {
    let update = {}
    update[sourceAndPath] = false
    state.fetchingTags = Object.assign({}, state.fetchingTags, update)
    update = {}
    update[sourceAndPath] = error
    state.fetchTagsError = Object.assign({}, state.fetchTagsError, update)
  },

  addTagsRequest (state, { sourceAndPath }) {
    const update = {}
    update[sourceAndPath] = true
    state.addingTags = Object.assign({}, state.addingTags, update)
  },
  addTagsSuccess (state, { sourceAndPath, tags }) {
    const update = {}
    update[sourceAndPath] = false
    state.addingTags = Object.assign({}, state.addingTags, update)
    update[sourceAndPath] = tags
    if (state.tags[sourceAndPath]) {
      state.tags = Object.assign({}, state.tags, update)
    }
    state.addTagsSuccess = Object.assign({}, state.addTagsSuccess, update)
  },
  addTagsFailure (state, { sourceAndPath, error }) {
    const update = {}
    update[sourceAndPath] = false
    state.addingTags = Object.assign({}, state.addingTags, update)
    update[sourceAndPath] = error
    state.addTagsError = Object.assign({}, state.addTagsError, update)
  },

  removeTagsRequest (state, { sourceAndPath }) {
    const update = {}
    update[sourceAndPath] = true
    state.removingTags = Object.assign({}, state.removingTags, update)
  },
  removeTagsSuccess (state, { sourceAndPath, tags }) {
    const update = {}
    update[sourceAndPath] = false
    state.removingTags = Object.assign({}, state.removingTags, update)
    update[sourceAndPath] = tags
    state.removeTagsSuccess = Object.assign({}, state.removeTagsSuccess, update)
    if (state.tags[sourceAndPath]) {
      update[sourceAndPath] = tags
      state.tags = Object.assign({}, state.tags, update)
    }
  },
  removeTagsFailure (state, { sourceAndPath, error }) {
    const update = {}
    update[sourceAndPath] = false
    state.removingTags = Object.assign({}, state.removingTags, update)
    update[sourceAndPath] = error
    state.removeTagsError = Object.assign({}, state.removeTagsError, update)
  }

}
