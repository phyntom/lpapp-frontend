import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import logo from "../../../radiant_logo.png";
import signature from "../../../signature.png";

@inject("individualPolicyStore")
@observer
class IndivPolicyTemplate extends Component {
  formatNumber = input => {
    return new Intl.NumberFormat("en").format(input);
  };

  formatDate = dateToFormat => {
    return new Intl.DateTimeFormat("en-GB").format(dateToFormat);
  };
  render() {
    const globalTemplateStyle = {
      fontFamily: "Times New Roman,Courier New,Arial,Times",
      color: "#000000"
    };
    const tableHeaderStyle = {
      padding: "10px",
      // borderTop: '1px solid #000000',
      borderBottom: "1px solid #000000",
      borderCollapse: "collapse"
    };
    const selectedPolicy = this.props.policy;
    return (
      // <MDBContainer>
      <section className={"section-preview-template"}>
        <table
          style={globalTemplateStyle}
          border={0}
          width="100%"
          cellSpacing={5}
          cellPadding={5}
        >
          <tbody style={{ fontSize: 50 }}>
            <tr>
              <td colSpan={2}>
                <table style={tableHeaderStyle} width="100%">
                  <tbody
                    style={{
                      color: "#2C7EC1",
                      padding: "10px"
                    }}
                  >
                    <tr border={0}>
                      <td style={{ width: "14.9498%" }} rowSpan={4}>
                        <img src={logo} className={"logoImg"} alt={"Logo"} />
                      </td>
                      <td
                        style={{
                          width: "83.0502%",
                          textAlign: "left",
                          fontSize: "19px"
                        }}
                        align="center"
                        className="font-weight-bold"
                      >
                        RADIANT YACU LTD
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          width: "83.0502%",
                          textAlign: "left",
                          fontSize: "15px"
                        }}
                        align="center"
                      >
                        A MICROINSURANCE COMPANY
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          width: "83.0502%",
                          textAlign: "left",
                          fontSize: "15px"
                        }}
                        align="center"
                      >
                        SHARE CAPITAL : 400.000.000 FRW | HEADQUARTER : KN 2
                        AVENUE
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          width: "83.0502%",
                          textAlign: "left",
                          fontSize: "15px"
                        }}
                        align="center"
                      >
                        Email: info@radiontyacu.rw | P.O. Box 1861 KIGALI /
                        RWANDA | COMPANY CODE : 108505784
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <br />
              </td>
            </tr>
            <tr style={{ color: "#000" }}>
              <td colSpan={2} className="h6 font-weight-bold">
                AMASEZERANO Y'UBWISHINGIZI KU NGUZANYO YA BANKI NUMERO
                <span>: {selectedPolicy.policyNumber}</span>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <hr className={"template"} />
              </td>
            </tr>
            <tr>
              <td className="font-weight-bold">Banki-Ishami</td>
              <td>
                {": "}
                {selectedPolicy.branch.branchName}
              </td>
            </tr>
            <tr>
              <td className="font-weight-bold">
                Igihe ubwishingizi butangiriraho
              </td>
              <td>
                {": "}
                {this.formatDate(selectedPolicy.startDate)}
              </td>
            </tr>
            <tr>
              <td className="font-weight-bold">
                Igihe ubwishingizi buzarangiriraho
              </td>
              <td>
                {": "}
                {this.formatDate(selectedPolicy.endDate)}
              </td>
            </tr>
            <tr>
              <td className="font-weight-bold">
                Igihe inguzanyo izarangiriraho
              </td>
              <td>
                {": "}
                {this.formatDate(selectedPolicy.endDate)}
              </td>
            </tr>
            <tr>
              <td className="font-weight-bold">Ubwoko bw'ubwishingizi</td>
              <td>{": "}Loan Protection</td>
            </tr>
            <tr>
              <td className="font-weight-bold">Ingano y'inguzanyo</td>
              <td>
                {": "}
                {this.formatNumber(selectedPolicy.sumInsured)}
              </td>
            </tr>
            <tr>
              <td className="font-weight-bold">Ikiguzi cy'ubwishingizi</td>
              <td>
                {": "}
                {this.formatNumber(
                  selectedPolicy.customerPolicies[0].netPremium
                )}
              </td>
            </tr>
            <tr>
              <td className="font-weight-bold">Umufuragiro</td>
              <td>
                {": "}
                {this.formatNumber(
                  selectedPolicy.customerPolicies[0].accessories
                )}
              </td>
            </tr>
            <tr>
              <td className="font-weight-bold">Ayishyurwa yose hamwe</td>
              <td>
                {": "}
                {this.formatNumber(
                  selectedPolicy.customerPolicies[0].totalPremium
                )}
              </td>
            </tr>
            {/* <tr>
                  <td className='font-weight-bold'>UMUHUZA W'UBWISHINGIZI</td>
                  <td>{selectedPolicy.bankName}</td>
                </tr> */}
            <tr>
              <td className="font-weight-bold">Uzishyurwa na RADIANT YACU</td>
              <td>
                {": "}
                {selectedPolicy.bankName}
              </td>
            </tr>
            <tr>
              <td colSpan={2}>&nbsp;</td>
            </tr>
            <tr>
              <td colSpan={2} className="h6 font-weight-bold">
                UMWIRONDORO W'UWAFASHE INGUZANYO
              </td>
            </tr>
            <tr>
              <td>
                Amazina Yombi:{" "}
                {selectedPolicy.customerPolicies[0].customer.lastName}{" "}
                {selectedPolicy.customerPolicies[0].customer.firstName}
              </td>
              <td>
                Nimero y'indangamuntu:{" "}
                {selectedPolicy.customerPolicies[0].customer.nationalId}
              </td>
            </tr>
            {/* <tr>
                  <td>AHO ABARIZWA:</td>
                  <td>&nbsp;</td>
                </tr> */}
            <tr>
              <td>
                Amazina y'uwo bashakanye:{" "}
                {selectedPolicy.customerPolicies[0].customer.spouse}
              </td>
              {/* <td>NIMERO Y'INDANGAMUNTU: -</td> */}
            </tr>
            <tr>
              <td colSpan={2}>&nbsp;</td>
            </tr>
            <tr>
              <td colSpan={2} className="h6 font-weight-bold">
                IBYISHINGIWE
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                Igihe uwafashe inguzanyo yitabye imana cyangwa agize ubumuga bwa
                burundu bungana cyangwa burenze 70%, RADIANT YACU LTD yishyura
                amafaranga umukiriya yari asigaje kwishyura ku nguzanyo
                y'umwimerere (hatabariwemo ibirarane atishyuye akiriho cyangwa
                ataramugara) hakiyongeraho inyungu y'ukwezi yapfuyemo cyangwa
                yamugayemo nk'uko bigaragazwa n'imbonerahamwe y'uburyo inguzanyo
                yishyurwa.
              </td>
            </tr>
            <tr>
              <td colSpan={2}>&nbsp;</td>
            </tr>
            <tr>
              <td colSpan={2} className="h6 font-weight-bold">
                IBITISHINGIWE
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                Kwiyahura, ibikorwa by'ubugizi bwa nabi,intambara
                yatangajwe,kutubahiriza inama za muganga uko bikwiye byemejwe na
                Muganga na Polisi y'igihugu,urupfu rutewe n'ubifitemo inyungu
                byemejwe na Polisi y'igihugu, urupfu ruturutse mu kunywa
                ibiyobyabwenge cyangwa ibindi byangiza ubuzima.
              </td>
            </tr>
            <tr>
              <td colSpan={2}>&nbsp;</td>
            </tr>
            <tr>
              <td colSpan={2} className="h6 font-weight-bold">
                AMAKURU K'UWISHINGIWE
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                Uwishingiwe agomba kumenyesha RADIANT YACU LTD niba arwaye
                indwara zidakira nk'umutima,kanseri,impyiko na diyabeti.
              </td>
            </tr>
            <tr>
              <td colSpan={2}>&nbsp;</td>
            </tr>
            <tr>
              <td colSpan={2} className="h6 font-weight-bold">
                ISHYIRWAMUBIKORWA RY'AYA MASEZERANO
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                Aya masezerano azashyirwa mu bikorwa nyuma y'uko impande zombi
                zayashyizeho umukono ndetse n'igihe ikiguzi cy'ubwishingizi
                cyamaze kwishyurwa. RADIANT YACU LTD ntabwo izishyura
                ibyakwangirika igihe ikiguzi cy'ubwishingizi kitishyuwe mu minsi
                15 nyuma yo gushyira umukono kuri aya masezerano n'impande
                zombi.
              </td>
            </tr>
            <tr>
              <td colSpan={2}>&nbsp;</td>
            </tr>
            <tr>
              <td colSpan={2} className="h6 font-weight-bold">
                <strong>KWISHYUZA RADIANT YACU LTD</strong>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                Umukiriya(Banki/ikigo gitanga inguzanyo) gitanga ibi bikurikira
                kuri RADIANT YACU LTD:
                <ul>
                  <li>
                    Ifishi y'imenyekanisha ry'impanuka yujujwe kandi yashyizweho
                    umukono
                  </li>
                  <li>
                    Icyemezo cy'uko umuntu yitabye imana gitangwa n'ibitaro
                    cyangwa ubuyobozi bwite bwa Leta. Muganga wa RADIANT YACU
                    LTD niwe wemeza ingano y'ubumuga bwa burundu.
                  </li>
                  <li>
                    RADIANT YACU LTD izishyura mu gihe kitarenze iminsi 7
                    y'akazi uhereye igihe ibyangombwa byose bisabwa bizaba
                    byayigereyeho.
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="h6 font-weight-bold">
                <strong>GUKEMURA IMPAKA</strong>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                Impaka zose zavuka hagati y'impande zombi zizakemurwa mu
                bwumvikane.Biramutse byanze, hazitabazwa inkiko zibifitiye
                ububasha zikorera mu ifasi ibiro bikuru bya RADIANT YACU LTD
                bibarirwamo.
              </td>
            </tr>
            <tr>
              <td colSpan={2}>&nbsp;</td>
            </tr>
            <tr>
              <td colSpan={2}>
                Bikorewe........................................ku wa.........
              </td>
            </tr>
            <tr>
              <td colSpan={2}>&nbsp;</td>
            </tr>
            <tr>
              <td colSpan={2}>
                <table border={0} width="100%" cellSpacing={0} cellPadding={10}>
                  <tbody>
                    <tr>
                      <td width="30%">Uwishingiwe</td>
                      <td width="30%">Ikigo cyatanze inguzanyo</td>
                      <td width="40%" style={{ textAlign: "center" }}>
                        Signature
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>{/* <hr /> */}</td>
            </tr>
            <tr>
              <td colSpan={2}>
                <table border={0} width="100%" cellSpacing={0} cellPadding={10}>
                  <tbody>
                    <tr>
                      <td width="30%"></td>
                      <td width="30%"></td>
                      <td width="40%" style={{ textAlign: "center" }}>
                        <img
                          src={signature}
                          className={"signatureImg"}
                          alt={"Logo"}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    );
  }
}

export default IndivPolicyTemplate;
