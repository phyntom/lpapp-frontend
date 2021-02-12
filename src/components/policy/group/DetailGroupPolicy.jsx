import React, { Component } from 'react';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import { inject, observer } from 'mobx-react';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';

@inject('groupPolicyStore')
@observer
class DetailGroupPolicy extends Component {
   render() {
      const key = this.props.data.key;
      let customers = this.props.groupPolicyStore.policies.find((data) => data.policyId === key)
         .customerPolicies;
      console.log(customers);

      this.dataSource = this.getCustomers(customers);
      return (
         <React.Fragment>
            <DataGrid dataSource={this.dataSource} showBorders={true} columnAutoWidth={true}>
               {/* <Column dataField={'customerPolicyId'} sortOrder={'asc'} caption={'#'} /> */}
               <Column dataField={'customerPolicyId'} caption={'#'} />
               <Column dataField={'customer.firstName'} caption={'FirstName'} />
               <Column dataField={'customer.lastName'} caption={'LastName'} dataType={'string'} />
               <Column dataField={'customer.birthDate'} caption={'Birth Date'} dataType={'date'} />
               <Column dataField={'customer.age'} caption={'Age'} />
               <Column dataField={'customer.phoneNumber'} caption={'Phone Number'} />
               <Column dataField={'netPremium'} />
               <Column dataField={'rate'} />
               <Column dataField={'accessories'} />
            </DataGrid>
         </React.Fragment>
      );
   }

   getCustomers = (customers) => {
      return new DataSource({
         store: new ArrayStore({
            data: customers,
            sort: { getter: 'customerPolicyId', desc: false },
            key: 'customerPolicyId',
         }),
      });
   };
}

export default DetailGroupPolicy;
