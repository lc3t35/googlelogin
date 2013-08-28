describe("Account configuration", function() {

    it("is has settings defined", function() {
        // EXECUTE & VERIFY
        expect(Meteor.settings.google_clientId).not.toBe(null);
        expect(Meteor.settings.google_secret).not.toBe(null);
    });

    it("is removes existing service configuration", function() {
        // EXECUTE & VERIFY
        expect(Meteor.instantiationCounts.loginserviceconfiguration).toBe(1);
        spyOn(Accounts.loginServiceConfiguration, 'remove');
        spyOn(Accounts.loginServiceConfiguration, 'insert');
        Meteor.startup();
        expect(Accounts.loginServiceConfiguration.remove.calls.length).toEqual(1);
        expect(Accounts.loginServiceConfiguration.insert.calls.length).toEqual(1);
    });

});
