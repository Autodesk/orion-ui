gemini.suite('default button', (suite) => {
  suite
    .setUrl('/iframe.html?selectedKind=Button&selectedStory=with%20text')
    .setCaptureElements(".example")
    .before(function(actions, find) {
      this.button = find('orion-button');
    })
    .capture('default')
    .capture('hovered', function(actions, find){
      actions.mouseMove(this.button);
    });
});

gemini.suite('disabled button', (suite) => {
  suite
    .setUrl('/iframe.html?selectedKind=Button&selectedStory=disabled')
    .setCaptureElements(".example")
    .before(function(actions, find) {
      this.button = find('orion-button');
    })
    .capture('default')
    .capture('hovered', function(actions, find){
      actions.mouseMove(this.button);
    });
});

gemini.suite('small button', (suite) => {
  suite
    .setUrl('/iframe.html?selectedKind=Button&selectedStory=small%20button')
    .setCaptureElements(".example")
    .before(function(actions, find) {
      this.button = find('orion-button');
    })
    .capture('default')
    .capture('hovered', function(actions, find){
      actions.mouseMove(this.button);
    });
});

gemini.suite('large button', (suite) => {
  suite
    .setUrl('/iframe.html?selectedKind=Button&selectedStory=large%20button')
    .setCaptureElements(".example")
    .before(function(actions, find) {
      this.button = find('orion-button');
    })
    .capture('default')
    .capture('hovered', function(actions, find){
      actions.mouseMove(this.button);
    });
});
