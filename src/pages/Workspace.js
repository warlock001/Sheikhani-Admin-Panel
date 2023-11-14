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
import '../styles/Workspace.css';

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

function yourActionFunction(row) {
    console.log(row)
    window.open(`${REACT_APP_BASE_URL}/files/${row.document}/false`, "_blank");
}

const columns = [
    { field: 'id', headerName: 'No.', width: 80 },
    { field: 'title', headerName: 'Title', width: 170 },
    { field: 'roomId', headerName: 'Room ID', width: 170 },
    { field: 'creationDate', headerName: 'Creation Date', width: 470 },
    {
        field: "action",
        headerName: "Action",
        sortable: false,
        renderCell: ({ row }) =>
            <button style={{ background: "#fff", border: 0 }}>
                <img style={{ width: '100%', height: 25 }} src={require("../images/dots.png")} />
            </button>,
    },

];

function Workspace() {
    let navigate = useNavigate();


    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [shouldUpdate, setShouldUpdate] = useState(false);

    const [fileInputText, setFileInputText] = useState('Upload');

    //State to store table Column name
    const [tableRows, setTableRows] = useState([]);


    //State to store the values
    const [values, setValues] = useState([]);

    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);


    useEffect(() => {
        if (!validateAdminJWT()) {
            navigate('/login')
        }
    });



    useEffect(() => {
        async function getData() {

            let token = localStorage.getItem('jwt');
            let decodedToken = ''
            if (token) {
                setOpen(true)
                decodedToken = jwt(token);
                await axios.get(`${REACT_APP_BASE_URL}/workspace`).then((res) => {

                    setRows([])
                    res.data.group.forEach((element, index) => {
                        var date = new Date(element.createdAt)
                        let temp = {
                            id: index + 1,
                            title: element.title,
                            roomId: element.roomid,
                            creationDate: date.getMonth() + '/' + date.getDate() + '/' + date.getYear(),
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
                    <h1 class="font-face-gm" style={{ color: '#000' }}>All Workspace</h1>
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
                                // onChange={changeHandler}
                                hidden

                            />
                        </Button>


                    </div>

                    <Button
                        className='marginBottom'
                        variant="contained"
                        component="label"
                        onClick={() => {
                            // submit()
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

export default Workspace