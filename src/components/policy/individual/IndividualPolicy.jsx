import React, {Component} from 'react';
import {monthOptions} from '../../../data/Months';
import {inject, observer} from 'mobx-react';
import {MDBContainer, MDBRow, MDBCol} from 'mdbreact';
import TextBox from 'devextreme-react/text-box';
import DateBox from 'devextreme-react/date-box';
import NumberBox from 'devextreme-react/number-box';
import SelectBox from 'devextreme-react/select-box';
import Button from 'devextreme-react/button';
import ValidationSummary from 'devextreme-react/validation-summary';
import moment from 'moment';
import {Validator, RequiredRule, EmailRule, RangeRule} from 'devextreme-react/validator';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import AuthService from './../../../api/AuthService';
import {NumericRule} from 'devextreme-react/tree-list';

@inject('individualPolicyStore', 'branchStore')
@observer
class IndividualPolicy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            formError: {}
        };
        this.minBirthDate = moment()
            .subtract(18, 'year')
            .toDate();
        this.user = JSON.parse(AuthService.getLoggedInUser());
        this.props.individualPolicyStore.initPolicy(this.user);
        this.props.branchStore.fetchBranches();
    }

    handleSearch = ({value, element}) => {
        const {individualPolicyStore} = this.props;
        let nationalId = value;
        individualPolicyStore.fetchIdentity(nationalId);
        individualPolicyStore.updatePropertyPolicy(value, 'entityId');
        individualPolicyStore.updatePropertyCustomer(value, 'customer.nationalId');
    };

    handleCustomerChange = ({element, value}) => {
        const {individualPolicyStore} = this.props;
        individualPolicyStore.updatePropertyCustomer(value, element.id);
    };

    handlePolicyChange = ({element, value}) => {
        const {individualPolicyStore} = this.props;
        if (element.id === 'duration') {
            individualPolicyStore.updateEndDate(value);
            individualPolicyStore.updateRate(individualPolicyStore.customerPolicy.customer.age, value);
            if (individualPolicyStore.policy.sumInsured) {
                individualPolicyStore.updatePremium(individualPolicyStore.policy.sumInsured);
            }
        }
        if (element.id === 'sumInsured') {
            individualPolicyStore.updatePremium(value);
        }
        individualPolicyStore.updatePropertyPolicy(value, element.id);
    };

    onFormSubmit = (e) => {
        e.preventDefault();
        const {individualPolicyStore} = this.props;
        let customerPolicy = individualPolicyStore.customerPolicy;
        let policy = individualPolicyStore.policy;
        individualPolicyStore.saveIndividualPolicy(policy, customerPolicy);
        this.props.history.push('/viewIndivPolicies');
    };

    componentDidMount() {
    }

    componentWillUnmount() {
        const {individualPolicyStore} = this.props;
        individualPolicyStore.reset();
    }

    render() {
        const {customerPolicy, policy} = this.props.individualPolicyStore;
        const {branches} = this.props.branchStore;
        this.data = new ArrayStore({
            data: branches,
            key: 'branchId'
        });
        this.dataSource = new DataSource({
            store: this.data,
            reshapeOnPush: true
        });
        const canEdit = this.user.roles.filter((role) => role.roleName === 'ADMIN').length > 0;
        return (
            <MDBContainer>
                <section className={'section-preview'}>
                    <form onSubmit={this.onFormSubmit}>
                        <MDBRow>
                            <MDBCol md='4'>
                                <div className={'dx-field'}>
                                    <div className={'dx-field-label'}>National Id</div>
                                    <div className={'dx-field-value'}>
                                        <TextBox id='customer.nationalId' value={customerPolicy.customer.nationalId}
                                                 stylingMode={'outlined'} width={'100%'} placeholder={'National Id'}
                                                 onValueChanged={this.handleSearch} valueChangeEvent='change'>
                                            <Validator>
                                                <RequiredRule message={'National Id is required'}/>
                                            </Validator>
                                        </TextBox>
                                    </div>
                                </div>
                            </MDBCol>
                            <MDBCol md='4'>
                                <div className={'dx-field'}>
                                    <div className={'dx-field-label'}>Entity Id</div>
                                    <div className={'dx-field-value'}>
                                        <TextBox id='entityId' value={policy.entityId} width={'100%'}
                                                 placeholder={'Entity Identification'}
                                                 onValueChanged={this.handlePolicyChange} valueChangeEvent='change'
                                                 readOnly>
                                            <Validator>
                                                <RequiredRule message={'Entity Id is required'}/>
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
                                            onValueChanged={this.handlePolicyChange}
                                            valueChangeEvent='change'
                                            readOnly={!canEdit}
                                        >
                                            <Validator>
                                                <RequiredRule message={'Branch is required'}/>
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
                                        {/*min={new Date()}*/}
                                        <DateBox id='startDate' name='startDate' value={policy.startDate}
                                                 defaultValue={new Date()} format={'dd/MM/yyyy'}
                                                 displayFormat={'dd/MM/yyyy'} width={'100%'} placeholder={'Start Date'}
                                                 onValueChanged={this.handlePolicyChange} valueChangeEvent='change'>
                                            <Validator>
                                                <RequiredRule message={'Start Date is required'}/>
                                            </Validator>
                                        </DateBox>
                                    </div>
                                </div>
                            </MDBCol>
                            <MDBCol md='4'>
                                <div className={'dx-field'}>
                                    <div className={'dx-field-label'}>Duration</div>
                                    <div className={'dx-field-value'}>
                                        <SelectBox id='duration' name='duration' value={policy.duration}
                                                   dataSource={monthOptions} displayExpr={'text'} valueExpr={'value'}
                                                   width={'100%'} placeholder={'Duration in months'}
                                                   onValueChanged={this.handlePolicyChange} valueChangeEvent='change'>
                                            <Validator>
                                                <RequiredRule message={'Duration is required'}/>
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
                                            readOnly
                                            // stylingMode={this.state.stylingMode}
                                            displayFormat={'dd/MM/yyyy'}
                                            min={this.minEndDate}
                                            width={'100%'}
                                            placeholder={'End Date'}
                                            onValueChanged={this.handlePolicyChange}
                                            valueChangeEvent='change'
                                        />
                                    </div>
                                </div>
                            </MDBCol>
                        </MDBRow>
                        <MDBRow>
                            <MDBCol md='6'>
                                <div className='dx-field'>
                                    <div className='dx-field-label'>Sum Insured</div>
                                    <div className='dx-field-value'>
                                        <NumberBox id='sumInsured' width={'100%'} value={policy.sumInsured}
                                                   placeholder='Sum Insured' onValueChanged={this.handlePolicyChange}
                                                   valueChangeEvent='input'>
                                            <Validator>
                                                <RequiredRule message={'Sum insured is required'}/>
                                                <NumericRule ignoreEmptyValue={false}
                                                             message={'Value must be a number'}/>
                                            </Validator>
                                        </NumberBox>
                                    </div>
                                </div>
                            </MDBCol>
                            <MDBCol md='6'>
                                <div className='dx-field'>
                                    <div className='dx-field-label'>Rate</div>
                                    <div className='dx-field-value'>
                                        <NumberBox id='rate' width={'100%'} value={customerPolicy.rate}
                                                   placeholder='Rate' onValueChanged={this.handleValueChanged}
                                                   valueChangeEvent='change' readOnly>
                                            <Validator>
                                                <RequiredRule message={'Rate is required'}/>
                                            </Validator>
                                        </NumberBox>
                                    </div>
                                </div>
                            </MDBCol>
                        </MDBRow>
                        <hr/>
                        <MDBRow>
                            <MDBCol md='4'>
                                <div className='dx-field'>
                                    <div className='dx-field-label'>First name</div>
                                    <div className='dx-field-value'>
                                        <TextBox id='customer.firstName' width={'100%'}
                                                 value={customerPolicy.customer.firstName} placeholder='Enter Firstname'
                                                 onValueChanged={this.handleCustomerChange} valueChangeEvent='change'>
                                            <Validator>
                                                <RequiredRule message={'First name is required'}/>
                                            </Validator>
                                        </TextBox>
                                    </div>
                                </div>
                            </MDBCol>
                            <MDBCol md='4'>
                                <div className='dx-field'>
                                    <div className='dx-field-label'>Last name</div>
                                    <div className='dx-field-value'>
                                        <TextBox id='customer.lastName' width={'100%'}
                                                 value={customerPolicy.customer.lastName} placeholder='Enter Lastname'
                                                 onValueChanged={this.handleCustomerChange} valueChangeEvent='change'>
                                            <Validator>
                                                <RequiredRule message={'Last name is required'}/>
                                            </Validator>
                                        </TextBox>
                                    </div>
                                </div>
                            </MDBCol>
                            <MDBCol md='4'>
                                <div className='dx-field'>
                                    <div className='dx-field-label'>Gender</div>
                                    <div className='dx-field-value'>
                                        <SelectBox id='customer.gender' value={customerPolicy.customer.gender}
                                                   dataSource={genders} displayExpr={'value'} valueExpr={'keyId'}
                                                   defaultValue={genders[0].keyId}
                                                   onValueChanged={this.handleCustomerChange}>
                                            <Validator>
                                                <RequiredRule message={'Gender is required'}/>
                                            </Validator>
                                        </SelectBox>
                                    </div>
                                </div>
                            </MDBCol>
                        </MDBRow>
                        <MDBRow>
                            <MDBCol md='4'>
                                <div className={'dx-field'}>
                                    <div className={'dx-field-label'}>Birth Date</div>
                                    <div className={'dx-field-value'}>
                                        <DateBox id='customer.birthDate' value={customerPolicy.customer.birthDate}
                                                 displayFormat={'dd/MM/yyyy'} min={this.minEndDate} width={'100%'}
                                                 placeholder={'End Date'} onValueChanged={this.handleCustomerChange}
                                                 valueChangeEvent='change'>
                                            <Validator>
                                                <RangeRule max={this.minBirthDate}
                                                           message={'You must be at least 18 years old'}/>
                                            </Validator>
                                        </DateBox>
                                    </div>
                                </div>
                            </MDBCol>
                            <MDBCol md='4'>
                                <div className='dx-field'>
                                    <div className='dx-field-label'>Age</div>
                                    <div className='dx-field-value'>
                                        <NumberBox id='customer.age' width={'100%'} value={customerPolicy.customer.age}
                                                   placeholder='Age' onValueChanged={this.handleCustomerChange}
                                                   valueChangeEvent='change' readOnly/>
                                    </div>
                                </div>
                            </MDBCol>
                            <MDBCol md='4'>
                                <div className='dx-field'>
                                    <div className='dx-field-label'>Spouse</div>
                                    <div className='dx-field-value'>
                                        <TextBox id='customer.spouse' width={'100%'}
                                                 value={customerPolicy.customer.spouse} placeholder='Spouse'
                                                 onValueChanged={this.handleCustomerChange} valueChangeEvent='change'/>
                                    </div>
                                </div>
                            </MDBCol>
                        </MDBRow>
                        <MDBRow>
                            <MDBCol>
                                <div className='dx-field'>
                                    <div className='dx-field-label'>Net Premium</div>
                                    <div className='dx-field-value'>
                                        <NumberBox id='netPremium' defaultValue={0} width={'100%'}
                                                   value={customerPolicy.netPremium} placeholder='Net Premium'
                                                   onValueChanged={this.handleCustomerChange} valueChangeEvent='change'
                                                   readOnly/>
                                    </div>
                                </div>
                            </MDBCol>
                            <MDBCol>
                                <div className='dx-field'>
                                    <div className='dx-field-label'>Accessory Fees</div>
                                    <div className='dx-field-value'>
                                        <NumberBox id='accessories' width={'100%'} value={customerPolicy.accessories}
                                                   placeholder='Accessory Fees'
                                                   onValueChanged={this.handleCustomerChange}
                                                   valueChangeEvent='change'/>
                                    </div>
                                </div>
                            </MDBCol>
                            <MDBCol>
                                <div className='dx-field'>
                                    <div className='dx-field-label'>Total Premium</div>
                                    <div className='dx-field-value'>
                                        <NumberBox min={1000} id='totalPremium' value={customerPolicy.totalPremium}
                                                   width={'100%'} placeholder='Total Payable Premium'
                                                   onValueChanged={this.handleCustomerChange} valueChangeEvent='change'
                                                   readOnly>
                                            <Validator>
                                                <RequiredRule message={'Total premium is required'}/>
                                            </Validator>
                                            ([1-9][0-9]*)
                                        </NumberBox>
                                    </div>
                                </div>
                            </MDBCol>
                        </MDBRow>
                        <MDBRow>
                            <MDBCol>
                                <div className='dx-field'>
                                    <div className='dx-field-label'>Phone number</div>
                                    <div className='dx-field-value'>
                                        <TextBox id='customer.phoneNumber' width={'100%'}
                                                 value={customerPolicy.customer.phoneNumber} placeholder='Phone number'
                                                 onValueChanged={this.handleCustomerChange} valueChangeEvent='change'>
                                            <Validator>
                                                <RequiredRule message={'Phone number is required'}/>
                                            </Validator>
                                        </TextBox>
                                    </div>
                                </div>
                            </MDBCol>
                            <MDBCol>
                                <div className='dx-field'>
                                    <div className='dx-field-label'>Email</div>
                                    <div className='dx-field-value'>
                                        <TextBox id='customer.email' width={'100%'}
                                                 value={customerPolicy.customer.email} placeholder=''
                                                 onValueChanged={this.handleCustomerChange} valueChangeEvent='change'>
                                            <Validator>
                                                <EmailRule message={'Valid email is required'}/>
                                            </Validator>
                                        </TextBox>
                                    </div>
                                </div>
                            </MDBCol>
                        </MDBRow>
                        <div className={'dx-fieldset'}>
                            <ValidationSummary id={'summary'}></ValidationSummary>
                            <Button id={'button'} className={'dx-button-custom'} text={'Save'} type={'success'}
                                    useSubmitBehavior={true}/>
                        </div>
                    </form>
                </section>
            </MDBContainer>
        );
    }
}

const genders = [
    {
        keyId: 'M',
        value: 'Male'
    },
    {
        keyId: 'F',
        value: 'Female'
    }
];

export default IndividualPolicy;
