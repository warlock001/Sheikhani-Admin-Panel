import { useState, React, useEffect } from "react";
import '../styles/Login.css';
import { TextField } from "@material-ui/core";
import InputAdornment from '@mui/material/InputAdornment';
import axios from "axios";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Config } from '../config';
import { useNavigate } from "react-router-dom";
import jwt from 'jwt-decode'
import LogoHero from '../images/LogoHero.png'

const REACT_APP_BASE_URL = Config.ip;

const Login = (props) => {
    let navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    const [shouldUpdate, setShouldUpdate] = useState(false);

    const submit = async () => {
        console.log(email)
        setError("")
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


        if (re.test(email)) {
            setOpen(true)
            await axios.post(`${REACT_APP_BASE_URL}/login`, {
                email: email,
                password: password
            }).then((res) => {
                console.log(res)
                setError(res.data.message)
                setOpen(false)
                localStorage.setItem('jwt', res.data.token);
                if (res.data.role === 'admin') {
                    navigate("/");
                }
                props.setShouldUpdate(!props.shouldUpdate)
            }).catch((err) => {
                // setError(err.response.data.message)
                console.log(err)
                setOpen(false)
            })
        } else {
            setError("Invalid Email Address !")
        }

    }

    useEffect(() => {

        const keyDownHandler = event => {

            if (event.key === 'Enter') {
                event.preventDefault();
                submit();
            }
        };

        document.addEventListener('keydown', keyDownHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };

    })


    useEffect(() => {
        let token = localStorage.getItem('jwt');
        if (token) {
            let decodedToken = jwt(token);
            if (decodedToken.role === 'admin') {
                navigate('/')
            }
        }


    }, [shouldUpdate]);


    return (
        <div className="loginScreen">
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            // onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>


            <div className='loginContainer'>

                <img className="loginLogo" src={LogoHero} />
                <p className="font-face-gm heading-primary">Welcome to Sheikhani Group</p>
                <p className="font-face-gm-secondary heading-secondary"> Communication</p>

                <TextField type="email" className="inputFeild" id="outlined-basic" label="Email" variant="outlined"
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    InputProps={{
                        inputProps: { style: { color: '#000' } },

                    }} />


                <TextField className="inputFeild" id="outlined-basic" label="Password" type="password" variant="outlined"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    InputProps={{
                        inputProps: { style: { color: '#000' } },

                    }} />
                <div className="submitContainer" >
                    <button type="submit" style={{ width: '100%', padding: '15px 20px' }} onClick={() => {
                        submit(email)
                    }} className="primaryBTN">LOGIN</button>
                </div>

                <div style={{ width: '400px' }}>
                    <p>{error}</p>
                </div>
            </div>
        </div>
    )
}

export default Login
