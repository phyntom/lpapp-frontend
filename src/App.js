import React, { Component } from 'react';
import Login from './components/Login';
import Logout from './components/Logout';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import CreateBank from './components/bank/CreateBank';
import ViewBanks from './components/bank/ViewBanks';
import ListUsers from './components/user/Users';
import ViewIndividualPolicies from './components/policy/individual/ViewIndividualPolicies';
import ViewGroupPolicies from './components/policy/group/ViewGroupPolicies';
import IndividualPolicy from './components/policy/individual/IndividualPolicy';
import GroupPolicy from './components/policy/group/GroupPolicy';
import AuthenticatedRoute from './util/AuthenticatedRoute';
import ErrorComponent from './components/ErrorComponent';
import CreateUser from './components/user/CreateUser';
import AuthService from './api/AuthService';
import Dashboard from './components/dashboard/Dashboard';
import GroupPolicyTemplate from './components/policy/group/GroupPolicyTemplate';
import IndivPolicyTemplate from './components/policy/individual/IndivPolicyTemplate';
import CreateBranch from './components/branch/CreateBranch';
import ViewBranches from './components/branch/ViewBranches';
import { Container, Header, Content, Nav, Navbar, Dropdown, Icon } from 'rsuite';
import 'devextreme-intl';
// import 'moment/locale/fr';
import GroupSalesReport from './components/reports/GroupSalesReport';
import IndivSalesReport from './components/reports/IndivSalesReport';

class App extends Component {
   componentDidMount() {
      this.user = JSON.parse(AuthService.getLoggedInUser());
   }

   componentWillUnmount() {
      console.log('....component unmounted');
   }

   handleSelect = (eventKey) => {
      switch (eventKey) {
         case 'logout':
            AuthService.removeLoggedInUser();
            this.props.history.replace('/login');
            break;
         case 'home':
            break;
         case 'banks':
            this.props.history.push('/banks');
            break;
         case 'viewBanks':
            this.props.history.push('/viewBanks');
            break;
         case 'users':
            this.props.history.push('/listUsers');
            break;
         case 'indivPolicy':
            this.props.history.push('/singlePolicy');
            break;
         case 'groupPolicy':
            this.props.history.push('/groupPolicy/-1');
            break;
         case 'listIndivPolicies':
            this.props.history.push('/viewIndivPolicies');
            break;
         case 'listGroupPolicy':
            this.props.history.push('/viewGroupPolicies');
            break;
         case 'createBranch':
            this.props.history.push('/createBranch');
            break;
         case 'viewBranches':
            this.props.history.push('/viewBranches');
            break;
         case 'viewIndivReports':
            this.props.history.push('/viewIndivReports');
            break;
         case 'viewGroupReports':
            this.props.history.push('/viewGroupReports');
            break;
         default:
            break;
      }
   };

   isAllowed = (user) => {
      if (user) {
         return user.roles.filter((role) => role.roleName === 'ADMIN').length > 0;
      } else {
         return false;
      }
   };

   render() {
      const isLoggedIn = AuthService.isLoggedIn();
      const user = JSON.parse(AuthService.getLoggedInUser());
      console.log(this.isAllowed(user));
      return (
         <React.Fragment>
            <Container>
               <Header>
                  <Navbar>
                     <Navbar.Header>{/*<a className="navbar-brand logo">BRAND</a>*/}</Navbar.Header>
                     <Navbar.Body>
                        <Nav onSelect={this.handleSelect}>
                           {isLoggedIn && (
                              <Nav.Item eventKey='home' icon={<Icon icon='home' />}>
                                 Home
                              </Nav.Item>
                           )}
                           {isLoggedIn && (
                              <Dropdown title='Policy'>
                                 <Dropdown.Item eventKey='indivPolicy'>
                                    Individual Policies
                                 </Dropdown.Item>
                                 <Dropdown.Item eventKey='groupPolicy'>
                                    Group Policies
                                 </Dropdown.Item>
                                 <Dropdown.Item eventKey='listIndivPolicies'>
                                    View Individual Policies
                                 </Dropdown.Item>
                                 <Dropdown.Item eventKey='listGroupPolicy'>
                                    View Group Policies
                                 </Dropdown.Item>
                              </Dropdown>
                           )}
                        </Nav>
                        <Nav onSelect={this.handleSelect} pullRight>
                           {isLoggedIn && <Nav.Item>Change Password</Nav.Item>}
                           {isLoggedIn && <Nav.Item eventKey='logout'>Logout</Nav.Item>}
                           {this.isAllowed(user) && (
                              <Dropdown title='Settings'>
                                 <Dropdown.Item eventKey='banks'>Create Banks</Dropdown.Item>
                                 <Dropdown.Item eventKey='viewBanks'>View Banks</Dropdown.Item>
                                 <Dropdown.Item eventKey='users'>Create Users</Dropdown.Item>
                              </Dropdown>
                           )}
                           {this.isAllowed(user) && (
                              <Dropdown title='Branches'>
                                 <Dropdown.Item eventKey='createBranch'>
                                    Create Branch
                                 </Dropdown.Item>
                                 <Dropdown.Item eventKey='viewBranches'>
                                    View Branches
                                 </Dropdown.Item>
                              </Dropdown>
                           )}
                           {this.isAllowed(user) && (
                              <Dropdown title='Reports'>
                                 <Dropdown.Item eventKey='viewIndivReports'>
                                    Individual Reports
                                 </Dropdown.Item>
                                 <Dropdown.Item eventKey='viewGroupReports'>
                                    Group Reports
                                 </Dropdown.Item>
                              </Dropdown>
                           )}
                        </Nav>
                     </Navbar.Body>
                  </Navbar>
               </Header>
               <Container>
                  <Content style={{ paddingTop: '10px', background: '#fff' }}>
                     <Switch>
                        <Route path='/login' component={Login} />
                        <Route path='/' exact component={Login} />
                        <Route path='/logout' component={Logout} />
                        <AuthenticatedRoute path='/dashboard' component={Dashboard} />
                        <AuthenticatedRoute path='/singlePolicy' component={IndividualPolicy} />
                        <AuthenticatedRoute path='/groupPolicy/:policyId' component={GroupPolicy} />
                        <AuthenticatedRoute
                           path='/viewGroupPolicies'
                           component={ViewGroupPolicies}
                        />
                        <AuthenticatedRoute path='/banks' component={CreateBank} />
                        <AuthenticatedRoute path='/viewBanks' component={ViewBanks} />
                        <AuthenticatedRoute
                           path='/viewIndivPolicies'
                           component={ViewIndividualPolicies}
                        />
                        <AuthenticatedRoute path='/listUsers' component={ListUsers} />
                        <AuthenticatedRoute
                           path='/groupPolicyTemplate'
                           component={GroupPolicyTemplate}
                        />
                        <AuthenticatedRoute
                           path='/indivPolicyTemplate'
                           component={IndivPolicyTemplate}
                        />
                        <AuthenticatedRoute path='/createUser/:id' component={CreateUser} />
                        <AuthenticatedRoute path='/createBranch' component={CreateBranch} />
                        <AuthenticatedRoute path='/viewBranches' component={ViewBranches} />
                        <AuthenticatedRoute path='/viewBranches' component={ViewBranches} />
                        <AuthenticatedRoute path='/viewGroupReports' component={GroupSalesReport} />
                        <AuthenticatedRoute path='/viewIndivReports' component={IndivSalesReport} />
                        <Route path='/not-found' component={ErrorComponent} />
                        <Redirect to='/not-found' />
                     </Switch>
                  </Content>
               </Container>
            </Container>
         </React.Fragment>
      );
   }
}

export default withRouter(App);
