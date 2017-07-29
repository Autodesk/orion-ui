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
import React from 'react';
import ReactDOM from 'react-dom';
import { GlobalNav, FilterableSideNav } from './react-hig';

import 'hig.web/dist/hig.css';
import './index.css';

import logo from './images/bim-logo.png';
import profileImage from './images/profileImage.png';

const links = [
  { title: 'Autodesk Main', url: 'http://www.autodesk.com' },
  {
    title: 'AutoCAD',
    url: 'https://www.autodesk.com/products/autocad/overview'
  },
  { title: 'Maya', url: 'https://www.autodesk.com/products/maya/overview' }
];

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      sideNavOpen: true,
      query: '',
      items: {
        sections: [
          {
            headerLabel: 'Project',
            headerName: 'Oakwood Medical Center',
            groups: [
              {
                modules: [
                  {
                    icon: 'insight',
                    label: 'Insight',
                    submodules: [
                      {
                        label: 'Overview',
                        contentImage: 'content/Oakwood__Insight__Overview@2x.png'
                      },
                      {
                        label: 'Risk',
                        contentImage: 'content/Oakwood__Insight__Risk@2x.png'
                      },
                      {
                        label: 'Quality',
                        contentImage: 'content/Oakwood__Insight__Quality@2x.png'
                      },
                      {
                        label: 'Reports',
                        contentImage: 'content/Oakwood__Insight__Reports@2x.png'
                      }
                    ]
                  }
                ]
              },
              {
                // end group 1
                modules: [
                  {
                    icon: 'construction-management',
                    label: 'Authoring Collaboration',
                    submodules: [
                      {
                        label: 'Cloud Work Sharing',
                        contentImage: 'content/Oakwood__AuthoringCollaboration__CloudWorkSharing@2x.png'
                      },
                      {
                        label: 'Fluent',
                        contentImage: 'content/Oakwood__AuthoringCollaboration__Fluent@2x.png'
                      },
                      {
                        label: 'Approvals',
                        contentImage: 'content/Oakwood__AuthoringCollaboration__Approvals@2x.png'
                      }
                    ]
                  },
                  {
                    icon: 'document-management',
                    label: 'Document Management',
                    submodules: [
                      {
                        type: 'submodule',
                        label: 'Document Workflow',
                        contentImage: 'content/Oakwood__DocumentManagement__DocumentWorkflow@2x.png'
                      }
                    ]
                  },
                  {
                    icon: 'placeholder',
                    label: 'Model Coordination',
                    submodules: [
                      {
                        label: 'Overview',
                        contentImage: 'content/Oakwood__ModelCoordination__Overview@2x.png'
                      },
                      {
                        label: 'Models',
                        contentImage: 'content/Oakwood__ModelCoordination__Models@2x.png'
                      },
                      {
                        label: 'Checklists',
                        contentImage: 'content/Oakwood__ModelCoordination__Checklists@2x.png'
                      },
                      {
                        label: 'Clashes',
                        contentImage: 'content/Oakwood__ModelCoordination__Clashes@2x.png'
                      },
                      {
                        label: 'Issues',
                        contentImage: 'content/Oakwood__ModelCoordination__Issues@2x.png'
                      }
                    ]
                  },
                  {
                    icon: 'project-management',
                    label: 'Project Management',
                    submodules: [
                      {
                        label: 'RFIs',
                        contentImage: 'content/Oakwood__ProjectManagement__RFIs@2x.png'
                      },
                      {
                        label: 'Submittals',
                        contentImage: 'content/Oakwood__ProjectManagement__Submittals@2x.png'
                      },
                      {
                        label: 'Daily Log',
                        contentImage: 'content/Oakwood__ProjectManagement__DailyLog@2x.png'
                      }
                    ]
                  },
                  {
                    icon: 'quantities',
                    label: 'Quantities',
                    submodules: [
                      {
                        label: '2D',
                        contentImage: 'content/Oakwood__Quantities__2D@2x.png'
                      },
                      {
                        label: '3D',
                        contentImage: 'content/Oakwood__Quantities__3D@2x.png'
                      }
                    ]
                  },
                  {
                    icon: 'cost-control',
                    label: 'Cost Control',
                    submodules: [
                      {
                        label: 'Bid Management',
                        contentImage: 'content/Oakwood__CostControl__BidManagement@2x.png'
                      },
                      {
                        label: 'Estimating',
                        contentImage: 'content/Oakwood__CostControl__Estimating@2x.png'
                      },
                      {
                        label: 'Budget',
                        contentImage: 'content/Oakwood__CostControl__Budget@2x.png'
                      },
                      {
                        label: 'Change Orders',
                        contentImage: 'content/Oakwood__CostControl__ChangeOrders@2x.png'
                      },
                      {
                        label: 'Pay Applications',
                        contentImage: 'content/Oakwood__CostControl__PayApplications@2x.png'
                      }
                    ]
                  },
                  {
                    icon: 'schedule',
                    label: 'Schedule',
                    submodules: [
                      {
                        label: 'Master Schedule',
                        contentImage: 'content/Oakwood__Schedule__MasterSchedule@2x.png'
                      },
                      {
                        label: 'Production Plan',
                        contentImage: 'content/Oakwood__Schedule__ProductionPlan@2x.png'
                      }
                    ]
                  },
                  {
                    icon: 'field',
                    label: 'Field',
                    submodules: [
                      {
                        label: 'Quality',
                        contentImage: 'content/Oakwood__Field__Quality@2x.png'
                      },
                      {
                        label: 'Safety',
                        contentImage: 'content/Oakwood__Field__Safety@2x.png'
                      },
                      {
                        label: 'Commissioning',
                        contentImage: 'content/Oakwood__Field__Commissioning@2x.png'
                      },
                      {
                        label: 'Checklists',
                        contentImage: 'content/Oakwood__Field__Checklists@2x.png'
                      },
                      {
                        label: 'Issues',
                        contentImage: 'content/Oakwood__Field__Issues@2x.png'
                      },
                      {
                        label: 'Activities',
                        contentImage: 'content/Oakwood__Field__Activities@2x.png'
                      }
                    ]
                  },
                  {
                    icon: 'layout',
                    label: 'Layout',
                    contentImage: 'content/Oakwood__Layout@2x.png',
                    submodules: []
                  },
                  {
                    icon: 'buildingops',
                    label: 'Building Ops',
                    contentImage: 'content/Oakwood__BuildingOps@2x.png',
                    submodules: []
                  }
                ]
              },
              {
                // end group 2
                modules: [
                  {
                    icon: 'library',
                    label: 'Library',
                    contentImage: 'content/Oakwood__Library@2x.png',
                    submodules: []
                  },
                  {
                    icon: 'photos',
                    label: 'Photos',
                    contentImage: 'content/Oakwood__Photos@2x.png',
                    submodules: []
                  },
                  {
                    icon: 'assets',
                    label: 'Assets',
                    contentImage: 'content/Oakwood__Assets@2x.png',
                    submodules: []
                  },
                  {
                    icon: 'locations',
                    label: 'Location',
                    contentImage: 'content/Oakwood__Locations@2x.png',
                    submodules: []
                  }
                ]
              },
              {
                // end group 3
                modules: [
                  {
                    icon: 'project-admin',
                    label: 'Project Admin',
                    contentImage: 'content/Oakwood__ProjectAdmin@2x.png',
                    submodules: []
                  }
                ]
              }
            ]
          },
          {
            // end section 1
            headerLabel: 'Account',
            hedaerName: 'Global Construction',
            groups: [
              {
                modules: [
                  {
                    icon: 'insight',
                    label: 'Insight',
                    contentImage: 'content/GlobalConstruction__Insight@2x.png',
                    submodules: []
                  },
                  {
                    icon: 'field',
                    label: 'Field',
                    submodules: [
                      {
                        label: 'Checklists Templates',
                        contentImage: 'content/GlobalConstruction__Field__ChecklistsTemplates@2x.png'
                      },
                      {
                        label: 'Issues Templates',
                        contentImage: 'content/GlobalConstruction__Field__IssuesTemplates@2x.png'
                      }
                    ]
                  },
                  {
                    icon: 'account-admin',
                    label: 'Account Admin',
                    submodules: [
                      {
                        label: 'Projects',
                        contentImage: 'content/GlobalConstruction__AccountAdmin__Projects@2x.png'
                      },
                      {
                        label: 'Members',
                        contentImage: 'content/GlobalConstruction__AccountAdmin__Members@2x.png'
                      },
                      {
                        label: 'Companies',
                        contentImage: 'content/GlobalConstruction__AccountAdmin__Companies@2x.png'
                      },
                      {
                        label: 'Services',
                        contentImage: 'content/GlobalConstruction__AccountAdmin__Services@2x.png'
                      },
                      {
                        label: 'Analytics',
                        contentImage: 'content/GlobalConstruction__AccountAdmin__Analytics@2x.png'
                      },
                      {
                        label: 'Settings',
                        contentImage: 'content/GlobalConstruction__AccountAdmin__Settings@2x.png'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        links: [
          { title: 'Autodesk Main', url: 'http://www.autodesk.com' },
          {
            title: 'AutoCAD',
            url: 'https://www.autodesk.com/products/autocad/overview'
          },
          {
            title: 'Maya',
            url: 'https://www.autodesk.com/products/maya/overview'
          }
        ]
      }
    };
  }

  toggleSidenav = () => {
    this.setState({ sideNavOpen: !this.state.sideNavOpen });
  };

  render() {
    return (
      <GlobalNav sideNavOpen={this.state.sideNavOpen}>
        <FilterableSideNav items={this.state.items} />
      </GlobalNav>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
