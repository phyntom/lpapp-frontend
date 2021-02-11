import React, { Component } from 'react';
import { MDBContainer } from 'mdbreact';
import DataGrid, { Column, MasterDetail, SearchPanel,Paging, Pager, Lookup } from 'devextreme-react/data-grid';
import { inject, observer } from 'mobx-react';
import DataSource from 'devextreme/data/data_source';
import DetailGroupPolicy from './DetailGroupPolicy';
import ReactToPrint from 'react-to-print';
import { Button } from 'devextreme-react/button';
import GroupPolicyTemplate from './GroupPolicyTemplate';
import { monthOptions } from '../../../data/Months';

@inject('groupPolicyStore')
@observer
class ViewGroupPolicies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPrintSection: false,
      selectedRowPolicy: {},
      show: false
    };
    this.dataSource = '';
    this.props.groupPolicyStore.getPolicies();
  }

  componentDidMount() {
    const { groupPolicyStore } = this.props;
    this.dataSource = new DataSource({
      store: groupPolicyStore.policies
    });
  }

  onSelectionChanged = ({ selectedRowsData }) => {
    const data = selectedRowsData[0];
    this.setState({
      showPrintSection: !!data,
      selectedRowPolicy: data
    });
  };

  // onRowClick = (object) => {
  //   console.log(this.state.showPrintSection);
  //   if (this.state.showPrintSection) {
  //     let dataGrid = object.component;
  //     let keys = dataGrid.getSelectedRowKeys();
  //     console.log(keys);
  //     //   let keys = dataGrid.getSelectedRowKeys();
  //     // dataGrid.deselectRows(keys);
  //     // this.setState({ showPrintSection: false });
  //   }
  // };

  onCancelPrint = () => {
    this.setState({ showPrintSection: false });
  };

  onEdit = () => {
    let policyId = this.state.selectedRowPolicy.policyId;
    this.props.history.push(`/groupPolicy/${policyId}`);
  };

  formatDate = (dateToFormat) => {
    return new Intl.DateTimeFormat('en-GB').format(dateToFormat);
  };

  sortedCustomerPolicies=(customerPolicies)=>{
   return customerPolicies.sort((customerPolicyIndexOne,customerPolicyIndexTwo)=> (customerPolicyIndexOne.customerPolicyId > customerPolicyIndexTwo.customerPolicyId) ? 1 : -1);
  }

  render() {
    const { groupPolicyStore } = this.props;
    return (
      <MDBContainer>
        <section className={'section-preview'}>
          {/* <MDBRow> */}
          <DataGrid dataSource={groupPolicyStore.policies} keyExpr={'policyId'} 
          allowColumnResizing={true} showBorders={true} 
          hoverStateEnabled={true} selection={{ mode: 'single' }} onSelectionChanged={this.onSelectionChanged}>
            <Paging defaultPageSize={5} />
            <Pager showPageSizeSelector={true} allowedPageSizes={[5, 10, 20, 30]} />
            {/* <Editing mode={'form'} allowUpdating={true} /> */}
            <SearchPanel visible={true} width={240} placeholder={'Search...'} />
            <Column dataField={'policyId'} width={75} sortOrder={'desc'} sortIndex={0} allowSorting={true} dataType={'string'} allowEditing={false} />
            <Column dataField={'entityName'} dataType={'string'} allowEditing={false} />
            <Column dataField={'policyNumber'} width={185} dataType={'string'} allowEditing={false} />
            <Column dataField={'startDate'} dataType={'date'} format={'dd/MM/yyyy'} />
            <Column dataField={'duration'} width={75}>
              <Lookup dataSource={monthOptions} valueExpr={'key'} displayExpr={'value'} />
            </Column>
            <Column dataField={'endDate'} dataType={'date'} format={'dd/MM/yyyy'} allowEditing={false} />
            <Column dataField={'sumInsured'} dataType={'number'} />
            <Column dataField={'createdOn'} dataType={'date'}  format={'dd/MM/yyyy'} allowEditing={false} />
            <MasterDetail enabled={true} component={DetailGroupPolicy} />
          </DataGrid>
          {this.state.showPrintSection && (
            <div id={'employee-info'}>
              <hr />
              <article className='article'>
                <h5 className='article__title'>Policy Number : {this.state.selectedRowPolicy.policyNumber}</h5>
                <div className='article__content'>
                  <div className='alert-success'>
                    <ul>
                      <li>Start Date: {this.formatDate(this.state.selectedRowPolicy.startDate)}</li>
                      <li>End Date : {this.formatDate(this.state.selectedRowPolicy.endDate)}</li>
                      <li>
                        Members
                        {this.sortedCustomerPolicies(this.state.selectedRowPolicy.customerPolicies).map((customerPolicy, index) => {
                          return (
                            <ul key={index}>
                              <li>
                                <span>
                                  Customer Names : {customerPolicy.customer.firstName} {customerPolicy.customer.lastName}
                                </span>
                                <span>
                                  {' | '}Date of Birth : {this.formatDate(customerPolicy.customer.birthDate)}
                                </span>
                                <span>
                                  {' | '}Rate : {customerPolicy.rate}
                                </span>
                                <span>
                                  {' | '}Net Premium: {customerPolicy.netPremium}
                                </span>
                              </li>
                              <hr />
                            </ul>
                          );
                        })}
                      </li>

                      {/* <li>
                        Customer Names :{' '}
                        {
                          this.state.selectedRowPolicy.customerPolicies[0]
                            .customer.firstName
                        }{' '}
                        {
                          this.state.selectedRowPolicy.customerPolicies[0]
                            .customer.lastName
                        }
                      </li>
                       */}
                    </ul>
                  </div>
                </div>
              </article>
              <div>
                <ReactToPrint trigger={() => <Button width={120} text={'Print'} type={'success'} className={'dx-button-custom'} stylingMode={'contained'} useSubmitBehavior={false} />} content={(el) => this.templateRef} />
                &nbsp;
                <Button width={120} text={'Edit'} type={'success'} className={'dx-button-custom'} stylingMode={'contained'} useSubmitBehavior={false} onClick={this.onEdit} />
                &nbsp;
                <Button
                  width={120}
                  text={'Cancel'}
                  // type={'success'}
                  className={'dx-button-custom'}
                  stylingMode={'contained'}
                  useSubmitBehavior={false}
                  onClick={this.onCancelPrint}
                />
              </div>
              <div style={{ display: 'none' }}>
                <GroupPolicyTemplate ref={(el) => (this.templateRef = el)} policy={this.state.selectedRowPolicy} />
              </div>
            </div>
          )}
          {/* </MDBRow> */}
        </section>
      </MDBContainer>
    );
  }
}

export default ViewGroupPolicies;
