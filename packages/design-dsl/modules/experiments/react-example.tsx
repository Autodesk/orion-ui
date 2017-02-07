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
/**
 * Boilerplate
 */
const React = { Component: class { public state: any; constructor(props: any) { }; setState(state: any) { } } };
function fetch(url: string): Promise<any> { return Promise.resolve(); };
// import {ProfileView} from './ProfileView.orn';
function ProfileView() {};

/** React Component component, akin to a Controller. */
class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    }
  }

  componentWillMount() {
    fetch('someurl').then(data => {
      this.setState({ data, loading: false });
    }).catch(error => {
      this.setState({ error, loading: false });
    });
  }

  handleVisit() {
    alert('clicked on thing');
  }

  render() {
    /**
     * Renders an Orion component just like an image passing in props
     */
    <ProfileView loading={this.state.loading}
      error={this.state.error}
      data={this.state.data}
      onVisit={this.handleVisit} />
  }
}

// ProfileView.orn source
const ProfileViewSrc = `
<!-- other component dependencies are injected via orion block -->
<orion => Anchor>
  <component => loading, error, data, onVisit>
    <!--
      if loading=truthy and error=truthy loading takes priority since
      it was defined first. The order of block parameters matters.
    -->
    <label size=3
      text="Loaded"
      text.loading="Loading"
      text.error={error} color.error="red"  />

    <!--
      include property defined on any element will make the component
    -->
    <container orient="vertical" includeIn={data}>
      <text size=3>{data.name}</text>
      <text size=2>{data.bio}</text>
      <Anchor onClick={onVisit} detail={data.urlValue}>
        {data.urlName}
      </Anchor>
    </container>
  </component>
</orion>
`
// ErrorBox.orn
const ErrorBox = `
<orion>
  <component>
    <container orient="vertical">
      <text size=3><slot /></text>
    </container>
  </component>
 </orion>
`;

// Anchor.orn
const Anchor = `
<orion>
  <component => detail, onClick>
    <interaction onClick={onClick} detail={detail}>
      <slot />
    </interaction>
  </component>
</orion>
`;
