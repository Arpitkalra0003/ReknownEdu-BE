const mongoose = require('mongoose');
const CompanySchema = mongoose.Schema({

    id: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    sector: {
        type: String
    },
    country:{
        type: String
    },
    location:{
        type: String
    },
    address:{
        type: String
    },
    comp_link:{
        type: String
    },
    phone_number:{
        type: String
    }
});


const Company = module.exports = mongoose.model('Company', CompanySchema);
