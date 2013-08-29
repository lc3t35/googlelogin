(function () {
    "use strict";

    jasmine.getEnv().defaultTimeoutInterval = 10000;

    var http = require('http'),
        request = require('request'),
        webdriver = require('../rtd/node_modules/selenium-webdriver'),
        driver,
        flow = webdriver.promise.controlFlow(),
        newRun,
        settings = require('../settings/settings.json');

    var getWebdriverSessions = function (callback) {
        request.get({
            url: 'http://localhost:4444/wd/hub/sessions',
            headers: {
                'Content-type': 'application/json'
            }
        }, function (error, response, body) {
            callback(JSON.parse(body).value);
        });
    };

    var getWebdriverSessionStatus = function (sessionId, callback) {
        request.get({
            url: 'http://localhost:4444/wd/hub/session/' + sessionId + '/url',
            headers: {
                'Content-type': 'application/json'
            }
        }, function (error, response) {
            callback(response.statusCode);
        });
    };

    var deleteWebdriverSession = function (sessionId) {
        request.del({
            url: 'http://localhost:4444/wd/hub/session/' + sessionId,
            headers: {
                'Accept': 'application/json'
            }
        }, null);
    };

    var deleteWebdriverSessions = function (sessions) {
        for (var i = 0; i < sessions.length; i += 1) {
            deleteWebdriverSession(sessions[i].id);
        }
    };

    var reuseOrCreateSession = function (sessions) {
        if (sessions.length === 0) {
            driver = require('../rtd/webdrivers/selenium-server.js')(webdriver, { browserName: 'chrome' });
            driver.manage().timeouts().setScriptTimeout(2000);
            driver.manage().timeouts().implicitlyWait(10000);
        } else {
            var tempDriver = require('../rtd/webdrivers/selenium-server.js')(webdriver, { browserName: 'chrome' }, sessions[0].id);
            getWebdriverSessionStatus(sessions[0].id, function (status) {
                if (status !== 200) {
                    deleteWebdriverSessions(sessions);
                    tempDriver = require('../rtd/webdrivers/selenium-server.js')(webdriver, { browserName: 'chrome' });
                }
                tempDriver.manage().timeouts().setScriptTimeout(2000);
                tempDriver.manage().timeouts().implicitlyWait(10000);
                driver = tempDriver;
            });
        }
    };

    getWebdriverSessions(reuseOrCreateSession);

    var waitForWebdriver = function (callback) {
        if (driver) {
            callback();
        }
        newRun = true;
        waitsFor(function () {
            return driver;
        }, "Webdriver did not initialize.\nYou may need to restart RTD", 10000);
        runs(function () {
            callback();
        });
    };


    var resetApp = function () {
        var deferred = webdriver.promise.defer();
        driver.get('http://localhost:8000/reset').then(function () {
            deferred.resolve();
        });
        return deferred.promise;
    };

    var openApp = function () {
        var deferred = webdriver.promise.defer();
        var doGet = function () {
            driver.get('http://localhost:8000').then(function () {
                deferred.resolve();
            });
        };
        if (newRun) {
            doGet();
            newRun = false;
        } else {
            postBackCoverage().then(doGet);
        }
        return deferred.promise;
    };

    var postBackCoverage = function () {
        return driver.executeScript(function () {
            document.postCoverage();
        });
    };

    var error = function (err) {
        console.log('\n');
        console.error(err);
        console.error('Error in acceptance tests');
    };

    var authenticateWithGoogle = function () {
        var name = settings.authenticateWithGoogle_name;
        var email = settings.authenticateWithGoogle_email;
        var password = settings.authenticateWithGoogle_password;
        var title_google_account = settings.authenticateWithGoogle_title_google_account;
        var title_grant_access = settings.authenticateWithGoogle_title_grant_access;
        var deferred = webdriver.promise.defer();

        console.log('\nauthenticateWithGoogle');

        describe("checking the settings exists for acceptance tests", function() {
            it("has value in settings.json", function() {
                expect(name).not.toBeNull();
                expect(email).not.toBeNull();
                expect(password).not.toBeNull();
                expect(title_google_account).not.toBeNull();
                expect(title_grant_access).not.toBeNull();
            });
        });

        describe("checking the windows title", function() {
            var window_title;

            driver.getTitle().then(function(title) {
                console.log('1 - before login : '+ title) ;
                window_title = title;
            });

            it("returns the requested value", function() {
                expect(window_title).toEqual("Accounts");
            });
        });

        describe("click on LoginWithGoogle", function() {
            var window_title;

            driver.findElement(webdriver.By.id('login')).click().then(function(what) {
                console.log('2 - after login : '+ what) ;
            });

            driver.getTitle().then(function(title) {
                console.log('3 - before switch : '+ title) ;
                window_title = title;
            });

            it("returns the requested value", function() {
                console.log('4 - checking : '+ window_title) ;
                expect(window_title).toEqual("Accounts");
            });

        });

        describe("change the window handle for google credentials", function() {
            var window_title;
            var popUpHandle,  parentHandle;

            driver.getAllWindowHandles().then(function(handles) {
                popUpHandle = handles[1];
                parentHandle = handles[0];
                console.log('5 - switchTo');
                driver.switchTo().window(popUpHandle);
            });

            driver.getTitle().then(function(title) {
                window_title = title;
                console.log('6 - after switch : '+ window_title) ;
            });

            it("asks for google credentials", function() {
                console.log('6bis - ????') ;
                expect(window_title).toEqual(title_google_account);
                expect(driver.findElement(webdriver.By.id('signIn'))).toBeDefined();
            });

        });

        describe("send google credentials", function() {
            var window_title;

            driver.findElement(webdriver.By.id('Email')).sendKeys(email);
            driver.findElement(webdriver.By.id('Passwd')).sendKeys(password);
            driver.findElement(webdriver.By.id('signIn')).click().then(function(what) {
                console.log('7 - signIn click : '+ what) ;
            });

            driver.getTitle().then(function(title) {
                window_title = title;
                console.log('8 - after connexion : '+ window_title) ;
            });

            console.log('8bis - ???') ;

            it("ask for permission", function() {
                // NOT EXECUTED !
                console.log('9 - window_title : '+ window_title) ;
                expect(window_title).toEqual(title_grant_access);
                expect(driver.findElement(webdriver.By.id('submit_approve_access'))).toBeDefined();
            });
        });

        describe("validate permission", function() {
            var window_title;
            driver.findElement(webdriver.By.id('submit_approve_access')).click().then(function(what) {
                console.log('10 - submit_approve_access click : '+ what) ;
            });
            driver.getTitle().then(function(title) {
                window_title = title;
                console.log('11 - submit_approve_access : '+ window_title) ;
            });

            it("grants access", function() {
                console.log('12 - grants access ') ;
                expect(window_title).toEqual("Accounts");
                expect(driver.findElement(webdriver.By.id('profile-login'))).toBeDefined();
            });
        });

        describe("displays the username", function() {
            var window_title;

            driver.getTitle().then(function(title) {
                window_title = title;
                console.log('13 - back to Accounts : '+ window_title) ;
            });

            driver.findElement(webdriver.By.id('profile-login')).getText()
                .then(function (value) {
                    if (value.indexOf(name) !== 0) {
                        deferred.rejected(value + ' did not contain ' + name);
                    } else {
                        console.log('14 - profile-login : '+ value) ;
                        deferred.fulfill();
                    }
                });
        });

        return deferred.promise;
    };

    describe("Google login", function () {

        beforeEach(function () {
            var ready = false;
            waitForWebdriver(function () {
                resetApp().
                    then(openApp).
                    then(function () {
                        ready = true;
                    });
            });
            waitsFor(function () {
                return ready;
            }, "App didn't reset", 10000);
        });

        it("authenticates with Google and displays the user name", function (done) {
            authenticateWithGoogle().
                then(function () {
                    done();
                }, error);
        });

    });

})();