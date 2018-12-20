const mongoose = require('mongoose');

const CountrySchema = mongoose.Schema({

    id: {
        type: String,
        required: true
    },
    continentname:{
        type: String
    },
    name: {
        type: String,
        required: true
    },
    visaDescription: {
        type: String
    },
    scholershipLink: {
        type: String
    },
    currency: {
        type: String
    },
    visaLink: {
        type: String
    },
    ugmin_salary: {
        type: Number
    },
    ugmax_salary: {
        type: Number
    },
    pgmin_salary: {
        type: Number
    },
    pgmax_salary: {
        type: Number
    },
    phdmin_salary: {
        type: Number
    },
    phdmax_salary: {
        type: Number
    },
    scholardetails:[{
        country_id:{type: Number,
        required: true},
        scholarshipname:String,
        scholarshiplink:String
    }]
},{collection:'countryMaster'});

const Country = module.exports = mongoose.model('Country', CountrySchema);