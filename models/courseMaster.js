const mongoose = require('mongoose');
const CourseSchema = mongoose.Schema({

    id: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    level: {
        type: String
    }
});
CourseSchema.index({ name: 'text' });

const Course = module.exports = mongoose.model('Course', CourseSchema);
