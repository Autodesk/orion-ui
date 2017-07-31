import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SideNav from '../../../adapters/GlobalNav/SideNav/SideNavAdapter';

const LinkList = SideNav.LinkList;
const Link = SideNav.LinkList.Link;
const Search = SideNav.Search;
const SectionList = SideNav.SectionList;
const Section = SideNav.SectionList.Section;
const SectionCollapse = SideNav.SectionList.Section.SectionCollapse;
const Group = SideNav.SectionList.Section.Group;
const Module = SideNav.SectionList.Section.Group.Module;
const ModuleCollapse = SideNav.SectionList.Section.Group.Module.ModuleCollapse;
const Submodule = SideNav.SectionList.Section.Group.Module.Submodule;

export default class FilterableSideNav extends Component {
  static propTypes = {
    query: PropTypes.string,
    items: PropTypes.shape({
      links: PropTypes.arrayOf(PropTypes.object),
      sections: PropTypes.arrayOf(
        PropTypes.shape({
          headerLabel: PropTypes.string,
          headerName: PropTypes.string,
          groups: PropTypes.arrayOf(
            PropTypes.shape({
              modules: PropTypes.arrayOf(
                PropTypes.shape({
                  submodules: PropTypes.arrayOf(PropTypes.object)
                })
              )
            })
          )
        })
      )
    }).isRequired
  };

  render() {
    return (
      <SideNav>
        <SectionList>
          {this.props.items.sections.map(section => {
            return (
              <Section
                {...section}
                key={`${section.headerLabel}-${section.headerName}`}
              >
                <SectionCollapse />
                {section.groups.map((group, i) => {
                  return (
                    <Group key={i}>
                      {group.modules.map(module => {
                        return (
                          <Module
                            icon={module.icon}
                            contentImage={module.contentImage}
                            title={module.label}
                            key={module.label}
                          >
                            <ModuleCollapse />
                            {module.submodules.map(submodule => {
                              return (
                                <Submodule
                                  title={submodule.label}
                                  link="#"
                                  key={submodule.label}
                                />
                              );
                            })}
                          </Module>
                        );
                      })}
                    </Group>
                  );
                })}
              </Section>
            );
          })}
        </SectionList>
        <LinkList>
          {this.props.items.links.map((link, i) => {
            return <Link {...link} key={link.title} />;
          })}
        </LinkList>
      </SideNav>
    );
  }
}
