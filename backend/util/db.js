const Sequelize = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')
const path = require('path')
const { DATABASE_URL, PROD, DEV } = require('./config')

console.log('Resolving database connection in db.js. PROD:', PROD, 'DATABASE_URL defined:', !!DATABASE_URL)

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is undefined! Please verify your Vercel database integration or environment variables.')
}

const sequelize = PROD === true
  ? new Sequelize(DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  : new Sequelize(DATABASE_URL)

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    if (PROD === true || DEV === true) {
      await ensureSchema()
    }
    console.log('Connected to the database successfully')
  } catch (err) {
    console.log('Unable to connect to the database', err)
    return process.exit(1)
  }

  return null
}

const migrationConf = {
  migrations: {
    glob: path.join(__dirname, '../migrations/*.js').replace(/\\/g, '/'),
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

const ensureSchema = async () => {
  const requiredTables = [
    'users',
    'notifications',
    'rooms',
    'global_weekdays',
    'individual_dates',
    'global_dates',
    'bookings',
    'sessions'
  ]

  const tables = await sequelize.getQueryInterface().showAllTables()
  const existingTables = new Set(tables.map((table) => (typeof table === 'string' ? table : table.tableName)))
  const missingTables = requiredTables.filter((table) => !existingTables.has(table))

  if (missingTables.length > 0) {
    console.warn('Missing tables detected after migrations, repairing schema', {
      missingTables,
    })
    await sequelize.sync()
  }
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