import React from 'react';
import { storiesOf, action } from '@storybook/react';
import { select, boolean } from '@storybook/addon-knobs';

import GlobalNav from './GlobalNav';

const SideNav = GlobalNav.SideNav;
const SectionList = GlobalNav.SideNav.SectionList;
const Section = GlobalNav.SideNav.SectionList.Item;
const Group = GlobalNav.SideNav.SectionList.Item.Group;
const Item = GlobalNav.SideNav.SectionList.Item.Group.Item;
const Container = GlobalNav.Container;
const TopNav = GlobalNav.Container.TopNav;
const SubNav = GlobalNav.Container.SubNav;
const Slot = GlobalNav.Container.Slot;

import logo from '../../../bim-logo.png';

storiesOf('GlobalNav', module)
  .addWithInfo(
    'content taller than sidebar',
    ``,
    () => {
      const width = select('Breakpoints', [320, 768, 1280, 1680], 320);
      const sideNavOpen = boolean('sideNavOpen', false);

      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            overflow: 'auto'
          }}
        >
          <div style={{ width }}>
            <GlobalNav sideNavOpen={sideNavOpen}>
              <SideNav>
                <SectionList>
                  <Section headerLabel="Project" headerName="ThunderStorm">
                    <Group>
                      <Item icon="project-management" title="Item 1" link="#" />
                    </Group>
                  </Section>
                  <Section>
                    <Group>
                      <Item icon="project-management" title="Section 2" />
                    </Group>
                  </Section>
                </SectionList>
              </SideNav>
              <Container>
                <TopNav logo={logo} />
                <SubNav
                  moduleIndicatorName="Documents Library"
                  moduleIndicatorIcon="hamburger"
                />
                <Slot>
                  <p>Hello world!</p>
                  <p>Hello world!</p>
                  <p>Hello world!</p>
                  <p>Hello world!</p>
                  <p>Hello world!</p>
                  <p>Hello world!</p>
                  <p>Hello world!</p>
                  <p>Hello world!</p>
                </Slot>
              </Container>
            </GlobalNav>
          </div>
        </div>
      );
    },
    {
      propTables: [GlobalNav]
    }
  )
  .add('sidebar taller than content', () => {
    const width = select('Breakpoints', [320, 768, 1280, 1680], 320);
    const sideNavOpen = boolean('sideNavOpen', false);

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'auto'
        }}
      >
        <div style={{ width }}>
          <GlobalNav sideNavOpen={sideNavOpen}>
            <SideNav>
              <SectionList>
                <Section headerLabel="Project" headerName="ThunderStorm">
                  <Group>
                    <Item icon="project-management" title="Item 1" link="#" />
                    <Item icon="project-management" title="Item 2" link="#" />
                    <Item icon="project-management" title="Item 3" link="#" />
                  </Group>
                  <Group>
                    <Item icon="project-management" title="Item 4" link="#" />
                  </Group>
                </Section>
                <Section>
                  <Group>
                    <Item icon="project-management" title="Section 2" />
                  </Group>
                </Section>
              </SectionList>
            </SideNav>
            <Container>
              <TopNav logo={logo} />
              <SubNav
                moduleIndicatorName="Documents Library"
                moduleIndicatorIcon="hamburger"
              />
              <Slot>
                <p>Hello world!</p>
              </Slot>
            </Container>
          </GlobalNav>
        </div>
      </div>
    );
  });
