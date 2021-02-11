import React, { Component } from 'react';
import Chart, {
  CommonSeriesSettings,
  Series,
  Reduction,
  ArgumentAxis,
  Label,
  Format,
  ValueAxis,
  Title,
  Size,
  Tooltip
} from 'devextreme-react/chart';
import PieChart, {
  Series as PieSeries,
  Export as PieExport,
  Legend as PieLegend,
  HoverStyle
} from 'devextreme-react/pie-chart';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardText } from 'mdbreact';

class Dashboard extends Component {
  pointClickHandler(arg) {
    arg.target.select();
  }

  render() {
    return (
      <MDBContainer>
        {/* <section className={'section-preview'}> */}
        <MDBRow>
          <MDBCol md='6'>
            <MDBCard className='card-body'>
              <MDBCardText>
                <Chart
                  id={'chart'}
                  title={'Stock Price'}
                  dataSource={dataSourceTwo}
                >
                  <Size height={250} />
                  <CommonSeriesSettings argumentField={'date'} type={'stock'} />
                  <Series
                    name={'DELL'}
                    openValueField={'o'}
                    highValueField={'h'}
                    lowValueField={'l'}
                    closeValueField={'c'}
                  >
                    <Reduction color={'red'} />
                  </Series>
                  <ArgumentAxis workdaysOnly={true}>
                    <Label format={'shortDate'} />
                  </ArgumentAxis>
                  <ValueAxis tickInterval={1}>
                    <Title text={'US dollars'} />
                    <Label>
                      <Format precision={0} type={'currency'} />
                    </Label>
                  </ValueAxis>
                  {/* <Export enabled={true} /> */}
                  <Tooltip
                    enabled={true}
                    customizeTooltip={this.customizeTooltip}
                    location={'edge'}
                  />
                </Chart>
              </MDBCardText>
            </MDBCard>
          </MDBCol>
          <MDBCol md='6'>
            <MDBCard className='card-body'>
              <MDBCardText>
                <Chart id={'chart'} dataSource={dataSourceOne}>
                  <Size height={250} />
                  <Series
                    valueField={'oranges'}
                    argumentField={'day'}
                    name={'My oranges'}
                    type={'bar'}
                    color={'#ffaa66'}
                  />
                </Chart>
              </MDBCardText>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <MDBRow style={{ marginTop: '1rem' }}>
          <MDBCol md='12'>
            <MDBCard className='card-body'>
              <MDBCardText>
                <PieChart
                  id={'pie'}
                  type={'doughnut'}
                  title={'Olympic Medals in 2008'}
                  palette={'Soft Pastel'}
                  dataSource={olympicMedals}
                  onPointClick={this.pointClickHandler}
                >
                  <PieSeries argumentField={'country'} valueField={'medals'}>
                    <HoverStyle color={'#ffd700'} />
                  </PieSeries>
                  <PieExport enabled={true} />
                  <PieLegend
                    margin={0}
                    horizontalAlignment={'right'}
                    verticalAlignment={'top'}
                  />
                </PieChart>
              </MDBCardText>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        {/* </section> */}
      </MDBContainer>
    );
  }
}

export default Dashboard;

export const dataSourceOne = [
  {
    day: 'Monday',
    oranges: 3
  },
  {
    day: 'Tuesday',
    oranges: 2
  },
  {
    day: 'Wednesday',
    oranges: 3
  },
  {
    day: 'Thursday',
    oranges: 4
  },
  {
    day: 'Friday',
    oranges: 6
  },
  {
    day: 'Saturday',
    oranges: 11
  },
  {
    day: 'Sunday',
    oranges: 4
  }
];

export const dataSourceTwo = [
  {
    date: new Date(1994, 2, 1),
    l: 24.0,
    h: 25.0,
    o: 25.0,
    c: 24.875
  },
  {
    date: new Date(1994, 2, 2),
    l: 23.625,
    h: 25.125,
    o: 24.0,
    c: 24.875
  },
  {
    date: new Date(1994, 2, 3),
    l: 26.25,
    h: 28.25,
    o: 26.75,
    c: 27.0
  },
  {
    date: new Date(1994, 2, 4),
    l: 26.5,
    h: 27.875,
    o: 26.875,
    c: 27.25
  },
  {
    date: new Date(1994, 2, 7),
    l: 26.375,
    h: 27.5,
    o: 27.375,
    c: 26.75
  },
  {
    date: new Date(1994, 2, 8),
    l: 25.75,
    h: 26.875,
    o: 26.75,
    c: 26.0
  },
  {
    date: new Date(1994, 2, 9),
    l: 25.75,
    h: 26.75,
    o: 26.125,
    c: 26.25
  },
  {
    date: new Date(1994, 2, 10),
    l: 25.75,
    h: 26.375,
    o: 26.375,
    c: 25.875
  },
  {
    date: new Date(1994, 2, 11),
    l: 24.875,
    h: 26.125,
    o: 26.0,
    c: 25.375
  },
  {
    date: new Date(1994, 2, 14),
    l: 25.125,
    h: 26.0,
    o: 25.625,
    c: 25.75
  },
  {
    date: new Date(1994, 2, 15),
    l: 25.875,
    h: 26.625,
    o: 26.125,
    c: 26.375
  },
  {
    date: new Date(1994, 2, 16),
    l: 26.25,
    h: 27.375,
    o: 26.25,
    c: 27.25
  },
  {
    date: new Date(1994, 2, 17),
    l: 26.875,
    h: 27.25,
    o: 27.125,
    c: 26.875
  },
  {
    date: new Date(1994, 2, 18),
    l: 26.375,
    h: 27.125,
    o: 27.0,
    c: 27.125
  },
  {
    date: new Date(1994, 2, 21),
    l: 26.75,
    h: 27.875,
    o: 26.875,
    c: 27.75
  },
  {
    date: new Date(1994, 2, 22),
    l: 26.75,
    h: 28.375,
    o: 27.5,
    c: 27.0
  },
  {
    date: new Date(1994, 2, 23),
    l: 26.875,
    h: 28.125,
    o: 27.0,
    c: 28.0
  },
  {
    date: new Date(1994, 2, 24),
    l: 26.25,
    h: 27.875,
    o: 27.75,
    c: 27.625
  },
  {
    date: new Date(1994, 2, 25),
    l: 27.5,
    h: 28.75,
    o: 27.75,
    c: 28.0
  },
  {
    date: new Date(1994, 2, 28),
    l: 25.75,
    h: 28.25,
    o: 28.0,
    c: 27.25
  },
  {
    date: new Date(1994, 2, 29),
    l: 26.375,
    h: 27.5,
    o: 27.5,
    c: 26.875
  },
  {
    date: new Date(1994, 2, 30),
    l: 25.75,
    h: 27.5,
    o: 26.375,
    c: 26.25
  },
  {
    date: new Date(1994, 2, 31),
    l: 24.75,
    h: 27.0,
    o: 26.5,
    c: 25.25
  }
];

const olympicMedals = [
  {
    country: 'USA',
    medals: 110
  },
  {
    country: 'China',
    medals: 100
  },
  {
    country: 'Russia',
    medals: 72
  },
  {
    country: 'Britain',
    medals: 47
  },
  {
    country: 'Australia',
    medals: 46
  },
  {
    country: 'Germany',
    medals: 41
  },
  {
    country: 'France',
    medals: 40
  },
  {
    country: 'South Korea',
    medals: 31
  }
];
