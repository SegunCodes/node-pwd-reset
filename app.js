const express = require("express")
const jwt = require('jsonwebtoken')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false}))
app.set('view engine', 'ejs')

let user = {
    id: "15gfwhfwh12",
    email: "segun@codes.com",
    password: "qggahjaj@gafhs7sshyys678s7sh7i"
}

const JWT_SECRET = 'AHJAH5257AJAJ%FGHSG123'

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/forgot-password', (req, res, next) => {
    res.render('forgot-password') 
});
app.post('/forgot-password', (req, res, next) => {
    const {email} = req.body;

    //check if user exist
    if (email !== user.email) {
        res.send('User not found');
        return;
    }
    const secret = JWT_SECRET + user.password
    const payload = {
        email: user.email,
        id: user.id
    }
    const token = jwt.sign(payload, secret, {expiresIn: '10s'})
    const link = `http://localhost:3000/reset-password/${user.id}/${token}`
    console.log(link)
    res.send('Reset password link has been sent to your email');
});
app.get('/reset-password/:id/:token', (req, res, next) => {
    const {id, token} = req.params;
    if (id !== user.id) {
        res.send('Invalid id')
        return
    } 
    const secret = JWT_SECRET + user.password
    try {
        const payload = jwt.verify(token, secret)
        res.render('reset-password', {email: user.email})
    } catch (error) {
        console.log(error.message);
        res.send(error.message)
    }
});
app.post('/reset-password/:id/:token', (req,res, next) => {
    const {id, token} = req.params;
    const {password, password2} = req.body;
    if (id !== user.id) {
        res.send('Invalid id')
        return
    }
    const secret = JWT_SECRET + user.password
    try {
        const payload = jwt.verify(token, secret)
        user.password = password
        res.send(user);
    } catch (error) {
        console.log(error.message);
        res.send(error.message)
    }
});


app.listen(3000, ()=> console.log("App open on port 3000"))