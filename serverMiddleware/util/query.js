const MAX_SEARCH_TERMS_LENGTH = 200
const DEFAULT_PAGE_SIZE = 20

function normalizeSearchTerms (terms) {
  if (terms) {
    if (typeof terms !== 'string') {
      return ''
    } else {
      while (terms.length > MAX_SEARCH_TERMS_LENGTH) {
        // chop words off the end until it's short enough
        const lastSpace = terms.lastIndexOf(' ')
        terms = lastSpace === -1 ? '' : terms.substring(0, lastSpace)
      }
      return terms
    }
  }
}

function search (list, query, termsMatcher, sortFunction) {
  const searchTerms = normalizeSearchTerms(query.searchTerms)
  const filtered = (searchTerms && searchTerms.trim().length > 0)
    ? list.filter(obj => termsMatcher(obj, query.searchTerms))
    : list

  if (query.sort) {
    const ascending = !query.sort.order.toLowerCase().startsWith('des')
    sortFunction(filtered, query.sort.field, ascending)
  }

  const pageNumber = query.pageNumber || 1
  const pageSize = query.pageSize || DEFAULT_PAGE_SIZE
  const rawStart = (pageNumber - 1) * pageSize
  const startIndex = (filtered.length >= rawStart) ? rawStart : Math.max(filtered.length - pageSize, 0)
  const endIndex = (startIndex + pageSize < filtered.length) ? startIndex + pageSize : filtered.length

  return {
    list: filtered.slice(startIndex, endIndex),
    total: list.length
  }
}

export { search }
