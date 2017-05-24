## Orion Architecture


### How does react and angular hook into the web components layer

The React and Angular frameworks serve as a wrapper around the web component layer in Orion. The frameworks control the state of each component by passing down properties to the component. They then listen for change events that bubble up from the component layer.

Examples of this are show in the `orion/packages/react-playground/src/App.js` and `orion/packages/angular-playground/src/app.js`

These change events then trigger the framework layer (React/Angular) to update the state of the components and pass the updated properties back through.

properties passed to Framework Layer-> Framework Layer passes updated properties to WebComponents -> Web Components update state -> Web components trigger change event -> Framework receives updated props.  

# What is the basic anatomy of a web component
Web Components have an [API](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements)

Orion is using the [CustomElements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements) portion of the API.

### The Custom elements API has several methods.
Orion implements the `constructor()`, `connectedCallback()`, and `disconnectedCallback()`

`constructor()` - called when the element is created or upgraded.

`connectedCallback()` - called when the element is inserted into a document.

`disconnectedCallback()` - called when the element is removed from a document.

All components extend from our custom element located in `orion/packages/components/src/2016-12-01/element.js`.


### Element.js
An `OrionElement` exposes properties to control its appearance.

### How does styling work
`OrionElement` creates getters and setters for view-related properties. Values set there are translated into [Tachyon](http://tachyons.io)-style classes that control an element's appearance.

For example, say we set the background property on an `OrionElement` to blue:

```
var el = document.createElement('orion-element');
el.background = 'blue';
```

Internally, this value is stored in `viewState`.

```
el.viewState;
=> { background: 'blue'}
```

When the element is rendered, each property in `viewState` is translated into a class.

```
el.render();
el.className;
=> 'bg-blue'
```

Mappings between viewState properties and classes are defined within the `style` package in `packages/style`. In this example, the `background` property is defined within `packages/style/src/skins.js`.


# Creating a new style
1) Add a file for your new style under `orion/packages/style/src/`.
2) Reference your new style in
`orion/packages/components/src/2016-12-01/element.js`, `orion/packages/components/src/utils/inject-styles.js`,
and `orion/packages/style/src/2016-12-01/index.js`.

#How and why do properties override internal state
Properties are passed in externally through the framework layer and into the web component layer like so -

React Layer
```
<Select clearable searchable disabled={this.state.disabled} options={this.state.buttonSizes} selectedIndex={this.state.selectedIndex} onChange={this.setSelectedIndex}/>
```

This allows the state of the component to be controlled externally and for properties to override any changes in state that are executed by the state machine(explained below). For example, if `searchable={true}` is passed into the `Select` component(as seen above), this value will not be overwritten by internal changes to state.

# How does state management work
As explained above, properties are passed to a component from the Framework layer.

User interactions change a component's state, which then changes a component's appearance.

A component's state is represented by an object made up of these properties. Components use a state machine to manage state transitions.

For example, when a user clicks on the button within an `OrionSelect`, a menu of options appears.

Components listen for the user interaction event - in this case the `click` event.

Event handlers use a state machine to move the component from one state into another. In this case, the state machine would change the state of the menu from `closed` to `open`.

This updated state is then passed back up to the Framework layer, which passes it back through to the component.

It follows this flow:

Component listens for user interaction event -> state machine updates state -> component sends updated up to Framework Layer -> Framework Layer passes updates props back down to the component

When rendered, a component's state is expressed visually.
