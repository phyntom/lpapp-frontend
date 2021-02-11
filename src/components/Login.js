import React, { Component } from 'react';
import AuthService from '../api/AuthService';
import { Form, Icon, Input, Button, Checkbox, Row, Col, Card, Divider } from 'antd';
import FeedBack from '../util/FeedBack';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  handlerLogin = (event) => {
    event.preventDefault();
    this.props.form.validateFields((error, values) => {
      if (!error) {
        AuthService.authenticate(values.username, values.password)
          .then((response) => {
            const jwtToken = response.data.token;
            const user = response.data.user;
            if (jwtToken) {
              AuthService.storeAccessToken(jwtToken);
              AuthService.storeLoggedInUser(user);
              this.props.history.replace('/singlePolicy');
            }
          })
          .catch((error) => {
            if (error.message === 'Network Error') {
              FeedBack.triggerMessage('error', `Failed to login | Error : ${error.message}`, 3000);
            } else {
              FeedBack.triggerMessage('error', `Invalid usernane or password | Error : ${error.message}`, 3000);
            }
          });
      }
    });
  };

  validate = (values) => {
    let errors = {};
    if (!values.username) {
      errors.username = 'username is required';
    }
    if (!values.password) {
      errors.password = 'password is required';
    }
    return errors;
  };

  render() {
    let { username, password } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <div style={{ paddingTop: '30px' }}>
        <Row>
          <Col xs={24} sm={{ span: 18, offset: 3 }} md={{ span: 8, offset: 8 }}>
            <Card title='Login' actions={[<Icon type='login' />]}>
              <Form onSubmit={this.handlerLogin} className='login-form'>
                <Form.Item label='Username'>
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: 'Please input your username!' }]
                  })(<Input prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='Username' />)}
                </Form.Item>
                <Form.Item label='Password'>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your Password!' }]
                  })(<Input prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='Password' />)}
                </Form.Item>
                <Form.Item>
                  <Button type='primary' htmlType='submit' className='login-form-button'>
                    Log in
                  </Button>
                  <Divider type='vertical' />
                  <a className='login-form-forgot' href=''>
                    Forgot password ? Contact the administrator
                  </a>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create({ name: 'normal_login' })(Login);
