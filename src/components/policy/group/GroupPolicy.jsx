import React from 'react';
import { MDBContainer, MDBCol, MDBRow } from 'mdbreact';
import SelectBox from 'devextreme-react/select-box';
import TextBox from 'devextreme-react/text-box';
import NumberBox from 'devextreme-react/number-box';
import DateBox from 'devextreme-react/date-box';
import Button from 'devextreme-react/button';
import moment from 'moment';
import DataGrid, { Column, Editing, Paging } from 'devextreme-react/data-grid';
import ValidationSummary from 'devextreme-react/validation-summary';
import { monthOptions } from '../../../data/Months';
import { Validator, RequiredRule, RangeRule, NumericRule, EmailRule } from 'devextreme-react/validator';
import { inject, observer } from 'mobx-react';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import AuthService from '../../../api/AuthService';

@inject('groupPolicyStore', 'branchStore')
@observer
class GroupPolicy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataGridVisible: !!this.props.groupPolicyStore.customerPolicies,
      isVisibleSaveButton: false,
      mode: 'insert'
    };
    this.dataSource = new DataSource({
      store: this.props.groupPolicyStore.customersStore,
      reshapeOnPush: true
    });
    this.minEndDate = moment(new Date())
      .add(1, 'month')
      .toDate();
    this.minBirthDate = moment(new Date())
      .subtract(18, 'year')
      .toDate();
    this.user = JSON.parse(AuthService.getLoggedInUser());
    this.props.branchStore.fetchBranches();
    this.onInitNewRow = this.onInitNewRow.bind(this);
    this.onRowUpdating = this.onRowUpdating.bind(this);
    this.onRowInserted = this.onRowInserted.bind(this);
    this.onRowUpdated = this.onRowUpdated.bind(this);
    this.onRowRemoved = this.onRowRemoved.bind(this);
    this.handleValueChanged = this.handleValueChanged.bind(this);
  }

  componentDidMount() {
    const {
      match: { params },
      groupPolicyStore
    } = this.props;
    let paramPolicyId = params.policyId;
    if (paramPolicyId > 0) {
      groupPolicyStore.selectEditPolicy(paramPolicyId);
      this.setState((prevState) => ({
        isVisibleSaveButton: groupPolicyStore.customerPolicies.length > 0 ? true : false,
        mode: 'edit'
      }));
    } else {
      groupPolicyStore.initPolicy(this.user);
      this.setState((prevState) => ({
        mode: 'insert'
      }));
    }
  }

  componentWillUnmount() {
    this.props.groupPolicyStore.reset();
  }

  onInitNewRow(object) {
    const { groupPolicyStore } = this.props;
    object.data.rowId = object.component.totalCount() + 1;
    object.data.duration = groupPolicyStore.policy.duration;
    object.data.accessories = 1000;
  }

  onRowInserted(object) {
    const { groupPolicyStore } = this.props;
    const { customer } = object.data;
    const { data } = object;
    if (customer.nationalId) {
      groupPolicyStore.fetchIdentity(customer.nationalId, data.rowId);
    }
    if (customer.birthDate) {
      customer.age = moment().year() - moment(customer.birthDate, 'DD/MM/YYYY').year();
    }
    data.customer = customer;
    // groupPolicyStore.insertCustomerPolicies(data);
    groupPolicyStore.updateCustomerPolicy(data, data.rowId);
    this.setState((prevState) => ({
      isVisibleSaveButton: groupPolicyStore.customerPolicies.length > 0 ? true : false
    }));
  }

  onRowUpdating(object) {
    const { groupPolicyStore } = this.props;
    const { customer } = object.newData;
    if (customer) {
      if (customer.nationalId) {
        groupPolicyStore.fetchIdentity(customer.nationalId, object.oldData.rowId);
      }
      if (customer.birthDate) {
        object.newData.customer.age = moment().year() - moment(customer.birthDate, 'DD/MM/YYYY').year();
      }
    }
  }

  onRowUpdated(object) {
    const { groupPolicyStore } = this.props;
    groupPolicyStore.updateCustomerPolicy(object.data, object.data.rowId);
  }

  onRowRemoved(e) {
    console.log('onRowRemove...');
    console.log(e);
  }

  selectionChanged(data) {
    this.setState({
      selectedItemKeys: data.selectedRowKeys
    });
  }

  handleValueChanged = (data) => {
    const { groupPolicyStore } = this.props;
    if (data.element.id === 'duration') {
      groupPolicyStore.changePolicyDuration(data.value);
    }
    if (data.element.id === 'entityId') {
      groupPolicyStore.changePropertyPolicy(data.value, 'entityId');
    }
    if (data.element.id === 'entityName') {
      groupPolicyStore.changePropertyPolicy(data.value, 'entityName');
    }
    if (data.element.id === 'startDate') {
      groupPolicyStore.changePropertyPolicy(data.value, 'startDate');
    }
    if (data.element.id === 'endDate') {
      groupPolicyStore.changePropertyPolicy(data.value, 'endDate');
    }
    if (data.element.id === 'sumInsured') {
      groupPolicyStore.changePropertyPolicy(data.value, 'sumInsured');
    }
    if (data.element.id === 'branch') {
      groupPolicyStore.changePropertyPolicy(data.value, 'branch');
    }
  };

  onFormSubmit = (e) => {
    e.preventDefault();
    this.setState({ dataGridVisible: true });
  };

  onSave = (e) => {
    const { policy, customerPolicies } = this.props.groupPolicyStore;
    if (this.state.mode === 'insert') {
      this.props.groupPolicyStore.addPolicy(policy, customerPolicies);
    } else {
      this.props.groupPolicyStore.updatePolicy(policy, customerPolicies);
    }
    this.props.history.push('/viewGroupPolicies');
  };

  onClear = (e) => {
    const { groupPolicyStore, history } = this.props;
    history.push('/groupPolicy/-1');
    groupPolicyStore.reset();
  };

  render() {
    const { groupPolicyStore } = this.props;
    const { policy } = groupPolicyStore;
    const { branches } = this.props.branchStore;

    const canEdit = this.user.roles.filter((role) => role.roleName === 'ADMIN').length > 0;
    this.data = new ArrayStore({
      data: branches,
      key: 'branchId'
    });
    return (
      <>
        <MDBContainer>
          <div className={'dx-fieldset'}>
            <form action={'your-action'} onSubmit={this.onFormSubmit}>
              <MDBRow>
                <MDBCol md='4'>
                  <div className={'dx-field'}>
                    <div className={'dx-field-label'}>Group Name</div>
                    <div className={'dx-field-value'}>
                      <TextBox id='entityName' value={policy.entityName} stylingMode={'outlined'} width={'100%'} placeholder={'Group name'} onValueChanged={this.handleValueChanged} valueChangeEvent='change'>
                        <Validator>
                          <RequiredRule message={'Group Name is required'} />
                        </Validator>
                      </TextBox>
                    </div>
                  </div>
                </MDBCol>
                <MDBCol md='4'>
                  <div className={'dx-field'}>
                    <div className={'dx-field-label'}>Entity TIN</div>
                    <div className={'dx-field-value'}>
                      <TextBox id='entityId' value={policy.entityId} stylingMode={'outlined'} width={'100%'} placeholder={'Entity TIN'} onValueChanged={this.handleValueChanged} valueChangeEvent='change'>
                        <Validator>
                          <RequiredRule message={'Entity TIM is required'} />
                        </Validator>
                      </TextBox>
                    </div>
                  </div>
                </MDBCol>
                <MDBCol md='4'>
                  <div className={'dx-field'}>
                    <div className={'dx-field-label'}>Branch</div>
                    <div className={'dx-field-value'}>
                    <SelectBox
                      id='branch'
                      name='branch'
                      value={policy.branch}
                      dataSource={this.data}
                      defaultValue={policy.branch}
                      displayExpr={'branchName'}
                      valueExpr={'this'}
                      width={'100%'}
                      placeholder={'User branch'}
                      onValueChanged={this.handleValueChanged}
                      valueChangeEvent='change'
                      readOnly={!canEdit}
                    >
                        <Validator>
                          <RequiredRule message={'Branch is required'} />
                        </Validator>
                      </SelectBox>
                    </div>
                  </div>
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol md='4'>
                  <div className={'dx-field'}>
                    <div className={'dx-field-label'}>Start Date</div>
                    <div className={'dx-field-value'}>
                      <DateBox id='startDate' value={policy.startDate} displayFormat={'dd/MM/yyyy'} width={'100%'} placeholder={'Start Date'} onValueChanged={this.handleValueChanged} valueChangeEvent='change'>
                        <Validator>
                          <RequiredRule message={'Start Date is required'} />
                        </Validator>
                      </DateBox>
                    </div>
                  </div>
                </MDBCol>
                <MDBCol md='4'>
                  <div className={'dx-field'}>
                    <div className={'dx-field-label'}>Duration</div>
                    <div className={'dx-field-value'}>
                      <SelectBox id='duration' name='duration' value={policy.duration} dataSource={monthOptions} displayExpr={'text'} valueExpr={'value'} width={'100%'} placeholder={'Duration in months'} onValueChanged={this.handleValueChanged} valueChangeEvent='change'>
                        <Validator>
                          <RequiredRule message={'Duration is required'} />
                        </Validator>
                      </SelectBox>
                    </div>
                  </div>
                </MDBCol>
                <MDBCol md='4'>
                  <div className={'dx-field'}>
                    <div className={'dx-field-label'}>End Date</div>
                    <div className={'dx-field-value'}>
                      <DateBox
                        id='endDate'
                        value={policy.endDate}
                        // stylingMode={this.state.stylingMode}
                        displayFormat={'dd/MM/yyyy'}
                        min={this.minEndDate}
                        width={'100%'}
                        placeholder={'End Date'}
                        onValueChanged={this.handleValueChanged}
                        valueChangeEvent='change'
                        readOnly
                      />
                    </div>
                  </div>
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol md='6'>
                  <div className='dx-field'>
                    <div className='dx-field-label'>Total Sum Insured</div>
                    <div className='dx-field-value'>
                      <NumberBox
                        id='sumInsured'
                        width={'100%'}
                        value={policy.sumInsured}
                        placeholder='Sum Insured'
                        // onValueChanged={this.handleValueChanged}
                        // valueChangeEvent='change'
                        readOnly
                      />
                    </div>
                  </div>
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol md='6'>
                  <Button
                    icon={'plus'}
                    text={'Customers'}
                    type={'success'}
                    className={'dx-button-custom'}
                    stylingMode={'contained'}
                    // onClick={this.onClick}
                    useSubmitBehavior={true}
                  />
                  &nbsp;
                  <Button width={120} text={'Save'} type={'success'} className={'dx-button-custom'} stylingMode={'contained'} disabled={!this.state.isVisibleSaveButton} onClick={this.onSave} useSubmitBehavior={false} />
                  &nbsp;
                  <Button width={120} text={'Reset'} type={'default'} className={'dx-button-custom'} stylingMode={'contained'} disabled={!this.state.isVisibleSaveButton} onClick={this.onClear} useSubmitBehavior={false} />
                </MDBCol>
              </MDBRow>
            </form>
            <ValidationSummary id={'summary'}></ValidationSummary>
          </div>
          <hr />
          <MDBRow>
            <MDBCol md='12'>
              <DataGrid
                visible={this.state.dataGridVisible}
                id={'gridContainer'}
                dataSource={groupPolicyStore.customerPolicies}
                keyExpr={'rowId'}
                showBorders={true}
                allowColumnReordering={true}
                onSelectionChanged={this.selectionChanged}
                onInitNewRow={this.onInitNewRow}
                onRowInserted={this.onRowInserted}
                onRowUpdating={this.onRowUpdating}
                onRowUpdated={this.onRowUpdated}
                onRowRemoved={this.onRowRemoved}
                columnAutoWidth={true}
              >
                <Paging enabled={true} pageSize={15} />
                <Editing mode={'row'} allowUpdating={true} allowDeleting={true} allowAdding={true} />
                <Column dataField={'rowId'} allowEditing={false} caption={'#'} width={'50'} />
                <Column dataField={'customer.nationalId'} caption={'National Id'}>
                  <RequiredRule />
                </Column>
                <Column dataField={'customer.firstName'} />
                <Column dataField={'customer.lastName'} />
                <Column dataField={'customer.birthDate'} format={'dd/MM/yyyy'} dataType={'date'}>
                  <RequiredRule message={'Date of birth is required'} />
                  <RangeRule max={this.minBirthDate} message={'You must be at least 18 years old'} />
                </Column>
                <Column dataField={'customer.age'} allowEditing={false} />
                <Column dataField={'duration'} allowEditing={false} caption={'Duration'}>
                  <Validator>
                    <RequiredRule message={'Duration is required'} />
                  </Validator>
                </Column>
                <Column dataField={'loanAmount'} caption={'Loan Amount'}>
                  <RequiredRule message={'Loan amount is required'} />
                  <NumericRule type={'numeric'} message={'Loan amount should be a number'} />
                </Column>
                <Column dataField={'rate'} allowEditing={false}>
                  <NumericRule type={'numeric'} message={'Net Premium should be a number'} />
                </Column>
                <Column dataField={'netPremium'} allowEditing={false}>
                  <NumericRule type={'numeric'} message={'Net Premium should be a number'} />
                </Column>
                <Column dataField={'customer.phoneNumber'}></Column>
                <Column dataField={'customer.email'}>
                  <EmailRule message={'Should use a valid email'} />
                </Column>
              </DataGrid>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </>
    );
  }
}
export default GroupPolicy;
