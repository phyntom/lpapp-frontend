import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardTitle, MDBBtn, MDBCardBody } from 'mdbreact';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../custom-form.css';
import { fetchIndividualPoliciesByDates } from '../../api/ReportService';
import { format } from 'date-fns';

const IndivSalesReport = (props) => {
   const [startDate, setStartDate] = useState(Date.now);
   const [endDate, setEndDate] = useState(Date.now);
   const [data, setData] = useState([]);
   const [totalFees, setTotalFees] = useState(0);
   const [totalSumInsured, setTotalSumInsured] = useState(0);
   const [totalPremium, setTotalPremium] = useState(0);
   const [totalNetPremium, setTotalNetPremium] = useState(0);
   const dateFormat = 'yyyy/MM/dd';

   const formatNumber = (input) => {
      return new Intl.NumberFormat('en-US', {}).format(input);
   };

   const handleSearch = async (e) => {
      e.preventDefault();
      try {
         const response = await fetchIndividualPoliciesByDates(
            format(startDate, 'YYYY-MM-DD'),
            format(endDate, 'YYYY-MM-DD')
         );
         const fetchedRecords = response.data;
         setData(fetchedRecords);
         setTotalFees(fetchedRecords.reduce((total, policy) => total + policy.accessories, 0));
         setTotalPremium(fetchedRecords.reduce((total, policy) => total + policy.totalPremium, 0));
         setTotalNetPremium(
            fetchedRecords.reduce((total, policy) => total + policy.totalNetPremium, 0)
         );
         setTotalSumInsured(fetchedRecords.reduce((total, policy) => total + policy.sumInsured, 0));
      } catch (err) {
         console.error('An error occurs', err);
      }
   };

   return (
      <MDBContainer>
         <MDBRow center gutters='2'>
            <MDBCol md='12'>
               <MDBCard className='card-body' style={{ marginTop: '1rem' }}>
                  <MDBCardTitle>Individual Sales Report</MDBCardTitle>
                  <MDBCardBody>
                     <form className='form' onSubmit={handleSearch}>
                        <div className='custom-form-control'>
                           <label htmlFor='startDate' className='custom-form-label'>
                              Start Date
                           </label>
                           <DatePicker
                              className='custom-form-input'
                              dateFormat={dateFormat}
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                           />
                        </div>
                        <div className='custom-form-control'>
                           <label htmlFor='endDate' className='custom-form-label'>
                              End Date
                           </label>
                           <DatePicker
                              className='custom-form-input'
                              dateFormat={dateFormat}
                              selected={endDate}
                              onChange={(date) => setEndDate(date)}
                           />
                        </div>
                        <div className='custom-form-control'>
                           <button type='submit' className='custom-button'>
                              Search
                           </button>
                        </div>
                     </form>
                     <div className='dash-card-container'>
                        <div className='dash-card-item'>
                           <div className='thin-text-title'>Policies</div>
                           <div className='thick-text-body'>{data.length}</div>
                        </div>
                        <div className='dash-card-item'>
                           <div className='thin-text-title'>Total Fees</div>
                           <div className='thick-text-body'>{formatNumber(totalFees)}</div>
                        </div>
                        <div className='dash-card-item'>
                           <div className='thin-text-title'>Total Premium</div>
                           <div className='thick-text-body'>{formatNumber(totalPremium)}</div>
                        </div>
                        <div className='dash-card-item'>
                           <div className='thin-text-title'>Total Net Premium</div>
                           <div className='thick-text-body'>{formatNumber(totalNetPremium)}</div>
                        </div>
                        <div className='dash-card-item'>
                           <div className='thin-text-title'>Total Sum Insured</div>
                           <div className='thick-text-body'>{formatNumber(totalSumInsured)}</div>
                        </div>
                     </div>
                  </MDBCardBody>
               </MDBCard>
            </MDBCol>
         </MDBRow>
      </MDBContainer>
   );
};

export default IndivSalesReport;
