Template.user_loggedout.events({
	"click #login": function(e, tmpl){
		Meteor.loginWithGoogle({
				requestPermissions: ['email', 'profile']
		}, function (err) {
			if(err) {
				//error handling
                alert('error : '+ err);
			} else {
				//show an alert
				// alert('logged in');
			}
		});
	}
});

Template.user_loggedin.events({
	"click #logout": function(e, tmpl) {
		Meteor.logout(function(err) {
			if(err) {
				//sow err message
			} else {
				//show alert that says logged out
				//alert('logged out');
			}
		});
	}
});

