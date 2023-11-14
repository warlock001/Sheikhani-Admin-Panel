import { useEffect, useState, React, useRef } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom';

//import pages
import Login from './pages/Login';
import Home from './pages/Home';
import Workspace from './pages/Workspace';

//import images
import Left from "./images/left.png"
import LOGO from "./images/LogoWhite.png"
import User from "./images/user.png"
import Taxes from "./images/taxes.png"
import Fund from "./images/fund.png"
import Exemption from "./images/exemption.png"
import RightBlack from "./images/right-black.png"

// import libraries
import jwt from 'jwt-decode'

function App() {

  const windowSize = useRef(window.innerWidth);
  const location = useLocation()
  let navigate = useNavigate();

  async function logout() {
    localStorage.removeItem("jwt");
    setShouldUpdate(!shouldUpdate)
    setRole('')
    navigate('/login')
  }


  const [role, setRole] = useState('');
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [logedIn, setLogedIn] = useState(false)
  const [isActive, setActive] = useState(true);


  useEffect(() => {

    if (windowSize.current <= 425) {
      setActive(false);
    }

    let token = localStorage.getItem('jwt');
    if (token) {
      setLogedIn(true)
      let decodedToken = jwt(token);
      setRole(decodedToken.role)
    } else {
      setLogedIn(false)
    }

  }, [shouldUpdate]);


  return (

    <div className="wrapper">
      <div className='container'>

        {logedIn ?
          <div className='header' style={{ width: !isActive ? '0px' : '' }}>
            {/* <Logo style={{ width: '200px' }} /> */}
            <img style={{ width: '40px', margin: ' 0 auto', position: 'absolute', right: '10px', top: '10px' }} onClick={() => {
              setActive(!isActive)
            }} src={Left} />
            <img style={{ width: '200px', margin: ' 0 auto' }} src={LOGO} />
            <nav className='nav'>
              <ul className='headerLinks topHeaderLink'>

                {/* {role == 'admin' ? <p>Users</p>: ''} */}
                {role == 'admin' ?
                  <div>
                    <p>Users</p>
                    <li onClick={() => {
                      if (windowSize.current <= 425) { setActive(false) }
                    }} className={(location.pathname === '/') ? 'headerLinksActive' : ''} ><Link to="/"><img src={User} />Users</Link></li>
                  </div>
                  : ''
                }
                {/* {role == 'admin' ? <li className={location.pathname == '/uploadWithholdingTax' ? 'headerLinksActive' : ''} ><Link to="/uploadWithholdingTax">Upload Withholding Tax</Link></li> : ''} */}
                {role == 'admin' ?
                  <div>
                    <p>Workspaces</p>

                    {role == 'admin' ? <li onClick={() => {
                      if (windowSize.current <= 425) { setActive(false) }
                    }} className={location.pathname == '/workspace' ? 'headerLinksActive' : ''} ><Link to="/workspace"><img src={Fund} />Workspaces</Link></li> : ''}
                  </div>
                  : ''
                }




              </ul>
              <ul className='headerLinks headerLinksCentered'>
                {role == 'admin' ? <li onClick={() => {
                  if (windowSize.current <= 425) { setActive(false) }
                }} className="centered-text"><a style={{ color: '#fff' }} onClick={() => { logout() }}>Logout</a></li> : ''}
              </ul>
            </nav>
          </div>
          : ''
        }
        <div className='body'>
          {!isActive ? <img style={{ width: '40px', margin: ' 0 auto', position: 'absolute', left: '10px', top: '10px' }} onClick={() => {
            setActive(!isActive)
          }} src={RightBlack} /> : ''}


          <Routes>
            <Route path="/login" element={<Login shouldUpdate={shouldUpdate} setShouldUpdate={setShouldUpdate} />} />
            <Route path="/" element={<Home />} />
            <Route path="/workspace" element={<Workspace />} />
          </Routes>

        </div>
      </div>
    </div >



  );
}

export default App;
