const mongoose = require('mongoose');
const LinkSchema = mongoose.Schema({
    
    country_id:{
        type: String,
        required: true
    },
    location_id:{
        type: String,
        required: true
    },
    university_id:{
        type: String,
        required: true
    },
    course_id:{
        type: String,
        required: true
    },
    course_link:{
        type: String
    },
    tutionfees_link:{
        type: String
    },
    howtoapply_link:{
        type: String
    },
    fees_min:{
        type: String
    },
    fees_max:{
        type: String
    },
   
    toefl:{
        type: Number
    },
    toefl_max:{
        type: Number
    },
    ielts:{
        type: Number
    },
    ielts_max:{
        type: Number
    },
    pte:{
        type: Number
    },
    pte_max:{
        type: Number
    },
    cae:{
        type: Number
    },
    cae_max:{
        type: Number
    },
    cael:{
        type: Number
    },
    cael_max:{
        type: Number
    },
    sat:{
        type: Number
    },
    sat_max:{
        type: Number
    },
    gre:{
        type: Number
    },
    gre_max:{
        type: Number
    },
    gmat:{
        type: Number
    },
    gmat_max:{
        type: Number
    },
    melab:{
        type: Number
    },
    melab_max:{
        type: Number
    },
    gpa:{
        type: Number
    },
    gpa_max:{
        type: Number
    }
});

const Link = module.exports = mongoose.model('Link',LinkSchema);