describe('sockjs', function() {

  beforeEach(module('connection'));

  it('should create a socket instance', inject(function(sockjs) {
    expect(sockjs.callbacks).toBeDefined();
    expect(sockjs.setHandler).toBeDefined();
    expect(sockjs.removeHandler).toBeDefined();
    expect(sockjs.send).toBeDefined();
    expect(sockjs.close).toBeDefined();
  }));

});