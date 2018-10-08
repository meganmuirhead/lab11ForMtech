const mongoose = require('mongoose');
//usermanagement is the db name
mongoose.connect('mongodb://localhost/userManagement', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('db connected')
});
const userSchema = new mongoose.Schema({
    name: String,
    role: String,
    email: String,
    gender: String,
    age: {type: Number, min: 1, max: 120 },
    createdDate: {type: Date, default: Date.now}
});
const path = require('path');
const user = mongoose.model('userCollection', userSchema);
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'pug');




//GET Requests
app.get('/', (req, res) => {
    user.find({}, (err, docs) => {
        if (err) console.log(err);
        // res.render('userListingView', {users: docs});
        res.render('userTable', {users: docs});

    });
});


app.get('/add', (req, res) => { // Renders the new client form
    res.render('add');
});

// test post request
//test this with `curl --data "name=Peter&role=Student" http://localhost:8080/newUser`
// app.get('/newUser', (req, res) => {
//     res.render('add');
// })

// Create -- new doc
app.post('/add', (req, res) => {
    // console.log(`POST /newUser: $(JSON.stringify(req.body)}`);
    //crud man
    //create user
    const newUser = new user();
    newUser.name = req.body.name;
    newUser.role = req.body.role;
    newUser.email = req.body.email;
    newUser.gender = req.body.gender;
    newUser.age = req.body.age;

    newUser.save((err, data) => {
        if (err) {
            return console.error(err);
        }
        // console.log(`new user save: ${data}`);
        // res.send(`done ${data}`);
        res.redirect('/')
    });
});
//READ
// test with `curl http://localhost:8080/user/Peter`
app.get('/updateUser/:clientId', (req, res) => {

    const clientId = req.params.clientId;
    user.findOne({_id:clientId}, (err, data) => {
        if (err) console.log(err);
        res.render('edit', {user:data});
    // })
    });
});

app.post('/updateUser/:clientId', (req, res) => {
    let clientId = req.params.clientId;
    let body = req.body;
    let updatedUserInfo = {
        name: body.name,
        role: body.role,
        email: body.email,
        gender: body.gender,
        age: body.age
    };
    user.findOneAndUpdate({_id:clientId}, updatedUserInfo, {new: true}, (err, data) => {
        if (err) console.log(err);
        res.redirect('/');
    })
});
//Update --find one and then update the document
//test with `curl --data "name=Jack&role=TA" http://localhost:8080/updateUserRole`
// app.get('/updateUser/:clientId', (req, res) => {
//     // console.log(`POST /updateUserRole: ${JSON.stringify(req.body)}`);
//     // let matchedName = req.body.name;
//     // let newRole = req.body.role;
//     const clientId = req.params.clientId;
//     const body = req.body;
//     const userAfterEdit = {
//         name: body.name,
//         role: body.role,
//         email: body.email,
//         gender: body.gender,
//         age: body.age
//     }
//     //after new return the updated version instead of the pre updated document
//     user.findOneAndUpdate( {_id: clientId}, userAfterEdit, {new: true}, (err, data) => {
//         if (err) return console.log(`Opps! ${err}`);
//         console.log(`data -- ${data.role}`);
//         let returnMsg = `user name: ${matchedName} New role : ${data.role}`;
//         console.log(returnMsg);
//         // res.send(returnMsg);
//         res.redirect('/');
//     });
//     // res.redirect('userListingView')
//
// });//delete
//test with `curl --data "name=Jack&role=TA" http://localhost:8080/removeUser`
app.get('/removeUser/:clientId', (req, res) => {
    const clientId = req.params.clientId;
    // console.log(`POST /removeUser: ${JSON.stringify(req.body)}`);
    // let matchedName = req.body.name;
    user.findOneAndDelete( {'_id':clientId}, (err, data) => {
        if (err) return console.log(`Oops! ${err}`);
        // console.log(`data -- ${data.role}`);
        // let returnMsg = `user name : ${matchedName} removed data: ${data}`;
        // console.log(returnMsg);
        // res.send(returnMsg);
        res.redirect('/');
    });
});

app.post('/searchUser', (req, res) => {
    const body = req.body;
    // console.log(body);
    user.find({ $text:{$searchUsers: body.search} }, (err, data) => {
        if (err) return console.log(`Oops! ${err}`);

        res.render('searchUser', {users: data});
    });
});

app.get('/sortingAtoZ', (req, res) => {
    user.find({}).sort({name: 1}).exec((err, data) => { // ascending
        if (err) return console.log(`Oops! ${err}`);
        // res.send(data);
        res.render('userTable', {users:data});
    });
});

app.get('/sortingZtoA', (req, res) => { // sort test
    user.find({}).sort({name: -1}).exec((err, data) => { // descending
        if (err) return console.log(`Oops! ${err}`);
        // res.send(data);
        res.render('userTable', {users: data});
    });
});
app.listen(port, err => {
    if (err) console.log(err);
    console.log(`App Server listening on port: ${port}`)
})