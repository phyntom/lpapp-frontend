import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardTitle, MDBCardText } from 'mdbreact';
import DataGrid, { Column, SearchPanel, Editing, Paging, Pager } from 'devextreme-react/data-grid';
import { inject, observer } from 'mobx-react';
import DataSource from 'devextreme/data/data_source';

@inject('branchStore', 'bankStore')
@observer
class ViewBranches extends Component {
   componentDidMount() {
      const { branchStore } = this.props;
      branchStore.fetchBranches();
   }
   render() {
      const { branchStore } = this.props;
      this.dataSource = new DataSource({
         store: branchStore.branches,
         reshapeOnPush: true,
      });
      console.log(branchStore.branches);
      return (
         <div>
            <MDBContainer>
               <MDBRow center gutters='2'>
                  <MDBCol md='10'>
                     <MDBCard className='card-body' style={{ marginTop: '1rem' }}>
                        <MDBCardTitle>View / Edit Branch</MDBCardTitle>
                        <MDBCardText>
                           <DataGrid
                              dataSource={this.dataSource}
                              showBorders={true}
                              columnAutoWidth={true}
                              hoverStateEnabled={true}
                              selection={{ mode: 'single' }}
                           >
                              <Paging defaultPageSize={10} />
                              <Pager
                                 showPageSizeSelector={true}
                                 allowedPageSizes={[5, 10, 20, 30, 40, 50]}
                              />
                              <SearchPanel visible={true} width={240} placeholder={'Search...'} />
                              <Editing mode={'form'} allowUpdating={true} />
                              <Column
                                 dataField={'branchId'}
                                 dataType={'number'}
                                 allowEditing={false}
                              />
                              <Column
                                 dataField={'branchName'}
                                 dataType={'string'}
                                 allowEditing={true}
                              />
                              <Column
                                 caption={'Province'}
                                 dataField={'province.provinceName'}
                                 dataType={'string'}
                                 allowEditing={true}
                              />
                              <Column
                                 caption={'District'}
                                 dataField={'district.districtName'}
                                 dataType={'string'}
                                 allowEditing={true}
                              />
                              <Column
                                 caption={'Created By'}
                                 dataField={'createdBy.username'}
                                 dataType={'string'}
                                 allowEditing={false}
                              />
                           </DataGrid>
                        </MDBCardText>
                     </MDBCard>
                  </MDBCol>
               </MDBRow>
            </MDBContainer>
         </div>
      );
   }
}

export default ViewBranches;
