import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { Card, Container, Form, Button, Table } from "react-bootstrap";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useContext } from "react";
import { Context } from "../../../Context/Context";
import "../../Leaves/leaves.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useReactToPrint } from "react-to-print";
import Report from "../report leave request/Report";
import './LeaveRequest.css'
import HeaderContext from '../../../Context/HeaderContext'


const LeaveRequest = () => {
  const [from, setFirstdate] = useState(new Date());
  const [reason, setReason] = useState("");
  const [to, setSecond] = useState(new Date());
  const [attachedFile, setAttachedFile] = useState();
  const [leaveType, setLeaveType] = useState("");
  const [applicationdate, setapplicationdate] = useState("")
  const { user } = useContext(Context);
  const [Info, setinfo] = useState([]);
  const [backupresourse, setbackupresourse] = useState("")
  const [leaveNature, setLeaveNature] = useState("")
  const [leaves, setLeaves] = useState([]);
  const [depemp, setdepemp] = useState([])
  const [fromTime, setFromTime] = useState("")
  const [toTime, setToTime] = useState("")
  const [details, setDetails] = useState([]);
  const [Short_leave, setShort_leave] = useState([]);

  const url = "leaves";
  const posturl = "leaverequest/addrequest";
  const a = useContext(HeaderContext)
  useEffect(() => {
    a.update("Human Resource / Leave Request")
  })

  const employee = user.id;
  const getEmp = `employees/${user.id}`;
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const userInformation = async () => {
    try {
      const res = await axios.get(process.env.React_APP_ORIGIN_URL + getEmp);
      const empinfo = res.data;
      const InfoData = [];
      await empinfo.Leaves.map((d) => {
        InfoData.push({
          from: d.from,
          Short_leave: d.Short_leave,
          to: d.to,
          status: d.status,
          leaveType: d.leaveType,
          name: empinfo.firstname,
          _id: empinfo.emp_id,
          department: empinfo.departments.map((d) => d.departmentname),
          reason: d.reason,
          applicationdate: d.applicationdate,
          empid: empinfo.emp_id,
          designation: empinfo.designation,
          leavesId: empinfo.Leaves.slice(empinfo.Leaves.length - 1),
          backupresourse: d.backupresourse
        });
      });
      setinfo(InfoData);

      const departments = [];
      await empinfo.departments.map((d) => {
        departments.push({
          department: d.departmentname,
          name: empinfo.firstname,
          email: empinfo.email,
          empid: empinfo.emp_id,
          designation: empinfo.designation,
        });
      });

      setDetails(departments);
    } catch (error) {
      console.log(error);
    }
  };

  const depurl = user.departments.map((d) => d._id);
  const depemployees = `departments/${depurl}`
  const fetchData = async () => {
    try {
      const res = await axios.get(process.env.React_APP_ORIGIN_URL + url);
      const dd = res.data.getLeave;
      setLeaves(dd);
    } catch (error) {
      console.log(error);
    }
  };

  const allemployees = async () => {
    try {
      const res = await axios.get(process.env.React_APP_ORIGIN_URL + depemployees);
      const data = res.data.department.employees;
      setdepemp(data)
    } catch (error) {
      console.log(error)
    }
  }

  const addleaveRequest = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("leaveType", leaveType);
    formData.append("from", from);
    formData.append("reason", reason);
    formData.append("to", to);
    formData.append("Short_leave", Short_leave);
    formData.append("employee", employee);
    formData.append("file", attachedFile);
    formData.append("applicationdate", applicationdate);
    formData.append("backupresourse", backupresourse)
    formData.append("fromTime", fromTime)
    formData.append("toTime", toTime)
    formData.append("leaveNature", leaveNature)
    try {
      const addreq = await axios({
        method: "post",
        url: process.env.React_APP_ORIGIN_URL + `${posturl}`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      addreq && NotificationManager.success("Successfully Added");
    } catch (error) {
      NotificationManager.error("Failed to Add");
    }
  };

  // disabled previous datesurl
  var dd, today, mm, yyyy;
  const disableDate = () => {
    today = new Date();
    dd = String(today.getDate() + 1).padStart(2, "0");
    mm = String(today.getMonth() + 1).padStart(2, "0");
    yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };

  //total no of days between dates
  var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  var firstDate = new Date(from); // 29th of Feb at noon your timezone
  var secondDate = new Date(to);
  var diffDays = Math.round(
    Math.abs((secondDate.getTime() - firstDate.getTime()) / oneDay) + 1
  );

  useEffect(() => {
    fetchData();
    userInformation();
    allemployees();
  }, []);

  const array = depemp.filter((d) => d.firstname !== "Hafiz Raheel" & d.firstname !== `${user.firstname}`);
  return (
    <>
      <div
        className="content-wrapper my-1"
        style={{ backgroundColor: "#f7f7f7"}}
      >
        <section className="content" style={{marginTop: "30px"}}>
          <div className="container">
            <div className="card">
              <div className="card-header buttoncolor "> 
                <h3 className="card-title" style={{ color: "white"}}>
                  Add Leave Request
                </h3>
              </div>
              <div className="card-body">
                <Container>
                  <div>
                    <h4>Leave Form</h4>
                    <hr />
                    <Row>
                      <Col xs="7">
                        <Card>
                          <Card.Body>
                            <Container>
                              <Form onSubmit={addleaveRequest}>
                                <Form.Group
                                  className="mb-3"
                                  controlId="formBasicEmail"
                                >
                                  <Row>
                                    <Col>
                                      <Form.Label>Leave Type</Form.Label>
                                      <Form.Select
                                        required
                                        onChange={(e) => {
                                          setLeaveType(e.target.value);
                                        }}
                                      >
                                        <option disabled selected hidden defaultValue={""}>Please Select</option>
                                        {leaves.map((d) => {
                                          return (
                                            <option
                                              key={d._id}
                                              value={d.leaveType}
                                              name={d.leaveType}
                                            >
                                              {d.leaveType}
                                            </option>
                                          );
                                        })}
                                      </Form.Select>
                                    </Col>
                                    <Col>
                                      <Form.Label>Status</Form.Label>
                                      <div className="status">
                                        <Form.Control
                                          type="text"
                                          required
                                          value={"open"}
                                          disabled
                                        ></Form.Control>
                                      </div>
                                    </Col>
                                  </Row>
                                </Form.Group>

                                <Form.Group
                                  className="mb-3"
                                  controlId="formBasicPassword"
                                >
                                  <Row>
                                    <Col>
                                      <Form.Label>From</Form.Label>
                                      <Form.Control
                                        type="date"
                                        required
                                        onChange={(e) => {
                                          setFirstdate(e.target.value);
                                        }}
                                      />
                                    </Col>
                                    <Col>
                                      <Form.Label>To</Form.Label>
                                      <Form.Control
                                        type="date"
                                        reuired
                                        onChange={(e) => {
                                          setSecond(e.target.value);
                                        }}
                                      />
                                    </Col>
                                  </Row>
                                </Form.Group>
                                <Form.Group
                                  className="mb-3"
                                  controlId="formBasicPassword"
                                >
                                  <Row>
                                    <Col>
                                      <Form.Label>Total Days</Form.Label>
                                      <Form.Control
                                        type="number"
                                        value={diffDays}
                                        disabled
                                      />
                                    </Col>
                                    <Col>
                                      <Form.Label>Reason</Form.Label>
                                      <div className="reason">
                                        <Form.Control
                                          type="text"
                                          onChange={(e) => {
                                            setReason(e.target.value);
                                          }}
                                        />
                                      </div>
                                    </Col>
                                  </Row>
                                </Form.Group>
                                <Form.Group
                                  className="mb-3"
                                  controlId="formBasicPassword"
                                >
                                  <Row>
                                    <Col xs={"4"} lg={6} xl={6} xxl={6}>
                                      <Form.Label>Backup Resourse</Form.Label>
                                      <Form.Select
                                        onChange={(e) => { setbackupresourse(e.target.value) }}
                                      >
                                        <option disabled selected hidden defaultValue={""}>Please Select</option>
                                        {
                                          array.map((d, i) => {
                                            return (
                                              <>
                                                <option key={i} value={d._id}>{d.firstname}</option>
                                              </>)
                                          })
                                        }
                                      </Form.Select>
                                    </Col>
                                    <Col>
                                      <Form.Label>Application Date</Form.Label>
                                      <Form.Control
                                        type="date"
                                        onChange={(e) => {
                                          setapplicationdate(e.target.value);
                                        }}
                                      />
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col>
                                      <Form.Label>Time From</Form.Label>
                                      <Form.Control
                                        type="time"
                                        value={fromTime}
                                        onChange={(e) => {
                                          setFromTime(e.target.value)
                                        }}
                                      />
                                    </Col>
                                    <Col>
                                      <Form.Label>Time To</Form.Label>
                                      <Form.Control
                                        type="time"
                                        value={toTime}
                                        onChange={(e) => {
                                          setToTime(e.target.value)
                                        }}
                                      />
                                    </Col>

                                  </Row>
                                  <Row>
                                    <Col xs={"4"} lg={6} xl={6} xxl={6}>
                                      <Form.Label>Leave Nature</Form.Label>
                                      <Form.Select  
                                        value={leaveNature}
                                        onChange={(e) => { setLeaveNature(e.target.value) }}
                                      >
                                        <option disabled selected hidden value="">Please Select</option>
                                        <option value="L.W.P">L.W.P</option>
                                        <option value="L.W.O.P">L.W.O.P</option>
                                        <option value="C.P.L">C.P.L</option>
                                        <option value="W.F.H">W.F.H</option>
                                      </Form.Select>
                                    </Col>

                                    <Col xs={"4"} lg={6} xl={6} xxl={6}>
                                      <Form.Label>Short leave</Form.Label>
                                      <Form.Select
                                        value={Short_leave}
                                        onChange={(e) => { setShort_leave(e.target.value) }}
                                      >
                                        <option disabled selected hidden value="">Please Select</option>
                                        <option value="True">Short Leave</option>
                                        <option value="False">Full Leave</option>
                                      </Form.Select>
                                    </Col>
                                  </Row>
                                </Form.Group>

                                <Form.Group>
                                  <Row>
                                    <Form.Label>Attachment</Form.Label>
                                    <Col sm={10}>
                                      <input
                                        type="file"
                                        id="files"
                                        name="files"
                                        onChange={(f) => {                                  
                                          var ext = f.target.value.match(
                                            /\.([^\.]+)$/
                                          )[1];
                                          switch (ext) {
                                            case "jpeg":
                                            case "jpg":
                                            case "jpgv":
                                            case "png":
                                            case "svg":
                                            case "xls":
                                            case "xlam":
                                            case "xlsm":
                                            case "pptx":
                                            case "xlsx":
                                            case "docx":
                                            case "dotx":
                                            case "ppt":
                                            case "doc":
                                            case "pdf":
                                            case "txt":
                                            case "7z":
                                            case "ace":
                                            case "acc":
                                            case "avi":
                                            case "csv":
                                            case "texinfo":
                                            case "html":
                                            case "m3u":
                                            case "m4v":
                                            case "mpeg":
                                            case "mp4a":
                                            case "mp4":
                                            case "mp4":
                                            case "weba":
                                            case "webm":
                                            case "psd":
                                            case "pic":
                                            case "au":
                                            case "tar":
                                            case "wav":
                                            case "webp":
                                            case "xml":
                                            case "zip":
                                              setAttachedFile(f.target.files[0]);
                                              break;
                                            default:
                                              alert(
                                                "Please select the valid file extension!"
                                              );
                                              f.target.value = "";
                                          }
                                          setAttachedFile(f.target.files[0]);
                                        }}
                                      />
                                    </Col>
                                    <Col>
                                      <Button variant="primary" type="submit" className="submitButton" style={{backgroundColor: "rgb(137, 179, 83)"}}>
                                        Submit
                                      </Button>
                                    </Col>
                                  </Row>
                                </Form.Group>
                              </Form>
                            </Container>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col>
                        <Card>
                          <Card.Header className="buttoncolor ">
                            <Card.Title style={{ width: "100%" }}>
                              <h4 className="text-center">
                                Employee Information
                              </h4>
                            </Card.Title>
                          </Card.Header>

                          <Card.Body>
                            <Container>
                              {details.map((d) => {
                                return (
                                  <>
                                    <div style={{ display: 'flex', width: '100%' }}>
                                      <div style={{ width: "50%" }}>
                                        <h5 style={{ fontWeight: 'bold' }}>
                                          Employee ID
                                        </h5>
                                      </div>
                                      <div style={{ width: "50%" }}>
                                        <p>{d.empid}</p>
                                      </div>
                                    </div>
                                    <div style={{ display: "flex", width: "100%", marginTop: '1%' }}>
                                      <div style={{ width: '50%' }}>
                                        <h5 style={{ fontWeight: "bold" }}>
                                          {" "}
                                          Name
                                        </h5>
                                      </div>
                                      <div style={{ width: '50%' }}>
                                        <p>{d.name}</p>
                                      </div>
                                    </div>
                                    <div style={{ display: "flex", width: "100%", marginTop: '1%' }}>
                                      <div style={{ width: '50%' }}>
                                        <h5 style={{ fontWeight: "bold" }}>
                                          {" "}
                                          Email
                                        </h5>
                                      </div>
                                      <div style={{ width: '50%' }}>
                                        <p>{d.email}</p>
                                      </div>
                                    </div>
                                    <div style={{ display: "flex", width: "100%", marginTop: '1%' }}>
                                      <div style={{ width: '50%' }}>
                                        <h5 style={{ fontWeight: "bold" }}>
                                          Designation
                                        </h5>
                                      </div>
                                      <div style={{ width: '50%' }}>
                                        <p>{d.designation}</p>
                                      </div>
                                    </div>
                                    <div style={{ display: "flex", width: "100%", marginTop: '1%' }}>
                                      <div style={{ width: '50%' }}>
                                        <h5 style={{ fontWeight: "bold", fontSize: 'auto' }}>
                                          Department
                                        </h5>
                                      </div>
                                      <div style={{ width: '50%' }}>
                                        <p>{d.department}</p>
                                      </div>
                                    </div>
                                  </>
                                );
                              })}
                            </Container>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Container>
              </div>
            </div>
          </div>
        </section>
        <section className="py-5">
          <div className="py-4">
            {
              Info.length > 0 ? <Container>
                <Button
                  onClick={() => {
                    handlePrint();
                  }}
                  style={{backgroundColor: "rgb(137, 179, 83)"}}
                >
                  Generate Report
                </Button>
              </Container> : ""
            }
          </div>
          <Container>
            {
              Info.length > 0 ? <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Srno</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Leave Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    Info.slice(Info.length - 6, Info.length).map((d, i) => {
                      return (
                        <tr>
                          <td>{i + 1}</td>
                          <td>{d.name}</td>
                          <td>{d.department}</td>
                          <td>{d.leaveType}</td>
                          <td>{new Date(d.from).toDateString()}</td>
                          <td>{new Date(d.to).toDateString()}</td>
                          <td>{d.reason}</td>
                          <td>
                            <span className={`${d.status === 'Pending Approval' ? "badge badge-warning" : d.status === "Approved" ? "badge badge-success" : d.status === "Reject" ? "badge badge-danger" : ""} border-0`}>{d.status}</span>
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </Table> : <div><h4 className="text-center">No leaves Data available</h4></div>
            }
          </Container>
        </section>
        <NotificationContainer />
      </div>
      <div className="pb-5 mb-5" style={{ display: "none" }}>
        <div ref={componentRef} className=" content-wrapper">
          <Report Info={Info} />
        </div>
      </div>
    </>
  );
};

export default LeaveRequest;
