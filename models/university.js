const mongoose = require('mongoose');

const UniversitySchema = mongoose.Schema({

    id: {
        type: String
    },
    countryname: {
        type: String
    },
    locationname: {
        type: String
    },
    universityname: {
        type: String
    }
    
});

const University = module.exports = mongoose.model('University', UniversitySchema);