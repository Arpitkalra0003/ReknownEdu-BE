var mongoose = require('mongoose');

const ProfileSchema = mongoose.Schema({
    _id:{ type: String},
    path:  { type: String },
    caption: { type: String },
    educationinfo: [{
        universityname:
        {
            type: String,
        },
        degree:
        {
            type: String,
        },
        coursecompletionyear:
        {
            type: String,
        },
        collegename:
        {
            type: String,
        },
        specialization:
        {
            type: String,
        },
        marks:
        {
            type: String,
        },
        courselevel:
        {
            type: String,
        }
    }],
    workexp: [{
        companyname:
        {
            type: String,
        },
        designation:
        {
            type: String,
        },
        department:
        {
            type: String,
        },
        workexperience:
        {
            type: String,
        }
    }],
});

const Profile = module.exports = mongoose.model('Profile', ProfileSchema);