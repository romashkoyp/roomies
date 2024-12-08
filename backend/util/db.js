const Sequelize = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')
const { DATABASE_URL, PROD } = require('./config')

let sequelize

if (PROD === true) {
  sequelize = new Sequelize(DATABASE_URL, {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
  })
} else {
  sequelize = new Sequelize(DATABASE_URL)
}

// // connection to local database
// const sequelize = new Sequelize(DATABASE_URL)

// // connection to render.com database
// const sequelize = new Sequelize(DATABASE_URL, {
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false
//     }
//   },
// })

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('Connected to the database successfully')
  } catch (err) {
    console.log('Unable to connect to the database', err)
    return process.exit(1)
  }

  return null
}

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down({ to: 0 })
}

module.exports = {
  connectToDatabase,
  sequelize,
  rollbackMigration
}