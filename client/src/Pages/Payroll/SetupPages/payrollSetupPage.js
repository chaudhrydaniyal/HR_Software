import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import App from "./FormulaInput/FormulaEditor";
import HeaderContext from '../../../Context/HeaderContext'

const Setup = () => {

  const [payrollSetups, setPayrollSetups] = useState([])
  const [show, setShow] = useState(false);
  const [setupTitle, setSetupTitle] = useState("");
  const [setupFormula, setSetupFormula] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  useEffect(() => {
    const fetchData = async () => {
        const res = await axios.get('payrollsetup/')
        setPayrollSetups(res.data)
    }
    fetchData()
}, [])

const a = useContext(HeaderContext)
useEffect(() => {
  a.update("Human Resource / Payroll setup")
})

  return (
    <div>
      <div className="content-wrapper " style={{ backgroundColor: "#f7f7f7" }}>
        <section className="content-header ">
          <div className="container">
            <div className="row align-items-center">
              <div className="col">
                {/* <h3 className="page-title">Payroll</h3>
                <ul
                  className="breadcrumb"
                  style={{ backgroundColor: "#f7f7f7" }}
                >
                  <li className="breadcrumb-item">
                    <Link to="/" style={{ color: "#1f1f1f" }}>
                    Human Resource
                    </Link>
                  </li>
                  <li className="breadcrumb-item active">Payroll</li>
                </ul> */}
                <div className="col-auto float-end ms-auto">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Button variant="primary" onClick={handleShow}>
                    <i
                        className="fa fa-plus"
                        style={{ fontSize: "14px", marginRight: "2px" }}
                      >
                        {" "}
                      </i>
                      Add Setup
                    </Button>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container">
            <div className="card">
              <div className="card-header buttoncolor ">
                <h3 className="card-title" style={{ color: "white" }}>
                  Payroll Setups
                </h3>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <div style={{ height: "min-content", width: "100%" }}>
                    <Container >
                      {payrollSetups.map((ps) =>
                        <Card>
                          <Row className="px-3">
                            <Col xxl='12' xl='12' md='12' lg='12' sm='12'>
                              <Row>
                                <Col xl='3' lg='3' md='3'>
                                  <div className="d-flex flex-column justify-content-center py-3">
                                    <div><h6 className="font-weight-bold">Title</h6></div>
                                    <div><p>{ps.title}</p></div>
                                  </div>
                                </Col>
                                <Col xl='9' lg='9' md='9'>
                                  <div className="d-flex flex-column justify-content-center py-3">
                                    <div><h6 className="font-weight-bold">Formula</h6></div>
                                    <div><p>{ps.npd_formula}</p></div>
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Card>
                      )
                      }

                    </Container>
                    <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <App setSetupTitle={setSetupTitle} setSetupFormula={setSetupFormula}></App></Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                          Close
                        </Button>
                        <Button variant="primary" onClick={async () => {
                          const savesetup = await axios.post("payrollsetup", { title: setupTitle, npd_formula: setupFormula });

                          handleClose()
                        }}>
                          Save Changes
                        </Button>
                      </Modal.Footer>
                    </Modal>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Setup;