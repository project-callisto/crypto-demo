describe('Valkyrie Demo', function() {
  it('should have a title', function() {
    browser.get('/');
    expect(browser.getTitle()).toEqual('Valkyrie Demo');
  });
});
