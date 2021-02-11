import React, {Component} from 'react';
import {
    Divider,
    Icon,
    Table,
    Typography,
    Button,
    Spin,
    Modal,
    Form,
    Input,
    InputNumber,
    Select
} from 'antd';
// import {MDBContainer, MDBTable,MDBTableHead,MDBTableBody,MDBBtn} from 'mdbreact';
import {inject, observer} from 'mobx-react';

const {Option} = Select;

@inject('bankStore')
@observer
class Banks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            id: -1
        };
    }

    componentDidMount() {
        this.props.bankStore.fetchBanks();
    }

    showModal = () => {
        this.setState({
            visible: true
        });
    };

    handleCreate = event => {
        this.props.form.resetFields();
        this.showModal();
    };

    handleEdit = record => event => {
        event.preventDefault();
        this.props.form.setFieldsValue({
            bankName: record.bankName,
            bankType: record.bankType,
            maxSumInsured: record.maxSumInsured,
            discount: record.discount
        });
        this.showModal();
        this.setState((prevState, props) => {
            return {id: record.bankId};
        });
    };

    handleOk = id => event => {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.state.id === -1) {
                    let bank = {
                        bankName: values.bankName.toUpperCase(),
                        bankType: values.bankType.toUpperCase(),
                        maxSumInsured: values.maxSumInsured,
                        discount: values.discount
                    };
                    this.props.bankStore.addBank(bank);
                } else {
                    let bank = {
                        bankId: this.state.id,
                        bankName: values.bankName.toUpperCase(),
                        bankType: values.bankType.toUpperCase(),
                        maxSumInsured: values.maxSumInsured,
                        discount: values.discount
                    };
                    this.props.bankStore.editBank(bank);
                }
                this.props.form.resetFields();
            }
            // this.props.history.push('/listBanks');
        });
        this.setState((prevState, props) => {
            return {id: -1, visible: false};
        });
    };

    handleCancel = e => {
        this.setState((prevState, props) => {
            return {id: -1, visible: false};
        });
    };

    render() {
        const columns = [
            {
                label: 'Bank ID',
                field: 'bankId',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Bank Name',
                field: 'bankName',
                sort: 'asc',
            },
            {
                label: 'Branch',
                field: 'bankType',
                sort: 'asc',
            },
            {
                label: 'Max Sum Insured',
                field: 'maxSumInsured',
                sort: 'asc',
            },
            {
                label: 'Discount',
                field: 'discount',
                sort: 'asc',
            },
            {
                label: 'Created At',
                field: 'createdOn',
                sort: 'asc',
            },
            {
                label: 'Action',
                field: 'handle',
                sort: 'asc'
            }
        ];
        const rows = this.props.bankStore.banks;
        for(let row of rows){
            row.handle=<span>Button</span>;
        }
        console.log(rows);
        const numberBank = this.props.bankStore.banks.length;
        let pending = this.props.bankStore.getPending;
        const {getFieldDecorator} = this.props.form;
        const formLayout = 'vertical';

        return (
            <>
            {/*<MDBContainer>*/}
            {/*    <Typography.Title level={3}>*/}
            {/*        <Icon type='bank'/>*/}
            {/*        <Divider type='vertical'/>*/}
            {/*        Banks | {numberBank}*/}
            {/*    </Typography.Title>*/}
            {/*    <Button type='primary' onClick={this.handleCreate}>*/}
            {/*        Add*/}
            {/*    </Button>*/}
            {/*    <MDBTable btn>*/}
            {/*        <MDBTableHead columns={columns} />*/}
            {/*        <MDBTableBody rows={rows} />*/}
            {/*    </MDBTable>*/}
                <Modal
                    iconType='question-circle'
                    title={this.state.id === -1 ? 'Create Bank' : 'Edit Bank'}
                    visible={this.state.visible}
                    onOk={this.handleOk(this.state.id)}
                    onCancel={this.handleCancel}
                >
                    <Form layout={formLayout} onSubmit={this.handleSubmit}>
                        <Form.Item label='Bank Name'>
                            {getFieldDecorator('bankName', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input the bank name'
                                    }
                                ]
                            })(<Input placeholder='Enter the bank name'/>)}
                        </Form.Item>
                        <Form.Item label='Bank Type'>
                            {getFieldDecorator('bankType', {
                                rules: [{required: true, message: 'Please select bank type!'}]
                            })(
                                <Select
                                    placeholder='Select a option and change input text above'
                                    onChange={this.handleSelectChange}
                                >
                                    <Option value='main'>Head Quarter</Option>
                                    <Option value='branch'>Branch</Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label='Sum Insured'>
                            {getFieldDecorator('maxSumInsured', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please enter max sum insured'
                                    }
                                ],
                                initialValue: '10000000'
                            })(
                                <InputNumber
                                    style={{width: 250}}
                                    max={50000000}
                                    placeholder='Enter max sum insured'
                                />
                            )}
                        </Form.Item>
                        <Form.Item label='Discount'>
                            {getFieldDecorator('discount', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please enter the discount'
                                    }
                                ],
                                initialValue: '0'
                            })(
                                <InputNumber
                                    style={{width: 250}}
                                    min={0}
                                    max={100}
                                    placeholder='Enter the bank discount'
                                />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            {/*// </MDBContainer>*/}
        </>
        );
    }
}

export default Form.create({name: 'createBank'})(Banks);

