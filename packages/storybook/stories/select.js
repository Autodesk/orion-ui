/**
Copyright 2016 Autodesk,Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/
import { storiesOf } from '@kadira/storybook';
import { withKnobs, text, select, number, boolean } from '@kadira/storybook-addon-knobs';
import React from 'react';
import { Select } from '../../react/lib/2016-12-01';
import SourceViewer from '../components/source_viewer';

storiesOf('Select', module)
  .addDecorator(withKnobs)
  .add('collapsed', () => {
    const props = {
      open: boolean('Open', false),
    };
    const options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' },
    ];

    const sources = [
      {
        label: 'React',
        source: `
import React from 'react';
import ReactDOM from 'react-dom';
import {Select} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
  render() {
    const options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    return <Select options={options} open={${props.open}} />;
  }
}

ReactDOM.render(React.createElement(App), document.body);
        `,
      },
      {
        label: 'Angular 1.5.x',
        source: `
// app controller
import 'angular';

angular.module('app', [])
  .controller('AppController', function() {
    var app = this;
    app.options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    app.open = ${props.open};
}]);

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-select options="{{app.options}}" open="{{app.open}}"  />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <Select options={options} open={props.open} />
        <SourceViewer sources={sources} />
      </div>
    );
  })
  .add('disabled option', () => {
    const props = {
      open: boolean('Open', true),
    };

    const sources = [
      {
        label: 'React',
        source: `
import React from 'react';
import ReactDOM from 'react-dom';
import {Select} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
  render() {
    const options = [
      { value: 'one', label: 'One', disabled: true },
      { value: 'two', label: 'Two' }
    ];

    return <Select options={options} open={${props.open}} />;
  }
}

ReactDOM.render(React.createElement(App), document.body);
        `,
      },
      {
        label: 'Angular 1.5.x',
        source: `
// app controller
import 'angular';

angular.module('app', [])
  .controller('AppController', function() {
    var app = this;
    app.options = [
      { value: 'one', label: 'One', disabled: true },
      { value: 'two', label: 'Two' }
    ];

    app.open = ${props.open};
}]);

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-select options="{{app.options}}" open="{{app.open}}" />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <SourceViewer sources={sources} />
      </div>
    );
  })
  .add('disabled', () => {
    const props = {
      disabled: boolean('Disabled', true),
    };

    const sources = [
      {
        label: 'React',
        source: `
import React from 'react';
import ReactDOM from 'react-dom';
import {Select} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
  render() {
    const options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    return (
      <Select options={options} disabled={${props.disabled}} />
    )
  }
}

ReactDOM.render(React.createElement(App), document.body);
        `,
      },
      {
        label: 'Angular 1.5.x',
        source: `
// app controller
import 'angular';

angular.module('app', [])
  .controller('AppController', function() {
    var app = this;
    app.options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    app.disabled = ${props.disabled};
}]);

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-select options="{{app.options}}" disabled="{{app.disabled}}" />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <SourceViewer sources={sources} />
      </div>
    );
  })
  .add('option focus', () => {
    const props = {
      focusIndex: number('Focus Index', 0, {
        range: true,
        min: 0,
        max: 1,
        step: 1,
      }),
    };

    const sources = [
      {
        label: 'React',
        source: `
import React from 'react';
import ReactDOM from 'react-dom';
import {Select} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
  render() {
    const options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    return (
      <Select options={options} open={true} focusIndex={${props.focusIndex}} />
    )
  }
}

ReactDOM.render(React.createElement(App), document.body);
        `,
      },
      {
        label: 'Angular 1.5.x',
        source: `
// app controller
import 'angular';

angular.module('app', [])
  .controller('AppController', function() {
    var app = this;
    app.options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    app.focusIndex = ${props.focusIndex};
}]);

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-select options="{{app.options}}" focusIndex="{{app.focusIndex}}" />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <SourceViewer sources={sources} />
      </div>
    );
  })
  .add('focus', () => {
    const props = {
      focus: boolean('Focus', true),
    };

    const sources = [
      {
        label: 'React',
        source: `
import React from 'react';
import ReactDOM from 'react-dom';
import {Select} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
  render() {
    const options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    return (
      <Select options={options} focus={${props.focus}} />
    )
  }
}

ReactDOM.render(React.createElement(App), document.body);
        `,
      },
      {
        label: 'Angular 1.5.x',
        source: `
// app controller
import 'angular';

angular.module('app', [])
  .controller('AppController', function() {
    var app = this;
    app.options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    app.focus = ${props.focus};
}]);

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-select options="{{app.options}}" focus="{{app.focus}}" />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <SourceViewer sources={sources} />
      </div>
    );
  })
  .add('selectedIndex', () => {
    const props = {
      open: boolean('Open', false),
      selectedIndex: number('Selected Index', 0, {
        range: true,
        min: 0,
        max: 1,
        step: 1,
      }),
    };

    const sources = [
      {
        label: 'React',
        source: `
import React from 'react';
import ReactDOM from 'react-dom';
import {Select} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
  render() {
    const options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    return (
      <Select options={options} open={${props.open}} selectedIndex={${props.selectedIndex}} />
    )
  }
}

ReactDOM.render(React.createElement(App), document.body);
        `,
      },
      {
        label: 'Angular 1.5.x',
        source: `
// app controller
import 'angular';

angular.module('app', [])
  .controller('AppController', function() {
    var app = this;
    app.options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    app.open = ${props.open};
    app.selectedIndex = ${props.selectedIndex};
}]);

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-select options="{{app.options}}" open="{{app.open}}" selectedIndex="{{app.selectedIndex}}" />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <SourceViewer sources={sources} />
      </div>
    );
  })
  .add('no search results', () => {
    const props = {
      searchable: boolean('Searchable', true),
      // query text makes the select open
      query: text('Query', 'Hello World'),
    };

    const sources = [
      {
        label: 'React',
        source: `
import React from 'react';
import ReactDOM from 'react-dom';
import {Select} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
  render() {
    const options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    return (
      <Select options={options} searchable={${props.searchable}} query="${props.query}" />
    )
  }
}

ReactDOM.render(React.createElement(App), document.body);
        `,
      },
      {
        label: 'Angular 1.5.x',
        source: `
// app controller
import 'angular';

angular.module('app', [])
  .controller('AppController', function() {
    var app = this;
    app.options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    app.open = ${props.open};
    app.searchable = ${props.searchable};
    app.query = "${props.query}";
}]);

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-select options="{{app.options}}" searchable="{{app.searchable}}" query="{{app.query}}" />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <SourceViewer sources={sources} />
      </div>
    );
  })
  .add('some search results', () => {
    const props = {
      searchable: boolean('Searchable', true),

      // query text makes the select open
      query: text('Query', 'one'),
    };

    const sources = [
      {
        label: 'React',
        source: `
import React from 'react';
import ReactDOM from 'react-dom';
import {Select} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
  render() {
    const options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    return (
      <Select options={options} searchable={${props.searchable}} query="${props.query}" />
    )
  }
}

ReactDOM.render(React.createElement(App), document.body);
        `,
      },
      {
        label: 'Angular 1.5.x',
        source: `
// app controller
import 'angular';

angular.module('app', [])
  .controller('AppController', function() {
    var app = this;
    app.options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    app.open = ${props.open};
    app.searchable = ${props.searchable};
    app.query = "${props.query}";
}]);

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-select options="{{app.options}}" searchable="{{app.searchable}}" query="{{app.query}}" />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <SourceViewer sources={sources} />
      </div>
    );
  })
  .add('clearable', () => {
    const props = {
      clearable: boolean('Clearable', true),
    };

    const sources = [
      {
        label: 'React',
        source: `
import React from 'react';
import ReactDOM from 'react-dom';
import {Select} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
  render() {
    const options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    return (
      <Select options={options} selectedIndex={1} clearable={${props.clearable}} />
    )
  }
}

ReactDOM.render(React.createElement(App), document.body);
        `,
      },
      {
        label: 'Angular 1.5.x',
        source: `
// app controller
import 'angular';

angular.module('app', [])
  .controller('AppController', function() {
    var app = this;
    app.options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    app.selectedIndex = 1;
    app.clearable = ${props.clearable};
}]);

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-select options="{{app.options}}" selectedIndex="{{app.selectedIndex}}" clearable="{{app.clearable}}" />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <SourceViewer sources={sources} />
      </div>
    );
  })
  .add('interactive', () => {
    const options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' },
    ];
    let selectState = {
      open: false,
    };
    function onChange(event) {
      selectState = event.state;
    }
    const sources = [
      {
        label: 'React',
        source: `
import React from 'react';
import ReactDOM from 'react-dom';
import {Select} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectState: Select.State.create()
    };

    this.onChange = (event) => {
      if (event.type === 'selectedIndexChange') {
        // do something
      }

      this.setState({ selectState: event.state });
    }
  }

  render() {
    const options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    return <Select {...this.state.selectState} options={options} onChange={this.onChange} />;
  }
}

ReactDOM.render(React.createElement(App), document.body);
        `,
      },
      {
        label: 'Angular 1.5.x',
        source: `
// app controller
import 'angular';
import {Select} from '@orion-ui/angular/lib/2016-12-01';

angular.module('app', [Select.moduleName])
  .controller('AppController', function() {
    var app = this;
    app.options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    app.selectState = Select.State.create();

    app.onChange = (event) => {
      if (event.type === 'selectedIndexChange') {
        // do something
      }

      app.selectState = event.state;
    }
}]);

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-select
      options="{{app.options}}"
      selectState="{{app.selectState}}"
      ng-change="app.onChange(selectState)" />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <Select options={options} open={selectState.open} onChange={onChange} />
        <SourceViewer sources={sources} />
      </div>
    );
  })
  .add('kitchen sink', () => {
    const props = {
      open: boolean('Open', false),
      disabled: boolean('Disabled', true),
      focusIndex: select('Focus Index', {
        undefined: 'undefined',
        0: '0',
        1: '1',
      }, 'undefined'),
      focus: boolean('Focus', true),
      selectedIndex: select('Selected Index', {
        undefined: 'undefined',
        0: '0',
        1: '1',
      }, 'undefined'),
      searchable: boolean('Searchable', false),
      query: text('Query', 'Hello World'),
      clearable: boolean('Clearable', true),
    };

    const sources = [
      {
        label: 'React',
        source: `
import React from 'react';
import ReactDOM from 'react-dom';
import {Select} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
  render() {
    const options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    return (
      <Select
        options={options}
        open={${props.open}}
        disabled={${props.disabled}}
        focusIndex={${props.focusIndex}}
        focus={${props.focus}}
        selectedIndex={${props.selectedIndex}}
        searchable={${props.searchable}}
        query="${props.query}"
        clearable={${props.clearable}} />
    )
  }
}

ReactDOM.render(React.createElement(App), document.body);
        `,
      },
      {
        label: 'Angular 1.5.x',
        source: `
// app controller
import 'angular';
import {SelectState, Select} from '@orion-ui/react/lib/2016-12-01/select';

angular.module('app', [Select.moduleName])
  .controller('AppController', function() {
    var app = this;
    app.options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];

    app.open = ${props.open};
    app.disabled = ${props.disabled};
    app.focusIndex = ${props.focusIndex};
    app.focus = ${props.focus};
    app.selectedIndex = ${props.selectedIndex};
    app.searchable = ${props.searchable};
    app.query = "${props.query}"
    app.clearable = ${props.clearable};
}]);

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-select
      options="{{app.options}}"
      open="{{app.open}}"
      disabled="{{app.disabled}}"
      focusIndex="{{app.focusIndex}}"
      focus="{{app.focus}}"
      selectedIndex="{{app.selectedIndex}}"
      searchable="{{app.searchable}}"
      query="{{app.query}}"
      clearable="{{app.clearable}}" />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <SourceViewer sources={sources} />
      </div>
    );
  });
