# Ascendas User Data Server
NodeJs Server using Express framework deployed on heroku with MongoDB cloud cluster as data storage

## Setup
- Install all dependencies using `npm i`
- You will need Heroku CLI if you wish to deploy, please run `npm install -g heroku`
- You will need access to the .env file which contains all the environment variables, please contact author of this repo to get .env file


## Scripts
- Run `npm run dev` which starts nodemon to run the server locally and would refresh automattically everytime there is a code change
- Run `npm run deploy` to deploy to heroku

## Features
1) User Authentication (registration, login) using `passport`
2) User Authorisation and protected routes using `jsonwebtokens`
3) Refresh Tokens last **1d** while Access tokens last **10m**, refresh tokens are used to get access tokens (so as to prevent asking users to continously login to get access tokens). Access tokens are what's required to access protected routes. 
3) User data encrypted in AES and stored on MongoDB using `mongoose-encryption`
4) User passwords are hashed and salted using `bcrypt`

## Diagrams
Coming Soon

## Endpoints
- Server endpoint: https://ascendas-userdata-server.herokuapp.com/

| REQ    | Accessibility | Endpoint                         | Inputs                                                                                                                                                                                                                                | Returns                                                                                                                                                                           |
|--------|---------------|----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GET    | Public        | /api/users/auth/google           |                                                                                                                                                                                                                                       | Redirects page to google OAuth sign in page. Upon successful sign up, redirects to another server endpoint to receive a JWT and findOrCreate user in db. FEATURE WORK IN PROGRESS |
| GET    | Public        | /api/users/auth/google/callback  |                                                                                                                                                                                                                                       | Returns user to frontend web page, generates JWT access token given in JSON of body, JWT refresh token given in httpcookie. User is either found or created in DB                 |
| GET    | Public        | /api/users/token-refresh         | require req.cookie('jwt') to have refresh token                                                                                                                                                                                       | Returns JSON with new access token valid for 10m for user to access protected routes                                                                                              |
| POST   | Public        | /api/users/register              | req.body.username, req.body.password. This endpoint requires two key value pairs to be filled up in request. username is equivalent to email.                                                                                         | Returns a Json object with JWT Access token that expires in 10m, a JWT Refresh token is also embedded in a http only cookie                                                       |
| POST   | Public        | /api/users/login                 | req.body.username, req.body.password. This endpoint requires two key value pairs to be filled up in request. username is equivalent to email.                                                                                         | Returns a Json object with JWT Access token that expires in 10m, a JWT Refresh token is also embedded in a http only cookie                                                       |
| GET    | Private       | /api/bookings                    | requires req.header.Authorization to have a JWT Access Token to access user specific bookings                                                                                                                                         | JSON array of user bookings                                                                                                                                                       |
| POST   | Private       | /api/bookings                    | requires req.headers.Authorization to have a JWT Access Token to access user specific bookings. require req.body to have raw JSON of booking object. refer to code snippet below to see how booking object schema should be submitted | returns JSON of new booking                                                                                                                                                       |
| PUT    | Private       | /api/bookings/:booking_reference | requires req.params.booking_reference, specify which booking you would like to update. requires req.body to be filled with full JSON booking object. This endpoint replaces the entire booking object currently stored in DB.         | returns JSON of updated booking                                                                                                                                                   |
| DELETE | Private       | /api/bookings/:booking_reference | requires req.params.booking_reference, specify which booking you would like to update. eg. /api/bookings/1 will delete booking with booking reference 1                                                                               | returns successful deletion message in JSON format. Booking object is deleted from DB                                                                                             |





### Example Booking object 
Front End should pass to Backend with this Schema
```json
{
    "payee_information": {
        "payment_id": "123",
        "payee_id": "321"
    },
    "guest_information": {
        "salutation": "Mr",
        "first_name": "John",
        "last_name": "Doe"
    },
    "destination_id": "RsBU",
    "hotel_id": "diH7",
    "price": "1000 SGD",
    "supplier_booking_id": "1233",
    "booking_reference": "3",
    "supplier_booking_response": {
        "cost": "500 SGD",
        "down_stream_booking_reference": "1",
        "booking_terms_and_conditions": "https://google.com",
        "hotel_terms_and_conditions": "https:/yahoo.com"
    },
    "booking_display_information": {
        "number_of_nights": 3,
        "start_date": "2022-08-19",
        "end_date": "2022-08-22",
        "adults": 2,
        "children": 0,
        "message_to_hotel": "Need an extra bed",
        "room_types": [
            "double room",
            "queen sized bed",
            "no toilet"
        ]
    }
}
```