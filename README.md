# guest-website-backend-nodejs-REST-API

### Contents

-   [Features](#features)
-   [Tech used](#tech-used)
-   [How to get the project](#how-to-get-the-project)
-   [Run the project using docker](#run-the-project-using-docker)
-   [API endpoints](#api-endpoints)

## Features:

-   users can create their profiles (token-based authentication)
-   users can edit their profile
-   user can write comments.
-   user can view other's comments.
-   user can use forget password feature
-   admin can delete other's comments
-   admin cab ban or delete other users

## Tech used:

**Runtime environment**

-   [x] Node.js

**Database**

-   [x] MongoDB

**Web framework**

-   [x] Express.js

**Language**

-   [x] Typescript

## How to get the project:

#### Using Git (recommended)

1. Navigate & open CLI into the directory where you want to put this project & Clone this project using this command.

```bash
git clone https://github.com/Adedhoney/guest_website
```

#### Using manual download ZIP

1. Download repository
2. Extract the zip file, navigate into it & copy the folder to your desired directory
3. use npm install to download all dependencies

## Setting up environments

1. There is a file named `.env.example` on the root directory of the project
2. Create a new file by copying & pasting the file on the root directory & rename it to just `.env`
3. The `.env` file is already ignored, so your credentials inside it won't be committed
4. Change the values of the file. Make changes of comment to the `.env.example` file while adding new constants to the `.env` file.

## Run the project

1. To run build

    ```bash
    npm run build <!-- from the root folder  -->
    ```

2. start

    ```bash
    npm start
    ```

To get a detailed view of the endpoints, go to this [postman]

## API endpoints:

#### _Indication_

-   [x] **Authentication required**
-   [ ] **Authentication not required**

### User related

-   [ ] Register: `POST localhost:3000/api/account/signup`
-   [] Login: `POST localhost:3000/api/account/login`
-   [x] Edit user profile: `POST localhost:3000/api/account/update-info`
-   [x] UpdatePassword: `POST localhost:3000/api/account/update-password`
-   [x] Get loggedin user's info: `GET localhost:3000/api/account`
-   [x] Delete loggedin user: `DELETE localhost:3000/api/account`
-   [ ] Forget password: `POST localhost:3000/api/account/forgot-password/:email`
-   [ ] Verify otp: `POST localhost:3000/api/account/verify-otp`
-   [ ] Reset password: `POST localhost:3000/api/account/reset-password`

### Admin related

-   [x] Delete User: `DELETE localhost:3000/api/admin/account/delete/:userId`
-   [x] Ban User: `POST localhost:3000/api/admin/account/ban/:userId`
-   [x] Delete Post: `DELETE localhost:3000/api/admin/post/delete/:postId`

### Admin related

-   [ ] Post comment: `POST localhost:3000/api/post`
-   [ ] Get post comment: `POST localhost:3000/api/post/:postId`
-   [ ] Get many post comment: `POST localhost:3000/api/post`
-   [x] Delete post comment: `DELETE localhost:3000/api/post/:postId`
