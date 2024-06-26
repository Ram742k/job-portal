const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: String,
    location: String,
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;