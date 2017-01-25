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
import { withKnobs, text, boolean, object, number } from '@kadira/storybook-addon-knobs';
import React from 'react';
import SourceViewer from '../components/source_viewer';
import Example from '../components/example';

storiesOf('DatePicker', module)
  .addDecorator(withKnobs)
  .add('unfocused w/o date', () => {
    const sources = [
      {
        label: 'React',
        source: `
import React from 'react';
import ReactDOM from 'react-dom';
import {DatePicker} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
    render() {
        return <DatePicker date={null} focus={false} />;
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
import {DatePicker} from '@orion-ui/angular/lib/2016-12-01';

angular.module('app', [DatePicker.module])
  .controller('AppController', function() {
    var app = this;
    app.date = null;
    app.focus = false;
  });

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-date-picker date="{{app.date}}" focus="{{app.focus}}" />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <Example>
          <span>todo</span>
        </Example>
        <SourceViewer sources={sources} />
      </div>
    );
  })
  .add('unfocused w date', () => {
    const sources = [
      {
        label: 'React',
        source: `
import React from 'react';
import ReactDOM from 'react-dom';
import * as moment from 'moment';
import {DatePicker} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
    render() {
        const date = moment();
        return <DatePicker date={date} focus={false} />;
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
import * as moment from 'moment';
import {DatePicker} from '@orion-ui/angular/lib/2016-12-01';

angular.module('app', [DatePicker.module])
  .controller('AppController', function() {
    var app = this;
    app.date = moment();
    app.focus = false;
  });

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-date-picker date="{{app.date}}" focus="{{app.focus}}" />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <Example>
          <span>todo</span>
        </Example>
        <SourceViewer sources={sources} />
      </div>
    );
  })
  .add('clearable', () => {
    const sources = [
      {
        label: 'React',
        source: `
import React from 'react';
import ReactDOM from 'react-dom';
import * as moment from 'moment';
import {DatePicker} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
    render() {
        const date = moment();
        return <DatePicker date={date} focus={false} clearable={true} />;
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
import * as moment from 'moment';
import {DatePicker} from '@orion-ui/angular/lib/2016-12-01';

angular.module('app', [DatePicker.module])
  .controller('AppController', function() {
    var app = this;
    app.date = moment();
    app.focus = false;
    app.clearable = true;
  });

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-date-picker date="{{app.date}}" focus="{{app.focus}}" clearable="{{app.clearable}} />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <Example>
          <span>todo</span>
        </Example>
        <SourceViewer sources={sources} />
      </div>
    );
  })
  .add('custom placeholder text', () => {
    const props = {
      placeholder: text('Placeholder', '__ / __ / ____'),
    };

    const sources = [
      {
        label: 'React',
        source: `
import React from 'react';
import ReactDOM from 'react-dom';
import {DatePicker} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
    render() {
        return <DatePicker date={null} placeholder="${props.placeholder}" />;
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
import * as moment from 'moment';
import {DatePicker} from '@orion-ui/angular/lib/2016-12-01';

angular.module('app', [DatePicker.module])
  .controller('AppController', function() {
    var app = this;
    app.date = null;
    app.placeholder = "${props.placeholder}";
  });

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-date-picker date="{{app.date}}" placeholder="{{app.placeholder}}" />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <Example {...props}>
          <span>todo</span>
        </Example>
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
import * as moment from 'moment';
import {DatePicker} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
    render() {
        const date = moment();
        return <DatePicker date={date} focus={${props.focus}} />;
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
import * as moment from 'moment';
import {DatePicker} from '@orion-ui/angular/lib/2016-12-01';

angular.module('app', [DatePicker.module])
  .controller('AppController', function() {
    var app = this;
    app.date = moment();
    app.focus = ${props.focus};
  });

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-date-picker date="{{app.date}}" focus="{{app.focus}}" />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <Example {...props}>
          <span>todo</span>
        </Example>
        <SourceViewer sources={sources} />
      </div>
    );
  })
  .add('focus month & day', () => {
    const props = {
      focusMonthIndex: number('Focus Month Index', 1), // Feb
      focusDayIndex: number('Focus Day Index', 20), // 19th
    };

    const sources = [
      {
        label: 'React',
        source: `
import React from 'react';
import ReactDOM from 'react-dom';
import * as moment from 'moment';
import {DatePicker} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
    render() {
        const date = moment();
        return <DatePicker date={date} focus={true} focusMonthIndex={${props.focusMonthIndex}} focusDayIndex={${props.focusDayIndex}} />;
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
import * as moment from 'moment';
import {DatePicker} from '@orion-ui/angular/lib/2016-12-01';

angular.module('app', [DatePicker.module])
  .controller('AppController', function() {
    var app = this;
    app.date = moment();
    app.focusMonthIndex = ${props.focusMonthIndex};
    app.focusDayIndex = ${props.focusDayIndex};
  });

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-date-picker date="{{app.date}}" focusMonthIndex="{{app.focusMonthIndex}}" focusDayIndex="{{app.focusDayIndex}}" />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <Example {...props}>
          <span>todo</span>
        </Example>
        <SourceViewer sources={sources} />
      </div>
    );
  })
  .add('custom date formatting', () => {
    const props = {
      locale: text('Locale', 'zh-cn'),
      displayFormat: text('Display Format', 'ddd, hA'),
      monthFormat: text('Month Format', 'YYYY[年]MMMM'),
    };

    const sources = [
      {
        label: 'React',
        source: `
import React from 'react';
import ReactDOM from 'react-dom';
import * as moment from 'moment';
import {DatePicker} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
    render() {
        moment.locale('${props.locale}');
        const date = moment();
        return <DatePicker date={date} focus={true} displayFormat="${props.displayFormat}" monthFormat="${props.monthFormat}" />;
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
import * as moment from 'moment';
import {DatePicker} from '@orion-ui/angular/lib/2016-12-01';

angular.module('app', [DatePicker.module])
  .controller('AppController', function() {
    moment.locale('${props.locale}');

    var app = this;
    app.date = moment();

    app.displayFormat = ${props.displayFormat};
    app.monthFormat = ${props.monthFormat};
  });

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-date-picker date="{{app.date}}" displayFormat="{{app.displayFormat}}" monthFormat="{{app.monthFormat}}" />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <Example {...props}>
          <span>todo</span>
        </Example>
        <SourceViewer sources={sources} />
      </div>
    );
  })
  .add('i18n', () => {
    const props = {
      i18n: object('Phrases', {
        previousMonth: '前一个月',
        nextMonth: '下个月',
        clearDate: '清除日期',
      }),
    };

    const sources = [
      {
        label: 'React',
        source: `
import React from 'react';
import ReactDOM from 'react-dom';
import * as moment from 'moment';
import {DatePicker} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
    render() {
        const i18n = ${JSON.stringify(props.i18n, null, 10)};
        const date = moment();
        return <DatePicker date={date} focus={true} i18n={i18n}  />;
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
import * as moment from 'moment';
import {DatePicker} from '@orion-ui/angular/lib/2016-12-01';

angular.module('app', [DatePicker.module])
  .controller('AppController', function() {
    var app = this;
    app.i18n = ${JSON.stringify(props.i18n, null, 10)};
    app.date = moment();
  });

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-date-picker date="{{app.date}}" i18n="{{app.i18n}}" />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <Example {...props}>
          <span>todo</span>
        </Example>
        <SourceViewer sources={sources} />
      </div>
    );
  })
  .add('custom disabled dates', () => {
    const sources = [
      {
        label: 'React',
        source: `
import React from 'react';
import ReactDOM from 'react-dom';
import * as moment from 'moment';
import {DatePicker} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
    constructor() {
      this.isEnabled = this.isEnabled.bind(this);
    }

    // Only enable dates in the next two weeks
    isEnabled(date) {
      const now = moment();
      const twoWeeksFromNow = moment().add(2, 'weeks');

      if (date.isBefore(now)) {
        return false;
      }

      if (date.isAfter(twoWeeksFromNow)) {
        return false;
      }

      return true;
    }

    render() {
        const date = moment();
        return <DatePicker date={date} focus={true} isEnabled={this.isEnabled} />;
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
import * as moment from 'moment';
import {DatePicker} from '@orion-ui/angular/lib/2016-12-01';

angular.module('app', [DatePicker.module])
  .controller('AppController', function() {
    var app = this;
    app.date = moment();
    app.focus = true;

    app.isEnabled(date) {
      const now = moment();
      const twoWeeksFromNow = moment().add(2, 'weeks');

      if (date.isBefore(now)) {
        return false;
      }

      if (date.isAfter(twoWeeksFromNow)) {
        return false;
      }

      return true;
    }

  });

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-date-picker date="{{app.date}}" focus="{{app.focus}}" isEnabled="{{app.isEnabled}}" />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <Example>
          <span>todo</span>
        </Example>
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
import * as moment from 'moment';
import {DatePicker} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
    render() {
        const date = moment();
        return <DatePicker date={date} disabled={${props.disabled}}  />;
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
import * as moment from 'moment';
import {DatePicker} from '@orion-ui/angular/lib/2016-12-01';

angular.module('app', [DatePicker.module])
  .controller('AppController', function() {
    var app = this;
    app.date = moment();
    app.disabled = ${props.disabled};
  });

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-date-picker date="{{app.date}}" disabled="{{app.disabled}}" />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <Example {...props}>
          <span>todo</span>
        </Example>
        <SourceViewer sources={sources} />
      </div>
    );
  })
  .add('interactive', () => {
    const props = {
      disabled: boolean('Disabled', true),
    };

    const sources = [
      {
        label: 'React',
        source: `
import React from 'react';
import ReactDOM from 'react-dom';
import * as moment from 'moment';
import {DatePicker} from '@orion-ui/react/lib/2016-12-01';

class App extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        datePickerState: {}
      };

      this.onChange = (event) => {
        if (event.type === 'focusedDayChange') {
          // do something special
        }

        this.setState({ selectState: event.state });
      }
    }

    render() {
        const date = moment();
        return <DatePicker {...this.state.datePickerState} date={date} onChange={this.onChange}  />;
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
import * as moment from 'moment';
import {DatePicker} from '@orion-ui/angular/lib/2016-12-01';

angular.module('app', [DatePicker.module])
  .controller('AppController', function() {
    var app = this;
    app.date = moment();
    app.datePickerState = {};

    app.onChange = (event) => {
        if (event.type === 'focusedDayChange') {
          // do something special
        }

      app.datePickerState = event.state;
    }
  });

// app.html

<!doctype html>
<html lang="en" ng-app="app">
  <body ng-controller="AppController as app">
    <orion-date-picker
      date="{{app.date}}"
      datePickerState="{{app.datePickerState}}"
      ng-change="app.onChange(datePickerState)" />
  </body>
</html>
        `,
      },
    ];

    return (
      <div>
        <Example {...props}>
          <span>todo</span>
        </Example>
        <SourceViewer sources={sources} />
      </div>
    );
  });
