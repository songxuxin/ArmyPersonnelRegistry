const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userController = require('./controllers/user');

const router = express.Router();

app = express();
app.use(bodyParser.json());
app.use(cors());

const url = 'mongodb+srv://xuxin:song@cluster0-ubqtw.azure.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(url, {useNewUrlParser: true}).then(() => {
    console.log('connected!!');
}).catch(err => {
    console.log(err);
})
mongoose.set('useFindAndModify', false);

app.use('/api', router);
router.get('/users', userController.getUsers);
router.get('/superiors', userController.getAllSuperior);
router.post('/user', userController.createUser);

router.get('/user/:userId', userController.getUser);

router.post('/user/:userId', userController.updateUser);
router.delete('/user/:userId', userController.deleteUser);


module.exports = app;