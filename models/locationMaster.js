const mongoose = require('mongoose');
const LocationSchema = mongoose.Schema({

    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    country_id:{
        type: String,
        required: true
    },
    food_1:{
        type: Number
    },
    food_2:{
        type: Number
    },
    food_3:{
        type: Number
    },
    food_4:{
        type: Number
    },
    food_5:{
        type: Number
    },
    food_6:{
        type: Number
    },
    food_7:{
        type: Number
    },
    food_8:{
        type: Number
    },
    market_1:{
        type: Number
    },
    market_2:{
        type: Number
    },
    market_3:{
        type: Number
    },
    market_4:{
        type: Number
    },
    market_5:{
        type: Number
    },
    market_6:{
        type: Number
    },
    market_7:{
        type: Number
    },
    market_8:{
        type: Number
    },
    market_9:{
        type: Number
    },
    market_10:{
        type: Number
    },
    market_11:{
        type: Number
    },
    market_12:{
        type: Number
    },
    market_13:{
        type: Number
    },
    market_14:{
        type: Number
    },
    market_15:{
        type: Number
    },
    market_16:{
        type: Number
    },
    market_17:{
        type: Number
    },
    market_18:{
        type: Number
    },
    market_19:{
        type: Number
    },
    transport_1:{
        type:Number
    },
    transport_2:{
        type:Number
    },
    transport_3:{
        type:Number
    },
    transport_4:{
        type:Number
    },
    transport_5:{
        type:Number
    },
    transport_6:{
        type:Number
    },
    transport_7:{
        type:Number
    },
    transport_8:{
        type:Number
    },
    room_1:{
        type: Number
    },
    room_2:{
        type: Number
    },
    room_3:{
        type: Number
    },
    room_4:{
        type: Number
    },
    apartment_1:{
        type: Number
    },
    apartment_2:{
        type: Number
    },
    food_min:{
        type: Number
    },
    food_max:{
        type: Number
    },
    market_min:{
        type: Number
    },
    market_max:{
        type: Number
    },
    transportation_min:{
        type: Number
    },
    transportation_max:{
        type: Number
    },
    room_min:{
        type: Number
    },
    room_max:{
        type: Number
    },
    apartment_min:{
        type: Number
    },
    apartment_max:{
        type: Number
    }
});
const Location = module.exports = mongoose.model('Location', LocationSchema);