const mongoose = require ('mongoose');

const UniversitySchema = mongoose.Schema({
    id:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    link:{
        type: String,
        required: true
    },
    world_rank:{
        type: String
    },
    country_rank:{
        type: String
    },
    logo:{
        type: String
    },
    overview:{
        type: String
    },
    alumni:{
        type: String
    },
    professor_faculty:{
        type: String
    },
    year_of_published:{
        type:Number
    },
    ug_howtoapply:{
        type: String,
    },
    pg_howtoapply:{
        type: String,
    },
    tutionfees_link:{
        type: String,
    },
    ug_program_link:{
        type: String,
    },
    pg_program_link:{
        type: String,
    },
    phd_program_link:{
        type: String,
    },
    acceptance_ratio:{
        type: Number
    },
    student_faculty_ratio:{
        type: Number
    },
    ug_fees_min:{
        type: Number
    },
    ug_fees_max:{
        type: Number
    },
    pg_fees_min:{
        type: Number
    },
    pg_fees_max:{
        type: Number
    },
    phd_fees_min:{
        type: Number
    },
    phd_fees_max:{
        type: Number
    },

});


//exports this schema
const University = module.exports = mongoose.model('University',UniversitySchema);