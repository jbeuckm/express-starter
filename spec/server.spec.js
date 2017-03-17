var request = require('supertest');

describe('server', function () {

    var server;
    
    beforeEach(function () {
        server = require('../server');
    });

    afterEach(function () {
        server.close();
    });
    
    it('can get root', function testPath(done) {

        request(server)
            .get('/')
            .expect(200)
            .end(function(err, res){
                expect(err).toBeNull();
                done();
            });
    });
    
});