(function () {
    "use strict";

    Template.stub('user_loggedout');
    Template.stub('user_loggedin');

    describe("Template.user_loggedout [click #login] event", function () {

        it("proceed to login when not logged in", function () {

            expect(Meteor.userId()).toBe(null);
            spyOn(Meteor, 'loginWithGoogle');
            Template.user_loggedout.fireEvent('click #login');
            expect(Meteor.loginWithGoogle.calls.length).toEqual(1);
        });

    });

    describe("Template.user_loggedin [click #logout] event", function () {

        it("proceed to logout when logged in", function () {

            expect(Meteor.userId()).toBe(null);
            spyOn(Meteor, 'logout');
            Template.user_loggedin.fireEvent('click #logout');
            expect(Meteor.logout.calls.length).toEqual(1);

        });

    });

})();
