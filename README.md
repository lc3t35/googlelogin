Google Login
==========================
based on Chris Mather's video Customizing Login, http://www.eventedmind.com/posts/meteor-customizing-login,
using also Meteor but that sets up logins via Google's app api instead of GitHub (https://github.com/m2web/githublogin)

It's the result of the process for solving this question
http://stackoverflow.com/questions/18366500/how-to-get-google-profile-with-meteor-loginwithgoogle

# This is the work is progress - it might be broken

USAGE :

modify settings.json with your API keys (get it with Google Console API), and run meteor with the settings :

meteor --settings settings.json

WIP :

you need to create test/settings and create settings.json
```
{
    "google_clientId" : "your_clientID",
    "google_secret" : "your secret",
    "authenticateWithGoogle_name" : "your name",
    "authenticateWithGoogle_email" : "your google email",
    "authenticateWithGoogle_password" : "your google password"
    "authenticateWithGoogle_title_google_account" : "Comptes Google",       // localise the window title
    "authenticateWithGoogle_title_grant_access" : "Demande d'autorisation"  // localise the window title
}
```

including tests with rtd ( https://github.com/xolvio/rtd )

unit/client/test_templates.js

unit/server_test_config.js

acceptance tests : index.spec.js -> working on AuthenticateWithGoogle

PROBLEM TO SOLVE : the Google authentication and access grant windows pop up but it does not click on accept.

The call order of it and expects is not the one expected :
```
authenticateWithGoogle
3 - before login
1 - before login : Accounts
4 - after login :
5 - before switch : Accounts
7 - switchTo
8 - after switch : Comptes Google
2 - checks : Accounts
6 - checking : Accounts
9 - ????
FAILING HERE AT THE END
```

TODO :

unit:Accounts.onCreateUser

check code coverage






