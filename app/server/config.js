(function(){
    Meteor.startup(function () {
        Accounts.loginServiceConfiguration.remove({
            service: "google"
        });

        Accounts.loginServiceConfiguration.insert({
            service: "google",
            clientId: Meteor.settings.google_clientId,
            secret: Meteor.settings.google_secret
        });
    });
}());
