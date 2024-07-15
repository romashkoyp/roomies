const { rollbackMigration } = require('./db')

const rollbackAndExit = async () => {
  try {
    await rollbackMigration()
    console.log('All migrations rolled back. Delete migrations table manually if necessary using DROP TABLE migrations;')
    process.exit(0) //success
  } catch (error) {
    console.error('Rollback failed:', error)
    process.exit(1) //error
  }
}

rollbackAndExit()