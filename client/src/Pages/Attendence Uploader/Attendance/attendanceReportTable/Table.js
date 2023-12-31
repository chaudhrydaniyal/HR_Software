import React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import "./table.css"
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const Table = ({ data, setTableData }) => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [Employee_ID, setEmployee_ID] = useState("");
    const [Name, setName] = useState("");
    const [In, setIn] = useState("");
    const [Out, setOut] = useState("");
    const [Department, setDepartment] = useState("")
    const [tableSearch, setTableSearch] = useState("");

    const columns = [

        { field: "Employee_ID", headerName: "Employee_ID", width: 100 },
        { field: "Name", headerName: "Name", width: 250 },
        { field: "Department", headerName: "Department", width: 200 },
        { field: "Date", headerName: "Date", width: 200 },
        { field: "In", headerName: "In", width: 100 },
        { field: "Out", headerName: "Out", width: 100 },
        {
            field: "Status", headerName: "Status", width: 150, renderCell: (params) => {
                return (<>
                    <div style={{ color: params.value == "Absent" ? "red" : "green" }}>
                        {params.value}

                    </div>
                </>)
            }
        },
        {
            field: "Action", headerName: "Action", width: 100, renderCell: (params) => {
                return (<Button variant="primary" onClick={() => {
                    setEmployee_ID(params.value.Employee_ID)
                    setName(params.value.Name)
                    setDepartment(params.value.Department)
                    setIn(params.value.in)
                    setOut(params.value.out)
                    setTableData(data)
                    handleShow()
                }}
                    style={{ backgroundColor: "rgb(137, 179, 83)" }}>
                    Edit
                </Button>)
            }
        },
    ]
    const rows = data.length > 0 && data.filter((d) => d.Name && d.Name.toLowerCase().includes(tableSearch.toLowerCase())).map((row, index) => (
        {
            id: index,
            Employee_ID: row.Employee_ID,
            Name: row.Name,
            Date: row.Date,
            Department: row.department,
            In: row.in,
            Out: row.out,
            Status: row.in.split(":")[0] != "NaN" ? "Present" : "Absent",
            Action: row
        }))

    return (
        <div>
            <Modal style={{ marginTop: "30vh" }} show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        Employee Id:
                        <input style={{ marginLeft: "3%", marginTop: '2%' }} value={Employee_ID} onChange={(e) => {
                            setEmployee_ID(e.target.value)
                        }}></input> </div>
                    Name:
                    <input style={{ marginLeft: "12.5%", marginTop: '2%' }} value={Name} onChange={(e) => { setName(e.target.value) }}></input><br />
                    In:
                    <input style={{ marginLeft: "18.5%", marginTop: '2%' }} type="time" value={In} onChange={(e) => { setIn(e.target.value) }}></input><br />
                    Out:
                    <input style={{ marginLeft: "15.5%", marginTop: '2%' }} type="time" value={Out} onChange={(e) => { setOut(e.target.value) }}></input>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => {
                        data.filter((d) => d.Employee_ID == Employee_ID)[0].Name = Name
                        data.filter((d) => d.Employee_ID == Employee_ID)[0].in = In
                        data.filter((d) => d.Employee_ID == Employee_ID)[0].out = Out
                        setShow(false)
                    }}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="d-flex justify-content-center"  >
                <div >
                    <div className="d-flex justify-content-between">
                        <div style={{ width: 170 }}></div>
                    </div>
                    Search Employee: <input style={{ width: "50vw" }} value={tableSearch} onChange={(e) => { setTableSearch(e.target.value) }}></input>
                    <br />
                    <br />
                    <DataGrid
                        style={{ height: "68vh", width: "76vw" }}
                        rows={rows}
                        columns={columns}
                        pageSize={40}
                    />
                </div>
            </div>
        </div>
    )
}

export default Table