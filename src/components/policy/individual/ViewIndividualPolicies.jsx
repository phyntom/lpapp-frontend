import React from "react";
import { inject, observer } from "mobx-react";
import DataGrid, {
  Column,
  SearchPanel,
  Editing,
  Paging,
  Pager,
  Lookup
} from "devextreme-react/data-grid";
import { MDBContainer } from "mdbreact";
import DataSource from "devextreme/data/data_source";
import { monthOptions } from "../../../data/Months";
import { Button } from "devextreme-react/button";
import IndivPolicyTemplate from "./IndivPolicyTemplate";
import ReactToPrint from "react-to-print";
import { rateData } from "../../../data/Rate";
import moment from "moment";

@inject("individualPolicyStore")
@observer
class ViewIndividualPolicies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPrintSection: false,
      selectedRowPolicy: {},
      show: false
    };
  }

  handleCustomerChange({ element, value }) {
    const { individualPolicyStore } = this.props;
    if (element.id === "birthDate") {
      individualPolicyStore.updateAge(value);
    }
    individualPolicyStore.updatePropertyCustomer(value, element.id);
  }

  findRate = (age, duration) => {
    let rates = rateData.filter(rate => {
      return rate.age === age && parseInt(rate.periodMonth) === duration;
    });
    return rates[0].rate;
  };

  onRowUpdating = object => {
    const { oldData, newData } = object;
    if (newData.duration) {
      newData.endDate = moment(oldData.startDate)
        .add(newData.duration, "months")
        .subtract(1, "day")
        .toDate();
    }
    if (object.newData.sumInsured) {
    }
    if (object.newData.birthDate) {
      object.oldData.age =
        moment().year() - moment(object.newData.birthDate, "DD/MM/YYYY").year();
    }
  };

  onRowUpdated = object => {
    const data = object.data;
    this.props.individualPolicyStore.updatePolicy(data, data.policyId);
  };

  onSelectionChanged = ({ selectedRowsData }) => {
    const data = selectedRowsData[0];
    this.setState({ showPrintSection: !!data, selectedRowPolicy: data });
  };

  onPrint = () => {};

  onCancelPrint = () => {
    this.setState({ showPrintSection: false });
  };

  componentDidMount() {
    this.props.individualPolicyStore.getPolicies();
  }

  formatDate(dateToFormat) {
    return new Intl.DateTimeFormat("en-GB").format(dateToFormat);
  }

  render() {
    const { individualPolicyStore } = this.props;
    this.dataSource = new DataSource({
      store: individualPolicyStore.policies,
      reshapeOnPush: true
    });

    return (
      <MDBContainer>
        <section className={"section-preview"}>
          <DataGrid
            dataSource={this.dataSource}
            showBorders={true}
            columnAutoWidth={true}
            hoverStateEnabled={true}
            selection={{ mode: "single" }}
            onRowUpdated={this.onRowUpdated}
            onRowUpdating={this.onRowUpdating}
            onSelectionChanged={this.onSelectionChanged}
            onEditorPreparing={this.onEditorPreparing}
          >
            <Paging defaultPageSize={5} />
            <Pager showPageSizeSelector={true} allowedPageSizes={[5, 10, 20]} />
            <SearchPanel visible={true} width={240} placeholder={"Search..."} />
            <Editing mode={"row"} allowUpdating={true} />
            <Column dataField={"policyId"} allowEditing={false} />
            <Column
              dataField={"policyNumber"}
              dataType={"string"}
              allowEditing={false}
            />
            <Column
              caption={"Firstname"}
              dataType={"string"}
              dataField={"customerPolicies[0].customer.firstName"}
              allowEditing={false}
            />
            <Column
              caption={"Lastname"}
              dataType={"string"}
              dataField={"customerPolicies[0].customer.lastName"}
              allowEditing={false}
            />
            <Column
              dataField={"startDate"}
              allowFiltering={true}
              dataType={"date"}
              format={"dd/MM/yyyy"}
            />
            <Column dataField={"duration"}>
              <Lookup
                dataSource={monthOptions}
                valueExpr={"key"}
                displayExpr={"value"}
              />
            </Column>
            <Column
              dataField={"endDate"}
              allowFiltering={true}
              dataType={"date"}
              format={"dd/MM/yyyy"}
              allowEditing={false}
            />
            <Column
              dataField={"sumInsured"}
              dataType={"number"}
              allowEditing={true}
            />
            <Column
              caption="Phone Number"
              dataField={"customerPolicies[0].customer.phoneNumber"}
              dataType={"string"}
              allowEditing={false}
            />
            <Column
              dataField={"bankName"}
              allowEditing={false}
              dataType={"string"}
            />
            <Column
              caption={"National ID"}
              dataField={"customerPolicies[0].customer.nationalId"}
              visible={true}
              allowEditing={true}
            />
          </DataGrid>
          <br />

          {this.state.showPrintSection && (
            <div id={"employee-info"}>
              <hr />
              <article className="article">
                <h5 className="article__title">
                  Policy Number : {this.state.selectedRowPolicy.policyNumber}
                </h5>
                <div className="article__content">
                  <div className="alert-success">
                    <ul>
                      <li>
                        Start Date:{" "}
                        {this.formatDate(
                          this.state.selectedRowPolicy.startDate
                        )}
                      </li>
                      <li>
                        End Date :{" "}
                        {this.formatDate(this.state.selectedRowPolicy.endDate)}
                      </li>
                      <li>
                        Customer Names :{" "}
                        {
                          this.state.selectedRowPolicy.customerPolicies[0]
                            .customer.firstName
                        }{" "}
                        {
                          this.state.selectedRowPolicy.customerPolicies[0]
                            .customer.lastName
                        }
                      </li>
                      <li>
                        Date of Birth :{" "}
                        {this.formatDate(
                          this.state.selectedRowPolicy.customerPolicies[0]
                            .customer.birthDate
                        )}
                      </li>
                      <li>
                        Age :{" "}
                        {
                          this.state.selectedRowPolicy.customerPolicies[0]
                            .customer.age
                        }
                      </li>
                      <li>
                        Phone :{" "}
                        {
                          this.state.selectedRowPolicy.customerPolicies[0]
                            .customer.phoneNumber
                        }
                      </li>
                      <li>
                        Rate :{" "}
                        {this.state.selectedRowPolicy.customerPolicies[0].rate}
                      </li>
                      <li>
                        Net Premium:{" "}
                        {
                          this.state.selectedRowPolicy.customerPolicies[0]
                            .netPremium
                        }
                      </li>
                    </ul>
                  </div>
                </div>
              </article>
              <div>
                <ReactToPrint
                  trigger={() => (
                    <Button
                      width={120}
                      text={"Print"}
                      type={"success"}
                      className={"dx-button-custom"}
                      stylingMode={"contained"}
                      useSubmitBehavior={false}
                    />
                  )}
                  content={el => this.templateRef}
                />
                &nbsp;
                <Button
                  width={120}
                  text={"Cancel"}
                  // type={'success'}
                  className={"dx-button-custom"}
                  stylingMode={"contained"}
                  useSubmitBehavior={false}
                  onClick={this.onCancelPrint}
                />
              </div>
              <div style={{ display: "none" }}>
                <IndivPolicyTemplate
                  ref={el => (this.templateRef = el)}
                  policy={this.state.selectedRowPolicy}
                />
              </div>
            </div>
          )}
        </section>
      </MDBContainer>
    );
  }
}

export default ViewIndividualPolicies;

// onEditorPreparing = e => {
//   let component = e.component,
//     rowIndex = e.row && e.row.rowIndex;
//   if (e.dataField === 'duration') {
//     e.editorOptions.onValueChanged = function(args) {
//       let duration = args.value;
//       let previousStartDate = component.cellValue(rowIndex, 'startDate');
//       let newEndDate = moment(previousStartDate)
//         .add(duration, 'month')
//         .subtract(1, 'day')
//         .toDate();
//       let age = component.cellValue(
//         rowIndex,
//         'customerPolicies[0].customer.age'
//       );
//       let rates = rateData.filter(rate => {
//         return rate.age === age && parseInt(rate.periodMonth) === duration;
//       });
//       component.cellValue(rowIndex, 'duration', duration);
//       component.cellValue(rowIndex, 'endDate', newEndDate);
//       component.cellValue(
//         rowIndex,
//         'customerPolicies[0].rate',
//         rates[0].rate
//       );
//       // component.saveEditData();
//     };
//   }
// };

// setCellValue = (newData, value, currentRowData) => {
//   let previousStartDate = currentRowData.startDate;
//   newData.endDate = moment(previousStartDate)
//     .add(value, 'month')
//     .subtract(1, 'day')
//     .toDate();
//   currentRowData.endDate = newData.endDate;
//   console.log('...finish updating');
// };
