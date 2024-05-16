const mongoose = require('mongoose');

// Define the booking schema
const bookingSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    checkInDate: {
        type:String,
        required: true
    },
    checkOutDate: {
        type:String,
        required: true
    },
    accommodationType: {
        type: String,
        required: false
    },
    numberOfRooms: {
        type: Number,
        required: true
    },
    roomType: {
        type: String,
        required: true
    },
    additionalRequests: {
        type: String
    }
});

// Create the Booking model
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
