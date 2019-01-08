const mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

const EventSchema = new mongoose.Schema({
    code: String,
    bride: String,
    groom: String,
    date: String,
    foodOptions: [String],
    location: String,
    announcements: [String],
    pendingGuests: [ObjectId],
    confirmedGuests: [ObjectId],
    declinedGuests: [ObjectId]
});

const Event = mongoose.model('Event', EventSchema);

module.exports = { Event };