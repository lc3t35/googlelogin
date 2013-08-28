(function () {
    "use strict";

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

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
            driver.manage().timeouts().implicitlyWait(5000);
        } else {
            var tempDriver = require('../rtd/webdrivers/selenium-server.js')(webdriver, { browserName: 'chrome' }, sessions[0].id);
            getWebdriverSessionStatus(sessions[0].id, function (status) {
                if (status !== 200) {
                    deleteWebdriverSessions(sessions);
                    tempDriver = require('../rtd/webdrivers/selenium-server.js')(webdriver, { browserName: 'chrome' });
                }
                tempDriver.manage().timeouts().setScriptTimeout(2000);
                tempDriver.manage().timeouts().implicitlyWait(5000);
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
        var deferred = webdriver.promise.defer();

        driver.getTitle().then(function(title) {
            console.log('avant switch : '+ title) ;
        });

        driver.findElement(webdriver.By.id('login')).click();
        // works until here : google accounts windows pops up
        // you have to switch to this window

        for (var handle in driver.getAllWindowHandles()) {
            driver.switchTo().window(handle);
        }

        // check if the title is the good one
        driver.getTitle().then(function(title) {
            console.log('apres switch : '+ title) ;
        });

        // send credentials
        driver.findElement(webdriver.By.id('Email')).sendKeys(email);
        driver.findElement(webdriver.By.id('Passwd')).sendKeys(password);
        driver.findElement(webdriver.By.id('signIn')).click();

        // gets back to the main window if needed
        for (var handle in driver.getAllWindowHandles()) {
            driver.switchTo().window(handle);
        }

        // check the displayed username
        driver.findElement(webdriver.By.id('profile-login')).getText()
            .then(function (value) {
                if (value.indexOf(name) !== 0) {
                    deferred.rejected(value + ' did not contain ' + name);
                } else {
                    deferred.fulfill();
                }
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


//        it("can have a more test here for this spec...", function (done) {
//            finish(done);
//        });

    });

})();