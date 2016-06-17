Google Login inside Meteor (but for version 0.6)
================================================
based on Chris Mather's video Customizing Login, http://www.eventedmind.com/posts/meteor-customizing-login,
Sets up logins via Google's app api instead of GitHub (https://github.com/m2web/githublogin)

It's the result of the process for solving this question
http://stackoverflow.com/questions/18366500/how-to-get-google-profile-with-meteor-loginwithgoogle

Update 17/06/2016 : for meteor 1.3, you can find a working example here
http://blog.differential.com/meteor-google-oauth-from-react-native/

USAGE :

Run the app without tests :

modify settings.json with your API keys for port 3000 (get it with Google Console API), and run meteor with the settings :

```
meteor --settings settings.json
```

Run the acceptance tests with RTD :

you need to create test/settings directory and create another settings.json file inside
```
{
    "google_clientId" : "your_clientID",              // for port 8000
    "google_secret" : "your secret",                  // for port 8000
    "authenticateWithGoogle_name" : "your name",                            // in google account
    "authenticateWithGoogle_email" : "your google email",                   // for login in google account
    "authenticateWithGoogle_password" : "your google password"              // for login in google account
    "authenticateWithGoogle_title_google_account" : "Comptes Google",       // localise the window title
    "authenticateWithGoogle_title_grant_access" : "Demande d'autorisation"  // localise the window title
}
```

TODO :

mock the Google authentication with Accounts.registerLoginHandler fixture.

unit:Accounts.onCreateUser

check code coverage

CONTRIBUTORS :

Thank you sam for your help.






