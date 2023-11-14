import { useState, useEffect } from "react";
import validateAdminJWT from "../utils/validateAdminJWT"
import Backdrop from '@mui/material/Backdrop';
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import jwt from 'jwt-decode'
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Lottie from 'react-lottie-player'
import successLottieJson from '../images/Anim8_.json'
import errorLottieJson from '../images/error.json'
import Button from '@mui/material/Button';
import upload from '../images/cloud-computing.png'
import { DataGrid } from '@mui/x-data-grid';
import { Config } from '../config';
import Papa from "papaparse";

const REACT_APP_BASE_URL = Config.ip;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 250,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
};

const columns = [
    { field: 'id', headerName: 'No.', width: 80 },
    { field: 'firstName', headerName: 'First Name', width: 170 },
    { field: 'lastName', headerName: 'Last Name', width: 170 },
    { field: 'email', headerName: 'Email', width: 170 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 170 },
    { field: 'department', headerName: 'Department', width: 170 },
    { field: 'designation', headerName: 'Designation', width: 170 },
    { field: 'role', headerName: 'Role', width: 130 },

];

function Home() {
    let navigate = useNavigate();


    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [shouldUpdate, setShouldUpdate] = useState(false);
    const [parsedData, setParsedData] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const [fileInputText, setFileInputText] = useState('Upload');
    //State to store the values
    const [values, setValues] = useState([]);


    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);


    useEffect(() => {
        if (!validateAdminJWT()) {
            navigate('/login')
        }
    });

    const submit = async () => {
        if (tableRows.length !== 0 && values.length !== 0) {
            setOpen(true)
            let token = localStorage.getItem('jwt');
            let decodedToken = jwt(token);
            if (token) {
                await axios.post(`${REACT_APP_BASE_URL}/userdump`, {
                    rowsArray: tableRows,
                    valuesArray: values,
                    user: decodedToken._id,
                }).then((res) => {
                    setOpen(false)
                    setSuccessModalOpen(true)
                    console.log(res)
                    setShouldUpdate(!shouldUpdate)
                }).catch((err) => {
                    setOpen(false)
                    setErrorModalOpen(true)
                    console.log(err)
                })
            }


        } else {
            alert("Please fill all required files")
        }

    }

    const changeHandler = (event) => {
        console.log(event.target.files[0].name)

        setFileInputText(event.target.files[0].name.substring(0, 6) + "...")
        // Passing file data (event.target.files[0]) to parse using Papa.parse
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                const rowsArray = [];
                const valuesArray = [];

                // Iterating data to get column name and their values
                results.data.map((d) => {
                    rowsArray.push(Object.keys(d));
                    valuesArray.push(Object.values(d));
                });
                // Parsed Data Response in array format
                setParsedData(results.data);

                // Filtered Column Names
                setTableRows(rowsArray[0]);

                // Filtered Values
                setValues(valuesArray);



            },
        });
    };


    useEffect(() => {
        async function getData() {

            let token = localStorage.getItem('jwt');
            let decodedToken = ''
            if (token) {
                setOpen(true)
                decodedToken = jwt(token);
                await axios.get(`${REACT_APP_BASE_URL}/user`).then((res) => {

                    setRows([])
                    res.data.user.forEach((element, index) => {
                        // console.log(element)
                        let temp = {
                            id: index + 1,
                            firstName: element.firstName,
                            lastName: element.lastName,
                            email: element.email,
                            phoneNumber: element.dialCode + ' ' + element.mobile,
                            department: element.department,
                            designation: element.designation,
                            role: element.role,

                        }
                        setRows(rows => [...rows, temp]);
                    });



                    // console.log(res)
                    setOpen(false)
                }).catch((err) => {
                    console.log(err)
                    setOpen(false)
                })
            }



        }

        getData()
    }, [shouldUpdate]);

    return (
        <div className="screen-root-div">

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            // onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>


            <Modal
                open={successModalOpen}
                onClose={() => [
                    setSuccessModalOpen(false)
                ]}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Success!
                    </Typography>
                    <Lottie
                        loop
                        animationData={successLottieJson}
                        play
                        style={{ width: 250, height: 250 }}
                    />
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        List Added Successfully
                    </Typography>
                </Box>
            </Modal>

            <Modal
                open={errorModalOpen}
                onClose={() => [
                    setErrorModalOpen(false)
                ]}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Error!
                    </Typography>
                    <Lottie
                        loop
                        animationData={errorLottieJson}
                        play
                        style={{ width: 250, height: 250 }}
                    />
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Unknown Error Occured
                    </Typography>
                </Box>
            </Modal>


            <div className="toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 class="font-face-gm" style={{ color: '#000' }}>All Users</h1>
                </div>


                <div className="toolbarInside" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '25px' }}>

                    <div className='toolbarBTNGroup toolbarBTNGroupColumn'>
                        <Button
                            variant="outlined"
                            component="label"
                        >
                            <img style={{ width: '25px', marginRight: '10px' }} src={upload} />
                            {fileInputText}
                            <input
                                type="file"
                                name="file"
                                accept=" .csv"
                                onChange={changeHandler}
                                hidden

                            />
                        </Button>


                    </div>

                    <Button
                        className='marginBottom'
                        variant="contained"
                        component="label"
                        onClick={() => {
                            submit()
                        }}
                    >
                        Submit
                    </Button>



                </div>
            </div>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[10, 50, 100]}
            />
        </div>
    )
}

export default Home