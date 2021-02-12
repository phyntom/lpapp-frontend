import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { MDBContainer, MDBRow, MDBCol } from 'mdbreact';
import Form, { GroupItem, SimpleItem, RequiredRule, ButtonItem } from 'devextreme-react/form';
import FeedBack from '../../util/FeedBack';
import BankService from '../../api/BankService';

@inject('bankStore')
@observer
class CreateBank extends Component {
   constructor(props) {
      super(props);
      this.state = {
         formTitle: 'Add Bank',
         showColon: true,
         labelLocation: 'top',
         minColWidth: 300,
         colCount: 1,
         mode: 'insert',
      };
      this.buttonOpts = {
         text: 'Save',
         type: 'success',
         useSubmitBehavior: true,
         // onClick: this.onSave
      };
   }

   componentDidMount() {}

   componentWillUnmount() {
      const { bankStore } = this.props;
      bankStore.reset();
   }

   onFieldDataChanged = (o) => {};

   onFormSubmit = (event) => {
      event.preventDefault();
      const { bankStore } = this.props;
      const { bank } = bankStore;
      if (this.state.mode === 'insert') {
         BankService.createBank(bank)
            .then((response) => {
               this.props.history.push('/viewBanks');
            })
            .catch((error) => {
               console.log(error.response);
               if (!error.response) {
                  FeedBack.triggerMessage(
                     'error',
                     `Error while fetcing banks | Reason ${error.message}`,
                     1000
                  );
               } else {
                  FeedBack.triggerMessage(
                     'error',
                     `Bank not created successfully | Reason ${error.response.data.message}`,
                     3000
                  );
                  bankStore.reset();
               }
            });
      } else {
         bankStore.updateBank(bank);
         this.props.history.push('/viewBanks');
      }
   };

   onSave = (e) => {
      var dxFormInstance = e.element;
      console.log(dxFormInstance);

      // if (this.state.mode === 'insert') {
      //   BankService.createBank(bank)
      //     .then((response) => {
      //       this.props.history.push('/viewBanks');
      //     })
      //     .catch((error) => {
      //       FeedBack.triggerMessage('error', `Bank not created successfully | Reason ${error.message}`, 3000);
      //     });
      // } else {
      //   bankStore.updateBank(bank);
      //   this.props.history.push('/viewBanks');
      // }
   };

   render() {
      const { bankStore } = this.props;
      const { showColon, labelLocation, minColWidth, colCount } = this.state;
      return (
         <MDBContainer>
            <MDBRow center gutters='2'>
               <MDBCol md='6'>
                  <form onSubmit={this.onFormSubmit}>
                     <Form
                        id={'form'}
                        formData={bankStore.bank}
                        showColonAfterLabel={showColon}
                        labelLocation={labelLocation}
                        minColWidth={minColWidth}
                        colCount={colCount}
                     >
                        <GroupItem caption={'Bank Details'}>
                           <SimpleItem dataField={'bankName'} editorType={'dxTextBox'}>
                              <RequiredRule message={'Bank Name is required'} />
                           </SimpleItem>
                           <SimpleItem dataField={'maxSumInsured'} editorType={'dxTextBox'}>
                              <RequiredRule message={'Maximum sum insured is required'} />
                           </SimpleItem>
                           <SimpleItem
                              dataField={'discount'}
                              caption={'Discount'}
                              editorType={'dxTextBox'}
                           >
                              <RequiredRule message={'Discount is required'} />
                           </SimpleItem>
                        </GroupItem>
                        <ButtonItem horizontalAlignment={'left'} buttonOptions={this.buttonOpts} />
                     </Form>
                  </form>
               </MDBCol>
            </MDBRow>
         </MDBContainer>
      );
   }
}
export default CreateBank;
