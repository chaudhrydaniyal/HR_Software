import React, { useRef } from 'react'
import { useState, useMemo } from 'react';
import moment from "moment";
import { Context } from '../../../Context/Context';
import { useEffect, useContext } from 'react';
import axios from "axios"
import jsPDF from "jspdf";
import ReactToPrint from "react-to-print";
import Calendar from 'react-calendar';
import { NotificationContainer, NotificationManager } from 'react-notifications'
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import LoadingSpinner from './LoadingSpinner';
import { generateItems, generateFormulaFields, supportedColumns, supportedRefs, FormulaField } from './../../../formulaParser/shared-demo/gen'
import { evaluateTokenNodes, getExtendedTokens } from './../../../formulaParser/shared/src'



import 'react-calendar/dist/Calendar.css';
import './MonthlyPayroll.css'



const MonthlyPayroll = () => {

  const context = useContext(Context);

  let componentRef = useRef();

  const [payrollMonth, setPayrollMonth] = useState("")
  const [date, setDate] = useState(new Date());
  const [userAttendance, setUserAttendance] = useState({})

  const [usersPayrollCalculations, setUsersPayrollCalculations] = useState({})

  const [loading, setLoading] = useState(false);
  const [empLeaves, setEmpLeaves] = useState([])
  const [gaztedholiday, setGaztedholiday] = useState([])
  const [empshift, setEmpshift] = useState([])
  const [currentCalendar, setCurrentCalendar] = useState((new Date().toLocaleString("en-US").split(",")[0]))
  const [update, setUpdate] = useState(false)
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const [fields, setFields] = useState(generateFormulaFields())

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  // For fetching current time to display on report
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every 1 second
    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);


  function onChangeCalendar(e) {
    setCurrentCalendar(e.toLocaleString('en-US').split(",")[0])
    setPayrollMonth(e.toLocaleString('en-US', { month: "long" }))
    handleClose()
  }


  async function generateMonthAttendance() {
    try {
      setLoading(true);
      const attendanceTemp = await (await axios.get(`/monthattendance/${payrollMonth}`)).data;
      setLoading(false)
      attendanceTemp.length > 0 && NotificationManager.success("Successfully Generated")
      attendanceTemp.length == 0 && NotificationManager.error("Selected Month has no Data")
      const tempUserAttendance = userAttendance;

      attendanceTemp.map((at) => {

        //filter for  "Sagacious Systems"
        // if (at.employee.company_payroll == "Sagacious Systems") {
        //   tempUserAttendance[`${at.employee && at.employee.username && at.employee.username}`] = []
        // }

        // filter for  "Sagacious Marketing"
        // if (at.employee.company_payroll == "Sagacious Marketing") {
        //   tempUserAttendance[`${at.employee && at.employee.username && at.employee.username}`] = []
        // }

        //filter for  "Jalvi Developers"
        if (at.employee.company_payroll == "Jalvi Developers") {
        tempUserAttendance[`${at.employee && at.employee.username && at.employee.username}`] = []
        }

        //filter for  "Sagacious (Pvt.) Ltd"
        // if (at.employee.company_payroll == "Sagacious (Pvt.) Ltd") {
        //   tempUserAttendance[`${at.employee && at.employee.username && at.employee.username}`] = []
        // }


        //filter for  "Sagacious Construction"
        // if (at.employee.company_payroll == "Sagacious Construction") {
        //   tempUserAttendance[`${at.employee && at.employee.username && at.employee.username}`] = []
        // }     


        //filter for  "Sagacious Construction Pvt. Ltd."
        // if (at.employee.company_payroll == "Sagacious Construction Pvt. Ltd.") {
        //   tempUserAttendance[`${at.employee && at.employee.username && at.employee.username}`] = []
        // }  


        //filter for all
        // tempUserAttendance[`${at.employee && at.employee.username && at.employee.username}`] = []
      })

      const approvedLeave = await axios.get(`/leaverequest/approved-leaves/${payrollMonth}`)
      setEmpLeaves(approvedLeave.data.totaldays)
      console.log("approved leaves",approvedLeave)
      const gaztedholidays = await axios.get(`/holiday/detail`)
      setGaztedholiday(gaztedholidays.data.dates)

      //shift data fetch
      const shift = await axios.get(`/shifts/allShifts`)
      setEmpshift(shift.data)

      Object.entries(tempUserAttendance).forEach(
        ([key, value]) => tempUserAttendance[`${key}`] = tempUserAttendance[`${key}`].concat(attendanceTemp.filter((at) => at.employee && at.employee.username == key))
      );

      // adding LWP inside the user attendance
      Object.entries(tempUserAttendance).forEach(
        ([key, value]) => {
          let appliedLeaves = approvedLeave.data.totaldays.filter((td) => td.username == key && td.Short_leave != "True" && td.leaveNature == "L.W.P")
          appliedLeaves.forEach((al) => {
            tempUserAttendance[`${key}`].filter((te) => te.date == al.date)[0].status = "LWP"
          })
        }
      );

      // adding LWOP inside the user attendance
      Object.entries(tempUserAttendance).forEach(
        ([key, value]) => {
          let appliedLeaves = approvedLeave.data.totaldays.filter((td) => td.username == key && td.Short_leave != "True" && td.leaveNature == "L.W.O.P")
          appliedLeaves.forEach((al) => {
            tempUserAttendance[`${key}`].filter((te) => te.date == al.date)[0].status = "LWOP"
          })
        }
      );

      
      //Adding 1 in P in payroll
      Object.entries(tempUserAttendance).forEach(([key, value]) => {
        tempUserAttendance[key].forEach((te) => {
          if (te.status == "P") {
            te.status = 1;
          }
        })
      })

 

      //Adding shift slaps in payroll
      for (let i in userAttendance) {
        const a = userAttendance[i]
        const singleuser = a.map((j) => {
          if (j.employee.shift_id) {
            const shift = j.employee.shift_id
            const date = j.in
            const shortleave = approvedLeave.data.totaldays.map((r) => {
            })
            const splitdate = date.split(":")
            const sampleDateIn = new Date()
            sampleDateIn.setHours(splitdate[0])
            sampleDateIn.setMinutes(splitdate[1])
            shift.slaps.forEach((s) => {
              const slapname = Object.keys(s)[0]
              const splitSlap = slapname.split(":")
              const sampleDateSlap = new Date()
              sampleDateSlap.setHours(splitSlap[0])
              sampleDateSlap.setMinutes(splitSlap[1])
              if (sampleDateIn > sampleDateSlap) {
                j.status = (1 - s[slapname])
              }
            })
          }
        })
      }

      // Integrating short leaves
      Object.entries(tempUserAttendance).forEach(
        ([key, value]) => {
          let appliedLeaves = approvedLeave.data.totaldays.filter((td) => td.username == key && td.Short_leave == "True")
          appliedLeaves.forEach((al) => {
            tempUserAttendance[`${key}`].filter((te) => te.date == al.date)[0].status += " LWP"
          })
        }
      );

      // adding Day-Of inside the user attendance
      Object.entries(tempUserAttendance).forEach(([key, value]) => {
        let dayof = daysOfMonth.filter((td) => td.day == "Sun");
        dayof.forEach((al) => {
          tempUserAttendance[key].forEach((te) => {
            const locale = "en-US"
            var date = new Date(te.date);
            var day = date.toLocaleDateString(locale, { weekday: 'long' });
              if (day == "Sunday") {
                te.status = "D.O";
              }            
          });
        });
      });

      // Adding last saturday dayoff
      Object.entries(tempUserAttendance).forEach(([key, value]) => {
        let allSat = daysOfMonth.filter((st) => st.day == "Sat")
        const lastSat = allSat[allSat.length - 1]
        const [day, month, year] = lastSat.date.split('/');
        const convertedDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
        const Finalsat = convertedDate.toISOString();
          tempUserAttendance[key].forEach((te) => {
            if (Finalsat == te.date) {
              te.status = "D.O";
            }
          })
      })

      //Adding gazted holidays in payroll
      Object.entries(tempUserAttendance).forEach(([key, value]) => {
        const a = gaztedholidays.data.dates.map((i) => {
            tempUserAttendance[key].forEach((te) => {
              if (i.current == moment(te.date).utc().format('YYYY-MM-DD')) {
                te.status = "G.H";
              }
            })
        })
      })


      //Employee joining date modification in payroll
      Object.entries(tempUserAttendance).forEach(([key, value]) => {
        tempUserAttendance[key].forEach((te) => {
          const dateToCompare = new Date(te.date)
          if (dateToCompare.setDate(dateToCompare.getDate() + 1) < (new Date(value[0].employee.joiningdate))) {
            te.status = "";
          }
        })
      })



      //Employees who resigned/left modification in payroll
      Object.entries(tempUserAttendance).forEach(([key, value]) => {
        tempUserAttendance["fiza"] && tempUserAttendance["fiza"].forEach((te) => {
          if (new Date(te.date) > (new Date("July 16, 2023 00:00:00"))) {
            te.status = "";
          }
        })
      })

      setUserAttendance(tempUserAttendance)

      setUpdate(!update)
    } catch (error) {

      console.log("error in generating payroll", error)
      setLoading(false);
      NotificationManager.error("Please select  the month of Payroll")

    }
  }


  var splitDate = currentCalendar.split("/");
  var month = splitDate[0];
  var year = splitDate[2];
  var days = daysInMonth(month, year);
  const daysOfMonth = [];
  for (let i = 1; i <= days; i++) {
    daysOfMonth.push({ date: `${i}/${month}/${year}`, day: new Date(`${month}/${i}/${year}`).toLocaleString('en-us', { weekday: 'short' }) })
  }
  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
  const formattedDateTime = currentDateTime.toLocaleDateString(undefined, options);
  let rowNumber = 0;


  return (
    <>
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col">
                <h3 className="page-title">Monthly Payroll</h3>
                <ul
                  className="breadcrumb"
                  style={{ backgroundColor: "#f7f7f7" }}
                >
                  <li className="breadcrumb-item">
                    <Link to="/" style={{ color: "#1f1f1f" }}>
                      Dashboard
                    </Link>
                  </li>
                  <li className="breadcrumb-item active">Monthly Payroll</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className='card' style={{ marginLeft: "40px", marginRight: "40px" }}>
          <div className='card-body'>
            <Button className="mr-3" variant="primary" onClick={handleShow}>
              Select the Month
            </Button>
            Payroll Month: &nbsp;
            <input className="mr-3" value={payrollMonth} disabled="true"></input>
            <Modal show={show} onHide={handleClose}>
              <div className='d-flex justify-content-center'>
                <Calendar
                  onChange={onChangeCalendar}
                  value={date}
                  maxDetail='year'
                />
              </div>
            </Modal>
            <Button className="mr-3" onClick={async ()=>{
              await generateMonthAttendance()
              



              console.log("user attendance", userAttendance)


              // Applying the payroll formula for net pay days


      Object.entries(userAttendance).forEach(

        
        ([key, value]) => {

          console.log("the value", value[0].employee.payroll_setup[0].formula)

          const addField = () => {
            setFields([...fields, { id: crypto.randomUUID(), referenceName: 'netpaydays', formula: value[0].employee.payroll_setup[0].formula }])
          }

          addField()

          const formulasByRefs =  [...fields, { id: crypto.randomUUID(), referenceName: 'netpaydays', formula: value[0].employee.payroll_setup[0].formula }].reduce((out, field) => {
            if (field.referenceName) {
              out[field.referenceName] = field.formula
            }
            return out
          }, {})

          const extendedTokens = getExtendedTokens(formulasByRefs, supportedRefs)

          const extendedTokensOrdered = Object.values(extendedTokens).sort((a, b) => a.order - b.order)

          const items = generateItems(userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 1 || tu.status == 0.25 || tu.status == 0.5 || tu.status == 0.75).reduce((total, num) => { return (total + num.status) }, 0) + (userAttendance[`${key}`].filter((tu) => typeof tu.status == "string" && tu.status.split(" ")[1] == "LWP")).reduce((total, num) => { return (total + (parseFloat(num.status.split(" ")[0]))) }, 0), 0 , 0 , userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'D.O').length > 0 ? userAttendance[`${key}`].filter((tu) => tu.status == 'D.O').length : 0 )

          console.log("items", items)

          const extendedItems =
          items.map((item) => {
            const extendedItem = {}
            Object.entries(item).forEach(([key, value]) => {
              extendedItem[key] = (value === 0 ? 0 : (value || '')).toString()
            })      
            extendedTokensOrdered.forEach((entry) => {
              extendedItem[entry.referenceNameOrig] = evaluateTokenNodes(entry.tokenNodes, (prop) => (extendedItem[prop] || '').toString())
            })
            return extendedItem
          })

          console.log("extended items", extendedItems)

       

          usersPayrollCalculations[`${key}`] = {netpaydays: extendedItems[0].netpaydays}


          console.log(usersPayrollCalculations)



        }
      );






   

              }}>Generate Payroll</Button>

            <ReactToPrint
              trigger={() => <Button>Print Payroll</Button>}
              content={() => componentRef}
            />
            {/* component to be printed */}
            <div className="mt-3" style={{ overflow: "auto", width: "78vw", height: "68vh", }}>

              <table
                ref={(el) => (componentRef = el)} style={{ border: "1px solid black" }} id="payrollTable" className='payrollTable'>
                <tr style={{ backgroundColor: "#89CFF0" }}>
                  <th rowspan="2" style={{ border: "1px solid black" }}>Sr</th>
                  <th rowspan="2" style={{ border: "1px solid black" }}>Name</th>
                  <th rowspan="2" style={{ border: "1px solid black" }}>Designation</th>
                  {daysOfMonth.map((dm) => <th style={{ border: "1px solid black", textAlign: "center" }}>{dm.date.split("/")[0]}</th>)}
                  <th colSpan="6" style={{ border: "1px solid black", textAlign: "center" }}>Total Pay Days</th>
                  <th colSpan="3" style={{ border: "1px solid black", textAlign: "center" }}>Deductions</th>
                  <th rowspan="2" colSpan="1" style={{ border: "1px solid black" }}>M.D</th>
                  <th rowspan="2" colSpan="1" style={{ border: "1px solid black", width: "10px" }}>Net Pay Days</th>
                </tr>
                <tr style={{ backgroundColor: "#89CFF0" }}>
                  {daysOfMonth.map((dm) => <th style={{ border: "1px solid black", textAlign: "center" }}>{dm.day}</th>)}
                  <th style={{ border: "1px solid black" }}>W.D</th>
                  <th style={{ border: "1px solid black" }}>L.W.P</th>
                  <th style={{ border: "1px solid black" }}>S.L</th>
                  <th style={{ border: "1px solid black" }}>CPL</th>
                  <th style={{ border: "1px solid black" }}>G.H</th>
                  <th style={{ border: "1px solid black" }}>D.O</th>
                  <th style={{ border: "1px solid black" }}>LWOP</th>
                  <th style={{ border: "1px solid black" }}>Absent</th>
                  <th style={{ border: "1px solid black" }}>Late</th>

                </tr>

                {loading ? <div style={{ display: "flex", marginLeft: "40vw", marginTop: "10px" }}><LoadingSpinner /> </div> : ''}

                {Object.entries(userAttendance).map(
                  ([key, value]) =>
                    <tr>
                      <td style={{ border: "1px solid black", textAlign: "left" }}>{++rowNumber}</td>
                      <td style={{ border: "1px solid black", textAlign: "left" }}>{value[0] && value[0].Name}</td>
                      <td style={{ border: "1px solid black", textAlign: "left" }}>{value[0] && value[0].employee.designation}</td>
                      {
                        daysOfMonth.map((dm) => {
                          const attendanceEntry = userAttendance[`${key}`].find((tu) => parseInt(dm.date.split("/")[0]) === parseInt(tu.date.split("-")[2].split("T")[0]));
                          let fontWeight = "normal";
                          if (attendanceEntry) {
                            if (attendanceEntry.status === "D.O" || attendanceEntry.status === "G.H") {
                              fontWeight = "bolder";
                            }
                          }

                          return (
                            <td style={{ border: "1px solid black", fontWeight: fontWeight }}>
                              {attendanceEntry ? attendanceEntry.status : ""}
                            </td>
                          );
                        })
                      }
                      <td style={{ border: "1px solid black" }}>{userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 1 || tu.status == 0.25 || tu.status == 0.5 || tu.status == 0.75).reduce((total, num) => { return (total + num.status) }, 0) + (userAttendance[`${key}`].filter((tu) => typeof tu.status == "string" && tu.status.split(" ")[1] == "LWP")).reduce((total, num) => { return (total + (parseFloat(num.status.split(" ")[0]))) }, 0)}</td>
                      <td style={{ border: "1px solid black" }}>{userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'LWP').length ? userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'LWP').length : ""}</td>
                      <td style={{ border: "1px solid black" }}>{userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => typeof tu.status == "string" && tu.status.split(" ")[1] == "LWP").reduce((total, num) => { return (total + (1 - parseFloat(num.status.split(" ")[0]))) }, 0) ? userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => typeof tu.status == "string" && tu.status.split(" ")[1] == "LWP").reduce((total, num) => { return (total + (1 - parseFloat(num.status.split(" ")[0]))) }, 0) : ""}</td>
                      <td style={{ border: "1px solid black" }}>{userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'CPL').length ? userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'CPL').length : ""}</td>
                      <td style={{ border: "1px solid black" }}>{userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'G.H').length ? userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'G.H').length : ""}</td>
                      <td style={{ border: "1px solid black" }}>{userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'D.O').length ? userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'D.O').length : ""}</td>
                      <td style={{ border: "1px solid black" }}>{userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'LWOP').length ? userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'LWOP').length : ""}</td>
                      <td style={{ border: "1px solid black" }}>{userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'A').length ? userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'A').length : ""}</td>
                      <td style={{ border: "1px solid black" }}>{userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'Late').length ? userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'Late').length : ""}</td>
                      <td style={{ border: "1px solid black" }}>{userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == '').length ? userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == '').length : ""}</td>
                      <td style={{ border: "1px solid black", fontWeight: "bold" }}>{
                        parseFloat(userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 1 || tu.status == 0.25 || tu.status == 0.5 || tu.status == 0.75).reduce((total, num) => { return (total + num.status) }, 0)) + parseFloat((userAttendance[`${key}`].filter((tu) => typeof tu.status == "string" && tu.status.split(" ")[1] == "LWP")).reduce((total, num) => { return (total + (parseFloat(num.status.split(" ")[0]))) }, 0)) +
                        parseInt(userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'HW').length) +
                        parseInt(userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'LWP').length) +
                        parseInt(userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'CPL').length) +
                        parseInt(userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'G.H').length) +
                        parseInt(userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'D.O').length) +
                        parseFloat(userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => typeof tu.status == "string" && tu.status.split(" ")[1] == "LWP").reduce((total, num) => { return (total + (1 - parseFloat(num.status.split(" ")[0]))) }, 0))
                      }
                      </td>
                    </tr>)
                }
                <tr>
                  <th colSpan="44" style={{ textAlign: "right" }}>Total:</th><th colSpan="45">
                    {/* Sum of net pay days */}
                    {
                      Object.keys(userAttendance).reduce(function (previous, key) {
                        return (previous + parseFloat(userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 1 || tu.status == 0.25 || tu.status == 0.5 || tu.status == 0.75).reduce((total, num) => { return (total + num.status) }, 0)) + parseFloat((userAttendance[`${key}`].filter((tu) => typeof tu.status == "string" && tu.status.split(" ")[1] == "LWP")).reduce((total, num) => { return (total + (parseFloat(num.status.split(" ")[0]))) }, 0)) +
                          parseInt(userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'HW').length) +
                          parseInt(userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'LWP').length) +
                          parseInt(userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'CPL').length) +
                          parseInt(userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'G.H').length) +
                          parseInt(userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => tu.status == 'D.O').length) +
                          parseFloat(userAttendance[`${key}`].length > 0 && userAttendance[`${key}`].filter((tu) => typeof tu.status == "string" && tu.status.split(" ")[1] == "LWP").reduce((total, num) => { return (total + (1 - parseFloat(num.status.split(" ")[0]))) }, 0))
                        )
                      }, 0)
                    }
                  </th>
                </tr>
                <tr>
                  <th colSpan="45" >   <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", marginLeft: "28rem" }}>
                    <h6>Verified By: ____________</h6>
                    <h6>Approved By: ___________</h6>
                  </div>
                    <div style={{ marginTop: "3rem" }}>
                      <p>* It's a computer generated report and does not require any signature.</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                      <h6>Printed by: {context.user.firstname}</h6>
                      <h6>Date/Time: {formattedDateTime}</h6>
                      <h6>Print no: _________</h6>
                    </div>
                  </th>
                </tr>
              </table>
            </div>
          </div>
        </section>
      </div>
      <NotificationContainer />
    </>
  )
}
export default MonthlyPayroll