import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  MDBContainer,
  MDBCard,
  MDBRow,
  MDBCol,
  MDBCardTitle,
  MDBCardText
} from 'mdbreact';
import Form, {
  GroupItem,
  SimpleItem,
  RequiredRule,
  ButtonItem
} from 'devextreme-react/form';
import notify from 'devextreme/ui/notify';
import UtilDataService from '../../api/UtilDataService';

@inject('branchStore', 'bankStore')
@observer
class BranchComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showColon: true,
      labelLocation: 'top',
      minColWidth: 300,
      colCount: 1,
      banks: [],
      provinces: [],
      districts: [],
      filteredDistricts: []
    };
  }
  async componentDidMount() {
    const { bankStore } = this.props;
    bankStore.fetchBanks();
    this.setState(currentState => {
      currentState.banks = bankStore.banks;
    });
    try {
      const responseProvinces = await UtilDataService.fetchProvinces();
      // const responseDistricts = await UtilDataService.fetchDistricts();
      const dataProvinces = await responseProvinces.data;
      // const dataDistricts = await responseDistricts.data;
      this.setState({ provinces: dataProvinces });
    } catch (Error) {
      console.error('Cannot get list of provinces');
    }
    try {
      const responseDistricts = await UtilDataService.fetchDistricts();
      const dataDistricts = await responseDistricts.data;
      // console.log(dataDistricts);
      this.setState({ districts: dataDistricts });
    } catch (Error) {
      console.error('Cannot get list of provinces');
    }
  }

  onFieldDataChanged = o => {
    if (o.dataField === 'province') {
      this.filterDistrictByProvince(o.value.provinceId);
    }
  };

  filterDistrictByProvince = key => {
    let newDistricts = [];
    newDistricts = this.state.districts.filter(district => {
      if (district.province.provinceId === key) {
        return district;
      }
    });
    this.setState({ filteredDistricts: newDistricts });
  };

  onFormSubmit = e => {
    e.preventDefault();
    const { branchStore } = this.props;
    branchStore.addBranch(branchStore.branch);
    notify(
      {
        message: 'You have submitted the form',
        position: {
          my: 'center top',
          at: 'center top'
        }
      },
      'success',
      3000
    );
    this.props.history.push('/viewBranches');
  };

  render() {
    const { branchStore, bankStore } = this.props;
    const {
      showColon,
      labelLocation,
      minColWidth,
      colCount,
      provinces,
      filteredDistricts
    } = this.state;
    return (
      <MDBContainer>
        <MDBCard className='card-body'>
          <MDBCardTitle>Branch</MDBCardTitle>
          <MDBCardText>
            <MDBRow center gutters='2'>
              <MDBCol md='6'>
                <form onSubmit={this.onFormSubmit}>
                  <Form
                    id={'form'}
                    formData={branchStore.branch}
                    showColonAfterLabel={showColon}
                    labelLocation={labelLocation}
                    minColWidth={minColWidth}
                    colCount={colCount}
                    onFieldDataChanged={this.onFieldDataChanged}
                  >
                    <GroupItem caption={'Branch Details'}>
                      <SimpleItem
                        dataField={'branchName'}
                        editorType={'dxTextBox'}
                      >
                        <RequiredRule message={'Brach Name is required'} />
                      </SimpleItem>
                      <SimpleItem
                        dataField={'bank'}
                        editorType={'dxSelectBox'}
                        editorOptions={{
                          dataSource: bankStore.banks,
                          valueExpr: 'this',
                          displayExpr: 'bankName'
                        }}
                      >
                        <RequiredRule message={'Bank name is required'} />
                      </SimpleItem>
                    </GroupItem>
                    <GroupItem caption={'Branch Location'}>
                      <SimpleItem
                        dataField={'province'}
                        editorType={'dxSelectBox'}
                        editorOptions={{
                          dataSource: provinces,
                          valueExpr: 'this',
                          displayExpr: 'provinceName'
                        }}
                      >
                        <RequiredRule
                          message={'Branch Province loacation is required'}
                        />
                      </SimpleItem>
                      <SimpleItem
                        dataField={'district'}
                        editorType={'dxSelectBox'}
                        editorOptions={{
                          dataSource: filteredDistricts,
                          valueExpr: 'this',
                          displayExpr: 'districtName'
                        }}
                      >
                        <RequiredRule
                          message={'District location is required'}
                        />
                      </SimpleItem>
                    </GroupItem>
                    <ButtonItem
                      horizontalAlignment={'left'}
                      buttonOptions={{
                        text: 'Save',
                        type: 'success',
                        useSubmitBehavior: true
                      }}
                    />
                  </Form>
                </form>
              </MDBCol>
            </MDBRow>
          </MDBCardText>
        </MDBCard>
      </MDBContainer>
    );
  }
}

export default BranchComponent;
