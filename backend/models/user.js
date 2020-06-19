const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    img: String,
    name: String,
    rank: String,
    sex: String,
    startDate: String,
    phone: Number,
    email: String,
    superior: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    subordinate: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})


module.exports = mongoose.model('User', userSchema);