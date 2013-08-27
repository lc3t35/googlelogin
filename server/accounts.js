Accounts.onCreateUser(function (options, user) {

  var accessToken = user.services.google.accessToken,
      result,
      profile;

  result = Meteor.http.get("https://www.googleapis.com/oauth2/v3/userinfo", {
		headers: {"User-Agent": "Meteor/1.0"},
		
    params: {
      access_token: accessToken
    }
  });

  if (result.error)
    throw result.error;

  profile = _.pick(result.data,
    "name",  
	"given_name",
    "family_name",
    "profile",
    "picture",
    "email",
    "email_verified",
    "birthdate",
    "gender",
    "locale",
    "hd");

  // console.log(profile);
  user.profile = profile;

  return user;
});
