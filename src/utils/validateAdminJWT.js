import jwt from 'jwt-decode'

function ValidateAdminJWT() {
    let token = localStorage.getItem('jwt');
    let decodedToken = ''
    if (token) {
        console.log("here")
        decodedToken = jwt(token);
    }

    console.log("Decoded Token", decodedToken);
    if (decodedToken && decodedToken.role === 'admin') {
        return true
    } else {
        return false
    }
}

export default ValidateAdminJWT
