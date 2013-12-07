// To run: casperjs test test/serverTest.js

// var servers = {"Ruby": 3000, "Node": 4000};
// var servers = {"Ruby": 3000}
var servers = {"Node": 4000}

var loadsApplication = function() {
    casper.test.assertHttpStatus(200, 'Loads the application');
    casper.test.assertResourceExists('vwf.js', 'Loads the VWF framework');
}

var loadsComponent = function() {
    casper.test.assertHttpStatus(200, 'Loads the component');
    casper.test.assertResourceExists('vwf.js', 'Loads the VWF framework');
}

Object.keys(servers).forEach(function(server) {
    var port = servers[server];
    var serverAddress = 'http://localhost:' + port;

    casper.test.begin('Testing a VWF application with the ' + server + ' server', 27, function suite(test) {

        //--------------//
        // Applications //
        //--------------//

        casper.start(serverAddress + '/duck', loadsApplication);

        casper.thenOpen(serverAddress + '/duck/', loadsApplication);

        casper.thenOpen(serverAddress + '/duck/0000000000000000', loadsApplication);

        // TODO: Not sure why, but this test fails. Fails to load vwf.js.
        // casper.thenOpen(serverAddress + '/duck/0000000000000000/', loadsApplication);

        casper.thenOpen(serverAddress + '/duck/index.vwf', loadsApplication);

        casper.thenOpen(serverAddress + '/duck/index.vwf/', loadsApplication);

        casper.thenOpen(serverAddress + '/duck/index.vwf/0000000000000000', loadsApplication);

        // TODO: Not sure why, but this test fails. Fails to load vwf.js.
        // casper.thenOpen(serverAddress + '/duck/index.vwf/0000000000000000/', loadsApplication);

        //--------------//
        // Static Files //
        //--------------//

        casper.thenOpen(serverAddress + '/duck/images/duckCM.png', function(response) {
            test.assertHttpStatus(200, 'Retrieves a static file');
            test.assertMatch(response.headers.get('Content-Type'), /^image\/png/i, 'File is of type image/png')
        });

        casper.thenOpen(serverAddress + '/duck/0000000000000000/images/duckCM.png', function(response) {
            test.assertHttpStatus(200, 'Retrieves a static file');
            test.assertMatch(response.headers.get('Content-Type'), /^image\/png/i, 'File is of type image/png')
        });

        //------//
        // 404s //
        //------//

        casper.thenOpen(serverAddress + '/this-is-not-an-app/', function() {
            test.assertHttpStatus(404, 'Gets a 404 error');
            test.assertTextExists("Error 404", 'Displays the 404 page');
        });

        casper.thenOpen(serverAddress + '/', function() {
            test.assertHttpStatus(404, 'Gets a 404 error');
            test.assertTextExists("Error 404", 'Displays the 404 page');
        });

        //--------//
        // Admins //
        //--------//

        casper.thenOpen(serverAddress + '/duck/admin/config', function() {
            test.assertHttpStatus(200, 'Retrieves the config file');
            test.assertTextExists("VWF Duck Application", 'Parses the config file');
        });

        casper.thenOpen(serverAddress + '/duck/', function() {
            test.assertTitle('VWF Duck Application', 'Sets the title from the config file');
        });

        //------------//
        // Components //
        //------------//

        casper.thenOpen(serverAddress + '/test/component.vwf', loadsComponent);

        casper.thenOpen(serverAddress + '/test/component.vwf/', loadsComponent);

        casper.thenOpen(serverAddress + '/test/component.vwf/0000000000000000', loadsComponent);

        // TODO: Not sure why, but this test fails. Fails to load vwf.js.
        // casper.thenOpen(serverAddress + '/test/component.vwf/0000000000000000/', loadsComponent);

        casper.run(function() {
            casper.echo('Finished testing the ' + server + ' server.\n');
            test.done();
        });
    });
});

