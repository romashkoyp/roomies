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
|19.07|8|48 tests, refactoring code (move seeding admin from migration to index.js in root to avoid problems with test environment), add condition to seed admin only in dev and prod mode, resolving issues with seeding IDs|
|22.07|6|add sign out route, add session control, adjust existing tests and add 8 new tests (56 in total)|
|05.08|7|choose better solution for storage images, read Cloudinary documentation, implement creating room by admin and upload image of the room from root, add API endpoints for rooms (CRUD), test with REST, add 23 tests for room API endpoints|
|08.08|10|create POST and GET for booking API endpoints, test with REST, add new field 'time' for rooms and bookings, add time comparison for PUT rooms and POST bookings|
|09.08|6|add PUT api end point for booking, refactor rooms PUT api end point, test with REST|
|12.08|7|create new logic for storing global and individual settings for rooms, add 6 new tables to database, add PUT api end point for rooms/global/availability, test with REST, add settings creator|
|13.08|6|change basic logic for settings, refactoring code|
|14.08|7|continue refactoring code, add middleware, add 11 api end points for settings, test with REST|
|16.08|5|refactoring code, move authorization logic into middleware, update routes for users, test with REST, test users routes with Jest|
|21.08|7|refactoring code, add new functional to GET desired room in desired date with settings, the same for POST request for desired room in desired date, test with REST|
|22.08|6|rethinking room and booking controllers, refactoring code again, test result with REST|
|23.08|8|refactoring code, reorder routes in rooms controller to avoid triggering middleware, update current JEST tests (add new logic for seeding database using date-fns) and create new one for room routes (83 tests in total)|
|26.08|6|continue adding new JEST tests for room route and add 32 new JEST tests for settings route, refactoring code|
|27.08|5|add JEST tests for bookings routes, (150 tests in total), linting|
|29.08|7|add CORS for backend, choosing stack for frontend create basic Vite template frontend with redux, react-router-dom, axios, styled-component, refactor code, move URL to .env, change configuration for Vite, add successful sign in functional in frontend|
|30.08|4|add sign out button and functionality to frontend, add notification functional, get errors from backend to frontend for notifications, add sign up form and implement functional|
|02.09|4|refactoring code, move sign in functionality to it's own component, add main page route, move sign up functionality to it's own component, refactor menu component|
|04.09|6|add components as messageForm, Message, add messageReducer, add messageService, update Redux store, adjust view for admin, user and no user|
|06.09|6|add single message view with updating and deletion functional, add and change styles for elements (new ResizableTexterea component)|
|14.09|10|add functional in frontend for user CRUD, refactor code to use Redux for CRUD operations for user routes, it was really hard|
|19.09|5|add functional in frontend for room CRUD using Redux|
|20.09|8|refactor code, restructure files and folders, improve UI|
|26.09|7|add functional in frontend to fetch individual dates for rooms|
|27.09|8|finish with individual dates and start with settings (weekdays)|
|28.09|4|refactor reducer for messages and update components accordingly|
|04.10|9|add weekday single view, add all functional for weekdays, adjust components|
|11.10|10|refactor backend routes for bookings and rooms, add functional for fetching, create, update and delete bookings, add calendar view using React Big Calendar library|
|Total hours|218|