## https://auth-api-4lok.onrender.com/user (get)
{
    "message": "Success",
    "data": {
        "home": "/home   (page for every logged in user)",
        "Admin Page": "/dashboard    (page for admin)",
        "SignUp": "/signup  (send email,password and role in post request)",
        "Login": "/login   (send email,password in post request)",
        "Get Information of User": "/getinfo  (need token for validation in get request)",
        "For send otp for emailVarification": "/emailvarification  (need token for validation in post request)",
        "Varify Otp": "/varifyemail  (need token for validation and otp in post request)",
        "Password Reset Otp": "/passwordresetreq   (Send email in post request)",
        "Varify Password Reset Otp": "/validateotp   (Send otp and email in post)",
        "Reset Password": "/updatepassword (send email and new password in post request)"
    }
}
## signup
https://auth-api-4lok.onrender.com/user/signup (post)
{
    "message": "Success",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzQ3NGM3MmE2NTdjNDZkNWQ1MjllMDUiLCJlbWFpbCI6InNkZmdoajIzZGZnIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzI3MjU4NzV9.0ebqGz79ear57UXY0FU_-z8N6rS7UWRQfc0CHXy1TIc",
        "id": "67474c72a657c46d5d529e05",
        "role": "user"
    }
}
## log in
https://auth-api-4lok.onrender.com/user/login (post)
{
    "message": "Success",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzQ3NGM3MmE2NTdjNDZkNWQ1MjllMDUiLCJlbWFpbCI6InNkZmdoajIzZGZnIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzI3MjU5MDh9.5BGtFm3jWdl-adIyymDCEc_3LsKBVNl2AThJuLDOAwU",
        "user": {
            "_id": "67474c72a657c46d5d529e05",
            "email": "sdfghj23dfg",
            "name": "",
            "password": "$2b$10$AExulAvN6L/k9LKM7opEruEvfy5z8IU2bMmZBI0nTTBp1SkUs/ZOa",
            "role": "user",
            "createdAt": "2024-11-27T16:44:35.029Z",
            "updatedAt": "2024-11-27T16:44:35.029Z",
            "__v": 0
        }
    }
}

##Home
https://auth-api-4lok.onrender.com/user/home (get) //Every login email can access this page
{
    "message": "This is user interface and may have limited permissions."
}
## admin access
https://auth-api-4lok.onrender.com/user/dashboard (get) (only admin mail id login has this access)
{
    "message": "This is Admin dashboard and have restricted."
}
