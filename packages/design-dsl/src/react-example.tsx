/**
 * Boilerplate
 */
const React = { Component: class { public state: any; constructor(props: any) { }; setState(state: any) { } } };
function fetch(url: string): Promise<any> { return Promise.resolve(); };
function Orion() { };

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
    <Orion src="assets/components/profile-view.orn"
      loading={this.state.loading}
      error={this.state.error}
      data={this.state.data}
      onVisit={this.handleVisit} />
  }
}

// profile-view.orn source
const profileView = `
<orion => error-box, anchor>
  <component => loading, data, error, onVisit>
    <condition visible={error}>
      <error-box>{error}</error-box>
    </condition>
    <condition visible={data}>
      <container orient="vertical">
        <text size=3>{data.name}</text>
        <text size=2>{data.bio}</text>
        <anchor onClick={onVisit} detail={data.urlValue}>
          {data.urlName}
        </anchor>
      </container>
    </condition>
  </component>
</orion>
`

// error-box.orn
const ErrorBox = `
<orion>
  <component>
    <container orient="vertical">
      <text size=3><slot /></text>
    </container>
  </component>
 </orion>
`;

// anchor.orn
const Anchor = `
<orion>
  <component => detail, onClick>
    <interaction onClick={onClick} detail={detail}>
      <slot />
    </interaction>
  </component>
</orion>
`;
