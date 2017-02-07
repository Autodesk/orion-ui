# design-dsl

This package is here to explore concepts for a design domain specific language.

## 1. primitives

How do we describe the properties of primitives efficiently?

* containers
* text
* images

## 2. composition

* How are primitives combined into more complex components

## 3. abstraction

* How do we hide lower level implementation details
* How do we transform data into primitives

## Assumptions

* Bottom out on a CSS style box model

## Experiments

* `npm run compile` builds the Experiments
* `npm run hello-primitives`
* `npm run hello-toolbar`
* `npm run hello-panel`;

# Introduction

## What is Orion Markup Language?

* some UI frameworks focus on creating a super-set of features available in the browser
    * some of these frameworks take HTML and add extra directives and elements (e.g. angular)
    * others have you write directly in JavaScript and avoid using real HTML at all (e.g. React/JSX)
* some UI frameworks abstract the browser APIs away and have you "write once, run anywhere"
* Investigate: How movies get made, the pipelines that are built there are appealing

### Problem 1: Designer -> Developer Workflow is broken

* most designers are unable to deeply participate in the practice of developing digital product UIs
* Their options:

  1. Make mockups in Sketch, Photoshop, or Illustrator and redline them for developers
  2. Learn HTML/CSS/JavaScript
  3. Visual Prototyping tools (Invisio n)

There are serious problems with both of these options:

### 1: Using a digital design tool
* The design process is stuck in the advertising age:
  * conceptualize
  * fabricate
  * send assets to the printer

* "As built" specs are not created after the real UI components are built. This
  means that designers visual specs are quickly out of date and can't grown over time

* Design tools don't often have the right constraints in place.
  * Required constraints:
    * company constraints:
      * human interface patterns
      * brand patterns
    * target platform technical constraints:
      * heirarchical layout engine
      * font engine
    * a component model
  * Actual constraints (typical):
    * pixel precise editing
    * flat list of layers
    * boolean operations to combine paths & create complex shapes
    * symbols or other 'smart objects' which are very bad

As you can see, most of the important constraints aren't expressed in a visual
design tool which makes sense because they are only focusing on the 'visual' aspects.

### 2: Learn to code

  * Designers have different concerns that developers and HTML/CSS/JavaScript doesn't do a good job
     of letting them focus on their concerns.
  * Asking designers to learn to code is like asking architects to model their buildings
    using steel and concrete. The map-territory relation is important. Designers
    need abstract models to express their designs. By having many models which focus
    on different aspects of a product we can then synthesize them into a single whole
    during construction. Examples:

    * Interaction model
      * What input is required by the user?
      * What actions does the computer take in response?
      * Concepts:
        * affordance
        * mental models
        * interface metaphors
    * Graphic design model
      * Where color, typefaces, layout, and media come together to create the
        look and feel of a product
      * Concepts:
        * Color theory
        * Typography
        * Composition & Layout
    * Threat model
      *



## Understanding OML components

# Syntax

OML is a markup language and borrows heavily from HTML. In addition to elements
and attributes OML introduces blocks, expressions and attribute states as three additional concepts.
It also extends attributes to support any valid JSON data structure instead of just
strings.

The goal is for anyone familiar with basic HTML syntax to be able to pick up OML easily.

An example OML component:

```html
1. <orion>
2.   <component => name: "World">
3.     <text content="Hello, {name}" />
4.   </component>
5. </orion>
```
Let's break it down line-by-line:

1. All OML components start with the `<orion>` element
2. The `<component>` element declares a block with a block parameter with a default Values
3. The `<text>` element declares some text with a content attribute. The `{name}` argument
   looks up in the current block and it's value is placed into the text content. Internally we use
   [ICU Message Syntax](https://formatjs.io/guides/message-syntax/).


When compiled with the orion compiler:

```bash
orion compile HelloWorld.oml > HelloWorld.js
```

We can then import the output .js file as an ES2015 module and use it:

```JavaScript
import Hello from 'hello.js';

const h = new Hello(document.body);

h.set({ name: 'Cameron' });

h.unmount();
```

## Elements

Elements in OML are similar to their html counterparts. They have the following characteristics:

### tag name

```html
<orion></orion>
```

### zero or more attributes

```html
<orion attribute="value"></orion>
```

### zero or one block definitions

```html
<orion => blockParameter></orion>
```

### closing tag or self-closing

```html
<orion />
```

Built-in OML elements have a `lowercase` tag name. Components can also be used
directly in OML and use `CamelCase` tag names.

## JSON Attributes

OML uses JSON attributes instead of simply strings:

### booleans

```html
<orion awesome></orion>
```

### numbers

```html
<orion count=10></orion>
```

### strings

* Must use double-quote

```html
<orion name="Orion Markup Language"></orion>
```

### arrays

* List Items can be any valid JSON value

```html
<orion foods=["Pizza", "Smoothies", "Curry"]></orion>
```

### objects

* Object keys must be valid JSON strings

```html
<orion contacts={"key": "value", "key2": "value2"}></orion>
```

### whitespace

* whitespace is ignored in JSON Values

```html
<orion
  awesome
  count=10
  name="Orion Markup Language"
  foods=[
    "Pizza",
    "Smoothies",
    "Curry"
  ]
  contacts={
    "key": "value",
    "key2": "value2"
  }>
</orion>
```

## Blocks

Blocks allow you to declare block parameters from an element and use them in
child elements. This feature is inspired by Ruby blocks, and JavaScript
anonymous functions.

```html
1. <orion => Alert>
2.   <component => label>
3.     <Alert label={label} />
4.   </component>
5. </orion>
```

Let's break it down line-by-line:

1. `<orion>` element declares a block with `Alert` block paramter. This allows
   this OML component to use <Alert> internally (which is another OML component)
2. `<component>` element declares a block with `label` block parameter
3. `<Alert>` element is used and creates an expression binding the label defined
   in the `<component>` block to it's label attribute.

### Default Values

Block parameters can have default values. These values are applied if no value
or undefined is passed.

```html
1. <orion>
2.  <component => name: "World", happy: true>
3.    Hello {name} <text value="!" value.happy="!!!" />
4.   </component>
5. </orion>
```

Let's break it down line-by-line:

2. `<component>` element declares a block with `name` and `happy` parameters.
   `name` has a default value of `"World"` and `happy` has a default value of `true`.
3. The name and happy parameters are used in an expression and an attribute state.

## Expressions

### Attribute States

### Include & Exclude

# Design Language

## Attribute Scales

## Type Checking

# Standard Element Library

## structural elements

### orion

### component

### condition

### interaction

### list

### slot

## drawable elements

### container

### text

### image


## Examples

### Tesla Media Player

![tesla media player](http://static2.businessinsider.com/image/57e3f04bb0ef975f148b7510-1200/the-media-player-for-example-has-been-redesigned-to-put-your-favorite-content-at-the-center-of-the-screen-to-give-the-user-easier-access.jpg)

```html
<orion>
  <component => icons, onPressIcon>
    <container orient="horizontal" gap=2>
      <collection items={icons} => icon>
        <interaction onPress={onPressIcon} payload={icon} => pressed>
          <image src={icon.src} width=30 height=30
            opacity.pressed=30 width.pressed=40 height.pressed=40 />
        </interaction>
      </collection>
    </container>
  </component>
</orion>
```

// ProfileView
```html
<orion>
  <component => loading, error, data>
    <label excludeFrom={data} text.loading="Loading" text.error={error} color.error="red" />
    <container includeIn={data} orient="vertical">
      <text>{data.name}</text>
      <text>{data.email}</text>
    </container>
  </component>
</orion>
```

