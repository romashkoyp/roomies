### Timeline of the project Roomies
| Day         | Hours | What I did     |
|-------------|-------|----------------|
|10.07|5|plan project's structure, search modules for the frontend, init nodeJS project, connect it to PosgreSQL in Docker container, init migration for database, create first POST route for notifications and test it using REST|
|11.07|4|create routes for notifications and users GET, POST, DELETE, PUT, add errorHandler|
|12.07|3|add sign in, login routes, authorization|
|15.07|6|add rollback for the database, read docs of express-validator, implement express-validator for all routes with validation, add functional for modification and deletion users and notifications only by their owners, test with REST queries|
|16.07|6|add separate database for integration tests, add integration tests with Supertest and Jest (connection to DB and seed it), refactoring migration|
|17.07|6|continue establish environment for tests and set settings for containers, add admin role to code, add 4 tests for get api/users for different users' roles|
|18.07|6|add 13 tests: GET api/users (4), PUT api/users (6), DELETE api/users (3); during tests fix code and logic|
|19.07|4|add 1 test, refactoring code (move seeding admin from migration to index.js in root to avoid problems with test environment), add condition to seed admin only in dev and prod mode|