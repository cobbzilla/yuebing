
const USER_SORT = {
  email: (u1, u2) => u1.email && u2.email && u1.email < u2.email,
  firstName: (u1, u2) => u1.firstName && u2.firstName && u1.firstName < u2.firstName,
  lastName: (u1, u2) => u1.lastName && u2.lastName && u1.lastName < u2.lastName,
  locale: (u1, u2) => u1.locale && u2.locale && u1.locale < u2.locale,
  ctime: (u1, u2) => u1.ctime && u2.ctime && u1.ctime < u2.ctime,
  mtime: (u1, u2) => u1.mtime && u2.mtime && u1.mtime < u2.mtime
}

function userSortFields () { return Object.keys(USER_SORT) }

function sortByField (array, field, ascending) {
  return ascending ? array.sort(USER_SORT[field]) : array.sort(USER_SORT[field]).reverse()
}

export { userSortFields, sortByField }
