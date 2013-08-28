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
}
```

including tests with rtd ( https://github.com/xolvio/rtd )

unit/client/test_templates.js

unit/server_test_config.js

acceptance tests : index.spec.js -> working on AuthenticateWithGoogle

PROBLEM TO SOLVE : the Google authentication windows pops up but it is not filled by the webdriver.

TODO :

unit:Accounts.onCreateUser

check code coverage






