import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
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

storiesOf('GlobalNav', module).addWithJSX('without any children', () => (
  <GlobalNav sideNavOpen={true}>
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
      <TopNav />
      <SubNav />
      <Slot>
        <p>Hello world!</p>
      </Slot>
    </Container>
  </GlobalNav>
));
