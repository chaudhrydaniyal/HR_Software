import React from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import axios from "axios";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Calendar from 'react-calendar';

import { useContext } from "react";
import { Context } from "../../../Context/Context";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import LeaveApplication from "./LeaveApplication";
import PrintIcon from "@mui/icons-material/Print";
import HeaderContext from '../../../Context/HeaderContext'

const LeavesHistory = () => {

  const options = { day: "numeric", month: "short", year: "numeric" };
  const dateFormatter = new Intl.DateTimeFormat("en-GB", options);

  const a = useContext(HeaderContext)
  useEffect(() => {
    a.update("Human Resource / Leave Management")
  })
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [handlemodal, sethandlemodal] = useState(false);
  const [date, setDate] = useState(new Date());

  const [month, setMonth] = useState(new Date().toLocaleString('en-US', { month: "long" }))
  const [monthNumeric, setMonthNumeric] = useState(new Date().toLocaleString('en-US', { month: "numeric" }))
  const [year, setYear] = useState(new Date().toLocaleString('en-US', { year: "numeric" }))

  const [currentCalendar, setCurrentCalendar] = useState(new Date().toLocaleString("en-US").split(",")[0])


  const [calendarDate, setCalendarDate] = useState("")


  function onChangeCalendar(e) {

    console.log("calendar", e)



    setCalendarDate(e)

    setCurrentCalendar(e.toLocaleString('en-US').split(",")[0])
    setMonth(e.toLocaleString('en-US', { month: "long" }))
    setYear(e.toLocaleString('en-US', { year: "numeric" }))
    setMonthNumeric( e.toLocaleString('en-US', { month: "numeric" }))

    console.log("month- year",monthNumeric, year)

    setUpdate(!update)

    handleCloseCalendar()
  }


  function getMimetype(extension) {
    var mimetype;

    switch (extension) {
      case ".jpeg":
      case ".jpg":
        // JPEG Image
        mimetype = "image/jpeg";
        break;
      case ".jpgv":
        // JPGVideo
        mimetype = "video/jpeg";
        break;
      case ".png":
        // Portable Network Graphics (PNG)
        mimetype = "image/png";
        break;

      case ".svg":
        // Scalable Vector Graphics (SVG)
        mimetype = "image/svg+xml";
        break;

      case ".xls":
        // Microsoft Excel
        mimetype = "application/vnd.ms-excel";
        break;
      case ".xlam":
        // Microsoft Excel - Add-In File
        mimetype = "application/vnd.ms-excel.addin.macroenabled.12";
        break;

      case ".xlsm":
        // Microsoft Excel - Macro-Enabled Workbook
        mimetype = "application/vnd.ms-excel.sheet.macroenabled.12";
        break;
      case ".pptx":
        // Microsoft Office - OOXML - Presentation
        mimetype =
          "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        break;

      case ".xlsx":
        // Microsoft Office - OOXML - Spreadsheet
        mimetype =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        break;

      case ".docx":
        // Microsoft Office - OOXML - Word Document
        mimetype =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        break;
      case ".dotx":
        // Microsoft Office - OOXML - Word Document Template
        mimetype =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.template";
        break;
      case ".ppt":
        // Microsoft PowerPoint
        mimetype = "application/vnd.ms-powerpoint";
        break;

      case ".doc":
        // Microsoft Word
        mimetype = "application/msword";
        break;

      case ".pdf":
        // Adobe Portable Document Format
        mimetype = "application/pdf";
        break;
      case ".txt":
        // Text File
        mimetype = "text/plain";
        break;
      default:
        break;
    }

    if (mimetype) {
      return mimetype;
    }

    switch (extension) {
      case ".7z":
        // 7-Zip
        mimetype = "application/x-7z-compressed";
        break;

      case ".ace":
        // Ace Archive
        mimetype = "application/x-ace-compressed";
        break;
      case ".acc":
        // Active Content Compression
        mimetype = "application/vnd.americandynamics.acc";
        break;

      case ".avi":
        // Audio Video Interleave (AVI)
        mimetype = "video/x-msvideo";
        break;

      case ".csv":
        // Comma-Seperated Values
        mimetype = "text/csv";
        break;

      case ".texinfo":
        // GNU Texinfo Document
        mimetype = "application/x-texinfo";
        break;

      case ".html":
        // HyperText Markup Language (HTML)
        mimetype = "text/html";
        break;

      case ".m3u":
        // M3U (Multimedia Playlist)
        mimetype = "audio/x-mpegurl";
        break;
      case ".m4v":
        // M4v
        mimetype = "video/x-m4v";
        break;

      case ".mpeg":
        // MPEG Video
        mimetype = "video/mpeg";
        break;

      case ".mp4a":
        // MPEG-4 Audio
        mimetype = "audio/mp4";
        break;
      case ".mp4":
        // MPEG-4 Video
        mimetype = "video/mp4";
        break;
      case ".mp4":
        // MPEG4
        mimetype = "application/mp4";
        break;

      case ".weba":
        // Open Web Media Project - Audio
        mimetype = "audio/webm";
        break;
      case ".webm":
        // Open Web Media Project - Video
        mimetype = "video/webm";
        break;

      case ".psd":
        // Photoshop Document
        mimetype = "image/vnd.adobe.photoshop";
        break;

      case ".pic":
        // PICT Image
        mimetype = "image/x-pict";
        break;

      case ".au":
        // Sun Audio - Au file format
        mimetype = "audio/basic";
        break;

      case ".tar":
        // Tar File (Tape Archive)
        mimetype = "application/x-tar";
        break;

      case ".wav":
        // Waveform Audio File Format (WAV)
        mimetype = "audio/x-wav";
        break;

      case ".webp":
        // WebP Image
        mimetype = "image/webp";
        break;

      case ".xml":
        // XML - Extensible Markup Language
        mimetype = "application/xml";
        break;

      case ".zip":
        // Zip Archive
        mimetype = "application/zip";
        break;

      default:
        // Binary Data
        mimetype = "application/octet-stream";
        break;
    }

    return mimetype;
  }

  const [modaldata, setmodaldata] = useState({});
  const [show, setShow] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleClose = () => setShow(false);
  const [leavesData, setLeavesData] = useState([]);
  const [status, setstatus] = useState();
  const [supervisorApproval, setSupervisorApproval] = useState();
  const [update, setUpdate] = useState(true);

  const handleShow = (id) => {
    setmodaldata(id.row);
    setstatus(id.row.status);
    setShow(true);
    setSupervisorApproval(id.row.supervisorApproval);
  };

  const handleCloseCalendar = () => setShowCalendar(false);
  const handleShowCalendar = () => setShowCalendar(true);


  const { user } = useContext(Context);
  const getLeavesrequests = async () => {
    var getLeaves = [];
    {
        getLeaves = await axios.get(process.env.React_APP_ORIGIN_URL + `leaverequest/employee/${user.id}/${monthNumeric}/${year}`);
      
    }
    const data = getLeaves.data;
    setLeavesData(data.allRequest);
  };
  //data for report generate;
  const newArray = [];
  leavesData.map((d) => {
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(d.from); // 29th of Feb at noon your timezone
    var secondDate = new Date(d.to);
    var diffDays = Math.round(
      Math.abs((secondDate.getTime() - firstDate.getTime()) / oneDay) + 1
    );

    newArray.push({
      id: d._id,
      Emp_id: d.employee && d.employee.emp_id,
      leavetype: d.leaveType,
      employeename: d.employee && d.employee.firstname,
      department: d.employee && d.employee.departments && d.employee.departments.map((d) => d.departmentname),
      from: dateFormatter.format(new Date(d.from)),
      to: dateFormatter.format(new Date(d.to)),
      date: new Date(d.applicationdate).toDateString(),
      fromTime: d.fromTime,
      toTime: d.toTime,
      Short_leave: d.Short_leave ? 'Short Leave' : 'Full day',
      leaveNature: d.leaveNature,
      reason: d.reason,
      totaldays: diffDays,
      status: d.status,
      designation: d.employee && d.employee.designation,
      supervisorApproval: d.supervisorApproval,
      attachment: d.attachment,
      applicationdate: d.applicationdate,
      leaves: d.employee && d.employee.Leaves && d.employee.Leaves.map((d) => d),
    });
  });

  const updateUserStatus = async (e) => {
    e.preventDefault();
    const updateStatus = `leaverequest/${modaldata.id}`;
    try {
      const update = await axios.put(process.env.React_APP_ORIGIN_URL + updateStatus, {
        status,
        supervisorApproval,
      });
      NotificationManager.success("Successfully Updated");
      handleClose();
    } catch (error) {
      console.log(error);
      NotificationManager.error("Failed to Update");
    }
    setUpdate(!update);
  };

  useEffect(() => {
    getLeavesrequests();
  }, [update]);

  const rows = newArray;
  console.log("row",)
  const columns = [
    { field: "employeename", headerName: "Employee Name", width: 150 },
    { field: "department", headerName: "Department", width: 150 },
    { field: "leavetype", headerName: "Leave-type", width: 110 },
    {
      field: "from",
      headerName: "From ",
      width: 200,
      renderCell: (params) => {
        const fromTime = params.row.fromTime ? ` - ${params.row.fromTime}` : '';
        return `${params.row.from}${fromTime}`;
      },
    },
    {
      field: "to",
      headerName: "To ",
      width: 200,
      renderCell: (params) => {
        const toTime = params.row.toTime ? ` - ${params.row.toTime}` : '';
        return `${params.row.to}${toTime}`;
      },
    },
    { field: "Short_leave", headerName: "Duration", width: 100 },
    {
      field: "supervisorApproval",
      headerName: "Supervisor Approval",
      width: 150,
    },
    { field: "status", headerName: "Status", width: 100 },
    {
      field: "action",
      headerName: "Action",
      width: 65,
      renderCell: (id) => {
        return (
          <div>
            <BorderColorIcon
              onClick={() => {
                handleShow(id);
                sethandlemodal(!handlemodal);
              }}
            />
          </div>
        );
      },
    },
    // {
    //   field: "print",
    //   headerName: "Print",
    //   width: 80,
    //   renderCell: (id) => {
    //     return (
    //       <div>
    //         <PrintIcon
    //           onClick={async () => {
    //             const setdata = await setmodaldata(id.row);
    //             handlePrint();
    //           }}
    //         />
    //       </div>
    //     );
    //   },
    // },
  ];


  return (
    <div>
      <div
        className="content-wrapper my-1"
        style={{ backgroundColor: "#f7f7f7", marginTop: "20px" }}
      >
        <section className="content" style={{ marginTop: "30px" }}>
          <div className="container">
            <div className="card">
              <div className="card-header buttoncolor ">
                <h3 className="card-title" style={{ color: "white" }}>
                  Leaves History
                </h3>

              </div>
              <div className="card-body">
                
              <Button className="mr-3" variant="primary" onClick={handleShowCalendar} style={{ backgroundColor: "rgb(137, 179, 83)" }}>
                  Select the month
                </Button>
                <input className="" value={`${month} - ${year}`}
                // disabled="true"
                ></input>
                <Modal show={showCalendar} onHide={handleCloseCalendar}>
                  <div className='d-flex justify-content-center'>
                    <Calendar
                      onChange={onChangeCalendar}
                      value={calendarDate}
                      maxDetail='year'
                    />
                  </div>
                </Modal>
                <div className="mt-3" style={{ width: "100%", height: "700px" }}>

                  <DataGrid columns={columns} rows={rows} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form>
                <Form.Label>Employee ID</Form.Label>
                <Form.Control disabled value={modaldata.Emp_id}></Form.Control>
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  disabled
                  value={modaldata.employeename}
                ></Form.Control>
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Label>Department</Form.Label>
                <Form.Control
                  disabled
                  value={modaldata.department}
                ></Form.Control>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form>
                <Form.Label>Date</Form.Label>
                <Form.Control disabled value={modaldata.date}></Form.Control>
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Label>Leave Type</Form.Label>
                <Form.Control
                  disabled
                  value={modaldata.leavetype}
                ></Form.Control>
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Label>Leave Nature</Form.Label>
                <Form.Control disabled value={modaldata.leaveNature}></Form.Control>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form>
                <Form.Label>From</Form.Label>
                <Form.Control disabled value={modaldata.from}></Form.Control>
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Label>to</Form.Label>
                <Form.Control disabled value={modaldata.to}></Form.Control>
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Label>Total Days</Form.Label>
                <Form.Control
                  disabled
                  value={modaldata.totaldays}
                ></Form.Control>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form>
                <Form.Label> Time from</Form.Label>
                <Form.Control disabled value={modaldata.fromTime}></Form.Control>
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Label> Time to</Form.Label>
                <Form.Control disabled value={modaldata.toTime}></Form.Control>
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Label>Duration</Form.Label>

                <Form.Control disabled value={modaldata.Short_leave == "True" ? 'Short leave' : 'Full day'}></Form.Control>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form>
                <Form.Label>Reason</Form.Label>
                <Form.Control disabled value={modaldata.reason}></Form.Control>
              </Form>
            </Col>
          </Row>
          <Row>
            <Form>

              <Form.Label>Attachment</Form.Label>
              <Row>
                <Col sm={9}>
                  <Form.Control
                    disabled
                    value={modaldata.attachment && modaldata.attachment.name}
                  ></Form.Control>
                </Col>

                <Col sm={3}>
                  <Button
                    style={{ width: "100%", backgroundColor: "rgb(137, 179, 83)" }}
                    onClick={() => {
                      var extension = modaldata.attachment.name.substring(
                        modaldata.attachment.name.lastIndexOf(".")
                      );
                      var mimetype = getMimetype(extension);
                      const linkSource = `data:${mimetype};base64,${modaldata.attachment &&
                        modaldata.attachment.file}`;
                      const downloadLink = document.createElement("a");
                      const fileName = `attachment${extension}`;
                      downloadLink.href = linkSource;
                      downloadLink.download = fileName;
                      downloadLink.click();
                    }}
                  >
                    Download
                  </Button>
                </Col>
              </Row>
            </Form>
          </Row>

          <Row> &nbsp; &nbsp;</Row>

          {/* {!user.isAdmin && ( */}
            <>
              <h5 className="my-3">Supervisor Approval</h5>
              {/* <hr></hr> */}
              <Row>
                <Col>
                  <Form onSubmit={updateUserStatus}>
                    {/* <Form.Label>Status</Form.Label> */}
                    <Form.Select
                      value={supervisorApproval}
                      onChange={(e) => {
                        setSupervisorApproval(e.target.value);
                      }}
                      disabled

                    >
                      <option disabled selected>
                        select...
                      </option>
                      <option>Pending Approval</option>
                      <option>Reject</option>
                      <option>Approved</option>
                    </Form.Select>
                 
                  </Form>
                </Col>
              </Row>{" "}
            </>
          {/* )} */}
          {/* {user.isAdmin && ( */}
            <>
              <h5 className="my-3">HR Approval</h5>
              {/* <hr></hr> */}
              <Row>
                <Col>
                  <Form onSubmit={updateUserStatus}>
                    {/* <Form.Label>Status</Form.Label> */}
                    <Form.Select
                      value={status}
                      onChange={(e) => {
                        setstatus(e.target.value);
                      }}
                      disabled
                    >
                      <option disabled selected>
                        select...
                      </option>
                      <option>Pending Approval</option>
                      <option>Reject</option>
                      <option>Approved</option>
                    </Form.Select>
        
                  </Form>
                </Col>
              </Row>
            </>
          {/* )} */}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
      <div style={{ display: "none" }}>
        <div ref={componentRef} className=" content-wrapper">
          {<LeaveApplication modaldata={modaldata} />}
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
};

export default LeavesHistory;