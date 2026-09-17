const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status:{
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    }
});
module.exports = mongoose.model('Task', taskSchema);