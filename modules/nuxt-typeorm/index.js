const { createConnection, EntitySchema } = require('typeorm')
const system = require('../../serverMiddleware/util/config').SYSTEM

const safeLibraryName = libraryName => libraryName.replaceAll(/[^A-Z\d.,_+@-]+/gi, '_')

const dbConfig = libraryName => {
  return {
    type: 'sqlite',
    database: `yuebing-${(safeLibraryName(libraryName))}.sqlite`,
    synchronize: true,
    logging: false,
    entities: [
      new EntitySchema(require('../../serverMiddleware/model/entity/MediaItem'))
    ],
    migrations: [],
    subscribers: []
  }
}

module.exports = async function (moduleOptions) {

  system.addLibrary = async libraryName => {
    if (!(libraryName in system.libraries)) {
      const config = await Object.assign({}, moduleOptions, dbConfig(libraryName))
      const connection = await createConnection(config)
      system.libraries[libraryName] = { config, connection }
    }
    return system.libraries[libraryName]
  }

  this.nuxt.hook("close", async () => {
    for (const libraryName of Object.keys(system.libraries)) {
      await system.libraries[libraryName].connection.destroy()
    }
  })
}
