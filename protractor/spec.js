describe('Valkyrie Demo', function() {

  beforeEach(function() {
    browser.get('/');
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Valkyrie Demo');
  });

  it('should start with a perp name displayed', function() {
    const text = element(by.css('app-root')).getText();
    expect(text).toContain('PERP NAME');
  });

});
