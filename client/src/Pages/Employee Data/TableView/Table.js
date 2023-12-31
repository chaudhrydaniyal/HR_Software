import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./table.css";
import avatar from "../All Employees/avatar.png";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Modal, Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import NotificationManager from "react-notifications/lib/NotificationManager";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
const moment = require("moment");

const Table = ({ data }) => {
  const [show, setshow] = useState(false);
  const [showmodal, setShowmodal] = useState(false);
  const handleClosemoal = () => setshow(false);
  const [modaldata, setmodaldata] = useState({});
  const [currentAttendance, setCurrentAttendance] = useState({});
  const [checkin, setcheckin] = useState(false);
  const [checkout, setcheckout] = useState(false);
  const [employee, setemployeeId] = useState("");
  const [date, setdate] = useState(new Date(Date.now()));
  const [In, setin] = useState("");
  const [out, setout] = useState("");
  const [name, setName] = useState("");
  const [month, setmonth] = useState("");

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dates = monthNames[date.getMonth()];

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      const postdata = await axios.put(process.env.React_APP_ORIGIN_URL + `updateuserattendance/${employee}`, {
        employee,
        date,
        in: In,
        out: out,
        name,
        month,
        status: "P",
      });
      postdata && NotificationManager.success("Attendance added successfully");
    } catch (error) {
      ;
      NotificationManager.error("Failed to add ");
    }
  };

  const checkInn = () => {
    setcheckin(true);
    setin(moment(new Date().getTime()).format("h:mm:ss a"));
  };
  const checkOut = () => {
    setcheckout(true);
    setout(moment(new Date().getTime()).format("h:mm:ss a"));
  };


  const handleShowmodal = async (params) => {
    setmodaldata(params.row.identity);
    const dateAttendance = await axios.get(process.env.React_APP_ORIGIN_URL + `currentUserAttendance`, {
      params: {
        date: new Date(new Date().toISOString().split("T")[0]),
        employee: params.row.identity,
      },
    });
    await setCurrentAttendance(dateAttendance);
    setemployeeId(params.row.identity);
    setName(params.row.Employees);
    setshow(true);
  };

  const columns = [
    { field: "id", headerName: "Emp ID", width: 140 },
    {
      field: "Employees",
      headerName: "Employees",
      width: 230,
      renderCell: (params) => {
        return (
          <>
            <div className="userListUser">

              {params.row.profilepic ? (

                <img src={params.row.profilepic} className="userListImg" />

              ) : (
                <img src={avatar} className="userListImg" />
              )}
              {params.row.Employees}
            </div>
          </>
        );
      },
    },

    { field: "Department", headerName: "Department", width: 200 },
    { field: "payroll_setup", headerName: "Payroll Setup", width: 210 },
    { field: "work_shift", headerName: "Work Shift", width: 200 },
    {
      field: "RenderCell",
      headerName: "See Deatils",
      width: 160,
      renderCell: (params) => {
        return (
          <>
            <div>
              <Link
                to={`/employees/${params.row.identity}`}
                className={"buttoncolor px-2 py-1 rounded"}
                style={{backgroundColor: "rgb(137, 179, 83)"}}
              >
                Details
              </Link>
            </div>
          </>
        );
      },
    },
    {
      field: "manualattendance",
      headerName: "Manual Attendance",
      width: 200,
      renderCell: (params) => {

        return (
          <>
            <div>
              <p
                className={"buttoncolor px-2 py-1 rounded "}
                onClick={() => {
                  handleShowmodal(params);
                  setShowmodal(!showmodal);
                }}
                style={{backgroundColor: "rgb(137, 179, 83)",cursor: "pointer"}}
              >
                Add Attendance
              </p>
            </div>
          </>
        );
      },
    },
  ];
  console.log(data)
  const rows = data.map((row) => ({
    id: row.emp_id,
    Employees: row.firstname + " " + row.lastname,
    profilepic: row.profilepic,
    Department: row.departments.map((rd) => rd.departmentname),
    payroll_setup: row.payroll_setup && row.payroll_setup.title,
    work_shift: row.work_shift && row.work_shift.shift_name,
    identity: row._id,
  }
  ));
  return (
    <>
      <div className="userList" style={{ width: "100%", height: "700px" }}>
        <DataGrid rows={rows} columns={columns} />
        <NotificationContainer />
      </div>
      <Modal
        show={show}
        onHide={handleClosemoal}
        centered
        size="lg"
        keyboard={false}
      >
        <Modal.Header closeButton>Attendance</Modal.Header>
        <Modal.Body>
          <Form className="p-0 w-100" onSubmit={handleForm}>
            <div className="px-3">
              <p>Date</p>
            </div>
            <div className="d-flex justify-content-between align-items-center w-100 px-2">
              <div>
                <div>
                  <Form.Control
                    type="date"
                    value={new Date().toISOString().slice(0, 10)}
                    required
                    onChange={(e) => {
                      setdate(new Date(e.target.value));
                      setmonth(dates);
                    }}
                  />
                </div>
              </div>
              <div>
                {checkin ? (
                  In
                ) : (
                  <button className="btn btn-primary" onClick={checkInn}  style={{backgroundColor: "rgb(137, 179, 83)"}}>
                    Check In
                  </button>
                )}
              </div>

              <div>
                {checkout ? (
                  out
                ) : (
                  <button className="btn btn-primary" onClick={checkOut}  style={{backgroundColor: "rgb(137, 179, 83)"}}>
                    Check Out
                  </button>
                )}

              </div>
              <div>
                <Button className=" rounded " type="submit"  style={{backgroundColor: "rgb(137, 179, 83)"}}>
                  Submit Attendance
                </Button>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Table;
