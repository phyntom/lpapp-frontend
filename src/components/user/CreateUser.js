import React, { Component } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Icon,
  Divider,
  Typography,
  Row,
  Col
} from 'antd';
import { inject, observer } from 'mobx-react';

const { Option } = Select;

@inject('userStore', 'bankStore')
@observer
class CreateUserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.userId
    };
  }
  componentDidMount() {
    this.props.bankStore.fetchBanks();
    this.props.userStore.getAllRoles();
    let users = this.props.userStore.users;
    if (users.length > 0) {
      let selectedUser = this.props.userStore.users.filter(
        user => user.userId === this.state.id
      )[0];
      this.props.form.setFieldsValue({
        username: selectedUser.username,
        email: selectedUser.email,
        bank: selectedUser.bank.bankId,
        role: selectedUser.roles.map(role => role.roleId) //roles.map(role => role.roleId)
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let user = {
          username: values.username,
          password: values.password,
          email: values.email,
          roles: values.role.map(v => ({ roleId: v })),
          bank: {
            bankId: values.bank
          }
        };
        this.props.userStore.addUser(user);
        this.props.history.push('/listUsers');
      }
    });
  };

  handleReset = event => {
    event.preventDefault();
    this.props.form.resetFields();
    this.props.userStore.setState('initial');
  };

  renderHeader() {
    let id = parseInt(this.state.id);
    if (id === -1) {
      return (
        <Typography.Title level={3}>
          <Icon type='user-add' />
          <Divider type='vertical' />
          Create User
        </Typography.Title>
      );
    } else {
      return (
        <Typography.Title level={3}>
          <Icon type='edit' />
          <Divider type='vertical' />
          Edit User
        </Typography.Title>
      );
    }
  }

  comparePassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const config = {
      rules: [{ required: true, message: 'Please enter a value' }]
    };
    const { roles } = this.props.userStore;
    const banks = this.props.bankStore.banks;
    return (
      <div>
        {this.renderHeader()}
        <section className='code-box-demo'>
          <Form layout='vertical' onSubmit={this.handleSubmit}>
            <Form.Item label='Username' hasFeedback>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter username'
                  }
                ]
              })(
                <Input
                  autoComplete={'username'}
                  placeholder='Enter the username'
                />
              )}
            </Form.Item>
            <Form.Item label='Password' hasFeedback>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your password!'
                  }
                ]
              })(
                <Input.Password
                  autoComplete='current-password'
                  placeholder='Enter the password'
                />
              )}
            </Form.Item>
            <Form.Item label='Confirm Password' hasFeedback>
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: 'Please confirm your password!'
                  },
                  {
                    validator: this.comparePassword
                  }
                ]
              })(
                <Input.Password placeholder='Enter the same password to confirm' />
              )}
            </Form.Item>
            <Form.Item label='Email' hasFeedback>
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid e-mail !!'
                  },
                  {
                    required: true,
                    message: 'Enter the user email'
                  }
                ]
              })(<Input placeholder='Enter the user email' />)}
            </Form.Item>
            <Form.Item label='Bank' hasFeedback>
              {getFieldDecorator('bank', config)(
                <Select
                  placeholder='Select a option and change input text above'
                  onChange={this.handleSelectChange}
                >
                  {banks.map((bank, index) => {
                    return (
                      <Option key={bank.bankId} value={bank.bankId}>
                        {bank.bankName}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
            <Form.Item label='Roles' hasFeedback>
              {getFieldDecorator('role', {
                // initialValue : 1,
                rules: [{ required: true, message: 'Please enter a value' }]
              })(
                <Select
                  mode='multiple'
                  placeholder='Select a option and change input text above'
                  onChange={this.handleSelectChange}
                >
                  {roles.map((role, index) => {
                    return (
                      <Option key={index} value={role.roleId}>
                        {role.roleName}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type='primary' htmlType='submit'>
                  Save
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                  Clear
                </Button>
              </Col>
            </Row>
          </Form>
        </section>
      </div>
    );
  }
}

const CreateUser = Form.create({ name: 'createUser' })(CreateUserForm);

export default CreateUser;
