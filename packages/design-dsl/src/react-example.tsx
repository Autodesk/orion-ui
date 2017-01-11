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
<orion => ErrorBox, Anchor>
  <component => loading, data, error, onVisit>
    <condition visible={error}>
      <ErrorBox>{error}</ErrorBox>
    </condition>
    <condition visible={data}>
      <container orient="vertical">
        <text size=3>{data.name}</text>
        <text size=2>{data.bio}</text>
        <Anchor onClick={onVisit} detail={data.urlValue}>
          {data.urlName}
        </Anchor>
      </container>
    </condition>
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
