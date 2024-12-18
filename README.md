# Roomies app

# https://roomies-frontend-fpzi.onrender.com

## What it is about

Roomies App is a business-focused booking system designed to streamline the reservation process for shared resources like meeting rooms. Easily view room availability, book time slots, manage your bookings, and receive important messages about scheduling and room updates. Administrators have additional control to manage users, rooms, and system settings.

### App functional description

**User:** Regular users can view room availability, read messages, book rooms, and manage their own bookings.
**Admin:** Administrators have full access, including managing all bookings, messages, users, rooms, and system settings.
**Visitor:** A visitor has no access to any functionality until they sign up and sign in. They would typically only see the main landing page with general information.
**Disabled admin/user:** Have no access to the app as visitor. Only another active admin can reinstate their access.

|Functional   | User  | Admin          |
|-------------|-------|----------------|
| View room availability                                   | ✓ | ✓ |
| Read messages                                            | ✓ | ✓ |
| Book rooms                                               | ✓ | ✓ |
| Manage own bookings (edit/delete)                        | ✓ | ✓ |
| Manage all bookings (edit/delete)                        |   | ✓ |
| Manage messages (add/edit/delete)                        |   | ✓ |
| Manage users (edit/delete/disable)                       |   | ✓ |
| Manage rooms (add/edit/delete/disable)                   |   | ✓ |
| Set weekday availability/hours (edit/restore)            |   | ✓ |
| Set holidays availability/hours (add/delete)             |   | ✓ |
| Set individual room date availability/hours (add/delete) |   | ✓ |

## Recommendations to start using

1. Go [here](https://roomies-frontend-fpzi.onrender.com/signup) and create your own account with any `email` and `password`
2. Sign up [here](https://roomies-frontend-fpzi.onrender.com/signin) with created credentials
3. Play with functionality **as user**:
    - see your own account data by clicking on `human icon` with your name in top right corner
    - view [room availability](https://roomies-frontend-fpzi.onrender.com/rooms) by clicking desired room
    - read [messages](https://roomies-frontend-fpzi.onrender.com/notifications)
    - book [room](https://roomies-frontend-fpzi.onrender.com/bookings)
    - edit or delete own bookings, but save one of them for the next actions as admin (try drag and drop, resize or just click on created booking to manage it)
4. Sign out from app and sign in as admin (you can ask access from me)
5. Now **as admin** you can:
    - create, edit and delete [messages](https://roomies-frontend-fpzi.onrender.com/notifications) for all users
    - edit, delete or disable current [users](https://roomies-frontend-fpzi.onrender.com/users)
    - [add new room](https://roomies-frontend-fpzi.onrender.com/rooms), [edit and delete](https://roomies-frontend-fpzi.onrender.com/rooms/100) existing room
    - set settings for **all rooms**:
      - change availability hours for **[desired weekday](https://roomies-frontend-fpzi.onrender.com/settings/weekdays/1)** or restore default settings
      - change the same settings for **[all weekdays](https://roomies-frontend-fpzi.onrender.com/settings/weekdays)** in a week or restore default settings
      - add [holidays schedule](https://roomies-frontend-fpzi.onrender.com/settings/dates) (availability for desired day and working hours), these setting override weekday settings
    - set settings for **[desired room](https://roomies-frontend-fpzi.onrender.com/rooms/100/dates)** on desired day, this settings override settings for weekdays and holidays
    - book rooms and edit or delete others' [bookings](https://roomies-frontend-fpzi.onrender.com/bookings)

## Some technical aspects which is good to know

1. Backend:
    - deployed separately from frontend on render.com as node service
    - database separately deployed in Docker container as PostgreSQL
    - in GitHub actions backend has own pipeline, which lints code and triggers building process on render.com
    - Jest is responsible for endpoint/API tests, for this purpose I use separate database locally, because on render.com I can use only one database for free and I prefer it for production. Settings for Jest database can be found in `docker-compose.test.yml` in root folder of the project.
2. Frontend:
    - deployed separately from backend on render.com as static site
    - in GitHub actions frontend has own pipeline, which lints code and triggers building process on render.com
    - Playwright is responsible for end to end test. As in backend here I use separate database for development purpose and for e2e tests, settings can be found in `docker-compose.yml`. Because of limitations on render.com I use e2e tests locally.

## Timeline of the project Roomies

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
|31.10|7|add new functional to the calendar view: drag and drop events, resize events, color style for unavailable hours, fetch bookings when navigate through the dates, add links from column to room page|
|02.11|6|for the calendar view, a new function added: users can change only their own events, and they can see their events in a different color compared to events not owned by them|
|03.11|6|add xmark for all pop ups and forms, add fontawesome, format date in table in one format, improve tables visibility for narrow screens|
|07.11|7|refactor menu component, install react-loader-spinner and add spinner functionality|
|08.11|8|refactor reducers, add spinner to each component, add sidebar and make it responsive|
|09.11|4|add description and icons, remove redundant code|
|15.11|5|analyze backend and frontend code, remove redundant and commented code, add eslint sort import and implement it, adopt backend tests to optimized code|
|24.11|6|install playwright for testing frontend, add signin test, signup test, delete user test, make booking test|
|01.12|4|add playwright tests for creating, changing, deleting messages, bookings and users|
|08.12|9|deploy separately frontend (as static site), backend (as node service), postgres database (in Docker container) on render.com and connect them between each other. Change logic to be able to work in development mode locally (backend and frontend) and be able to deploy code for production when it is necessary. Add pipeline on GitHub actions - one for frontend and another for backend, add lint to both pipelines, check functionality. Project done.|
|Total hours|280|backend: ~197 hours and frontend: ~83 hours|

1 hour === 60 minutes