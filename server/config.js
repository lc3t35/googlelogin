Accounts.loginServiceConfiguration.remove({
		service: "github"
});

Accounts.loginServiceConfiguration.insert({
		service: "github",
		clientId: Meteor.settings.githubClientID,
		secret: Meteor.settings.githubSecret
});
