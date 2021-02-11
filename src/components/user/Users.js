import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import {
  FlexboxGrid,
  Schema,
  Table,
  Button,
  Modal,
  Divider,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  SelectPicker,
  CheckPicker,
  HelpBlock
} from 'rsuite';
const { Column, HeaderCell, Cell } = Table;

@inject('userStore', 'bankStore')
@observer
class ListUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      passwordDisabled: false,
      modelTitle: 'Create User',
      userId: -1,
      formValue: {
        username: '',
        email: '',
        password: '',
        verifyPassword: '',
        bank: {},
        roles: []
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }

  close = event => {
    this.setState(prevState => {
      return {
        show: false,
        modelTitle: 'Create User',
        formValue: {}
      };
    });
  };
  open = () => {
    this.setState({ show: true });
  };

  handleCreate = () => {
    this.open();
    this.setState(prevState => {
      return {
        passwordDisabled: false,
        modelTitle: 'Create User',
        formValue: {}
      };
    });
  };

  handleEdit = record => () => {
    this.open();
    let currentUser = record;
    currentUser.verifyPassword = record.password;
    currentUser.roles = record.roles.map(role => role);
    this.setState({
      formValue: currentUser,
      modelTitle: 'Edit User',
      passwordDisabled: true,
      userId: currentUser.userId
    });
  };

  handleOk = () => {
    const { formValue, userId } = this.state;
    if (!this.form.check()) {
      console.log(this.state.formError);
      return;
    }
    if (userId !== -1) {
      let user = formValue;
      user.userId = userId;
      console.log(user);
      this.props.userStore.editUser(user);
      this.close();
    } else if (userId === -1) {
      this.props.userStore.createUser(formValue);
      this.close();
    }
  };

  handleCancel = event => {
    event.preventDefault();
    this.close();
  };

  handleChange(value) {
    this.setState(prevState => {
      return { formValue: value };
    });
  }

  componentDidMount() {
    this.props.userStore.getAllUsers();
    this.props.userStore.getAllRoles();
    this.props.bankStore.fetchBanks();
  }

  render() {
    let data = this.props.userStore.users;
    let banks = this.props.bankStore.banks;
    let roles = this.props.userStore.roles;
    const { formValue, modelTitle } = this.state;
    return (
      <>
        <FlexboxGrid justify='center'>
          <FlexboxGrid.Item colspan={18} md={18} sm={20} xs={24}>
            <Button color='green' onClick={this.handleCreate}>
              Add User
            </Button>
            <div className='code-view-wrapper'>
              <Table data={data} height={450}>
                <Column resizable={true}>
                  <HeaderCell>User ID</HeaderCell>
                  <Cell dataKey='userId' />
                </Column>
                <Column resizable={true} sortable={true}>
                  <HeaderCell>Username</HeaderCell>
                  <Cell dataKey='username' />
                </Column>
                <Column resizable={true} width={200}>
                  <HeaderCell>Email</HeaderCell>
                  <Cell dataKey='email' />
                </Column>
                <Column resizable={true} sortable={true}>
                  <HeaderCell>Bank</HeaderCell>
                  <Cell dataKey='bank.bankName' />
                </Column>
                <Column resizable={true} sortable={true} width={200}>
                  <HeaderCell>Roles</HeaderCell>
                  <Cell dataKey='roles'>
                    {(rowData, index) => {
                      return (
                        <span key={index}>
                          {rowData.roles.map((role, index) => (
                            <span key={index}>{role.roleName}</span>
                          ))}
                        </span>
                      );
                    }}
                  </Cell>
                </Column>
                <Column resizable={true} width={200}>
                  <HeaderCell>Created On</HeaderCell>
                  <Cell dataKey='createdAt' />
                </Column>
                <Column width={150} fixed='right'>
                  <HeaderCell>Action</HeaderCell>
                  <Cell>
                    {rowData => {
                      return (
                        <span>
                          <Button
                            color='blue'
                            size='sm'
                            appearance='link'
                            onClick={this.handleEdit(rowData)}
                          >
                            Edit
                          </Button>
                          <Divider vertical />
                          <Button color='red' appearance='link' size='sm'>
                            Delete
                          </Button>
                        </span>
                      );
                    }}
                  </Cell>
                </Column>
              </Table>
            </div>
          </FlexboxGrid.Item>
        </FlexboxGrid>
        <Modal show={this.state.show} backdrop={true} onHide={this.close}>
          <Modal.Header>
            <Modal.Title>{modelTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              model={model}
              ref={ref => (this.form = ref)}
              onChange={this.handleChange}
              formValue={formValue}
              onCheck={formError => {
                this.setState({ formError });
              }}
              layout='horizontal'
            >
              <FormGroup>
                <ControlLabel>Username</ControlLabel>
                <FormControl name='username' type='text' />
                <HelpBlock tooltip>This field is required</HelpBlock>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Email</ControlLabel>
                <FormControl
                  name='email'
                  // onChange={this.change}
                  // value={formValue.email}
                  type='email'
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Password</ControlLabel>
                <FormControl
                  name='password'
                  // onChange={this.change}
                  // value={formValue.password}
                  type='password'
                  disabled={this.state.passwordDisabled}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Verify Password</ControlLabel>
                <FormControl
                  name='verifyPassword'
                  // value={formValue.verifyPassword}
                  // onChange={this.change}
                  type='password'
                  disabled={this.state.passwordDisabled}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Bank Name</ControlLabel>
                <FormControl
                  name='bank'
                  // onChange={this.change}
                  value={formValue.bank}
                  accepter={SelectPicker}
                  data={banks.map(data => {
                    return {
                      label: data.bankName,
                      value: data
                    };
                  })}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Role</ControlLabel>
                <FormControl
                  name='roles'
                  value={formValue.roles}
                  accepter={CheckPicker}
                  data={roles.map((role, index) => {
                    return {
                      label: role.roleName,
                      value: role
                    };
                  })}
                />
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleOk} appearance='primary'>
              Ok
            </Button>
            <Button
              onClick={event => this.handleCancel(event)}
              appearance='subtle'
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
const { StringType, ObjectType, ArrayType } = Schema.Types;
const model = Schema.Model({
  username: StringType().isRequired('This field is required.'),
  email: StringType()
    .isRequired('This field is required')
    .isEmail('Please enter a valid email address.'),
  password: StringType().isRequired('This field is required'),
  verifyPassword: StringType()
    .addRule((value, data) => {
      if (value !== data.password) {
        return false;
      }
      return true;
    }, 'The two passwords do not match')
    .isRequired('This field is required.'),
  roles: ArrayType().isRequired('The role field is required'),
  bank: ObjectType().isRequired('The bank field is required')
});

export default ListUsers;
