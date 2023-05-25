const uuid = require('uuid')

module.exports = {
  name: "MediaItem",
  columns: {
    uuid: {
      primary: true,
      type: 'varchar',
      options: {
        length: 36,
        default: () => uuid.v4()
      }
    },
    title: {
      type: 'varchar',
      options: { length: 500, nullable: false }
    },
    ctime: {
      type: 'integer', options: { nullable: false }
    },
    mtime: {
      type: 'integer', options: { nullable: false }
    }
  },
  relations: {
    // categories: {
    //   target: "Category",
    //   type: "many-to-many",
    //   joinTable: true,
    //   cascade: true
    // }
  }
}
