import React from "react";
import { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HolidaysDetails from "./HolidaysDetails/HolidaysDetails";
import "react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useContext } from "react";
import HeaderContext from '../../Context/HeaderContext'


const Holiday = () => {

  const [show, setShow] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [calendar, setcalendar] = useState([]);
  const [calendarId, setStoreId] = useState("");
  const [title, settitle] = useState("");
  const [from, setfrom] = useState("");
  const [type, settype] = useState("");
  const [to, setto] = useState("");
  const [update, setupdate] = useState(true);

  const [validation, setvalidate] = useState({
    calendarId: "",
    title: "",
    from: "",
    type: "",
    to: "",
  });
  const url = "holiday/addholiday";

  //posting calendar with holidays 
  const fetchData = async () => {
    try {
      const res = await axios.get(process.env.React_APP_ORIGIN_URL + "calendar");
      const data = res.data.calendar;
      setcalendar(data);
    } catch (error) {
      NotificationManager.error("error");
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    const newHoliday = {
      title,
      from,
      to,
    };
    let errors = { ...validation };
    if (!title.trim()) {
      errors.title = "Required Field";
    } else if (!title.trim().length <= 5) {
      errors.title = "Title is very short";
    } else {
      errors.title = "";
    }

    //date validation
    if (!from) {
      errors.from = "Date is required";
    } else if (!to) {
      errors.from = "date is required";
    }
    setvalidate(errors);
    try {
      const saveHoliday = await axios.post(process.env.React_APP_ORIGIN_URL + url, newHoliday);
      saveHoliday && handleClose();
      NotificationManager.success("Successfully Created");
    } catch (error) {
      NotificationManager.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchData();
  }, [update]);

  const a = useContext(HeaderContext)
  useEffect(() => {
    a.update("Human Resource / Holidays")
  })


  const handleInput = (e) => {
    e.preventDefault();
    setStoreId(e.target.value);
  };

  return (
    <>
      <div className="content-wrapper" style={{ backgroundColor: "#f7f7f7" , marginTop:"30px"}}>
  
        <section className="centent">
          <div className="container-fluid">
            <div className="card" style={{width:"92%", margin: "0 auto"}}>
              <div
                className="card-header  "
                style={{ backgroundColor: "#26ad9d" , display: "block"}}
              >
                <h3 className="card-title" style={{ color: "white" , fontWeight: "700"}}>
                  Available Holidays
                </h3>
                <div className="col">
                <div className="col-auto float-end">
                  <a
                    className="btn add-btn "
                    data-bs-toggle="modal"
                    data-bs-target="#add_calendar"
                    onClick={handleShow}
                    style={{ backgroundColor: "#89b353", color: "#ffffff", padding: "6px 5px" }}
                  >
                    <i className="fa fa-plus">
                      {"    "}
                    
                    </i>
                    {"  "}Add Holiday
                  </a>
                </div>
              </div>
              </div>
              <div className="card-body">
                <div className="table-responsive" style={{ height: "700px", width: "100%" }}>
                  <HolidaysDetails />

                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <NotificationContainer />

      {/* add holiday popup modal */}
      <Modal
        size="md"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="header-modal"
          >
            <CalendarMonthIcon style={{ color: "#ff9b44" }} />{" "}
            <span>Add Holidays</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form type="submit" onSubmit={handlePost}>
            <Form.Group>
              <Form.Group className="mb-3 mt-4" controlId="formBasicEmail">
                <Form.Label>Holiday Name </Form.Label>
                <Form.Control
                  type="text"
                  name="holiday"
                  placeholder="Holiday Name"
                  onChange={(e) => {
                    settitle(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3 mt-4" controlId="formBasicEmail">
                <Form.Label>From</Form.Label>
                <Form.Control
                  type="date"
                  name="from"
                  onChange={(e) => {
                    setfrom(e.target.value);
                  }}
                />
              </Form.Group>
              {validation.from && (
                <p style={{ color: "red", fontSize: "13px" }}>
                  {validation.from}
                </p>
              )}
              <Form.Group className="mb-3 mt-4" controlId="formBasicEmail">
                <Form.Label>To</Form.Label>
                <Form.Control
                  type="date"
                  name="to"
                  onChange={(e) => {
                    setto(e.target.value);
                  }}
                />
              </Form.Group>
              {validation.to && (
                <p style={{ color: "red", fontSize: "13px" }}>
                  {validation.to}
                </p>
              )}
              <Form.Group>
                <Form.Label>Holiday Type</Form.Label>
                <Form.Control
                  type="text"
                  name="type"
                  onChange={(e) => {
                    settype(e.target.value);
                  }}
                />
              </Form.Group>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button type="submit" className="btn mt-4" style={{backgroundColor: "rgb(137, 179, 83)"}}>
                  Add Holidays
                </Button>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default Holiday;
