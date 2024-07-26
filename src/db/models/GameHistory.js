const mongoose = require("mongoose");

const GameHistorySchema = new mongoose.Schema({

    win: { type: Boolean, required: true },
    user_id: { type: String, required: true },
    user_name: { type: String},
    cells: { type: [Number], required: true },
    winningPaylines: { type: [], required: true},
    totalPayout: { type: Number, required: true}


})



const model = mongoose.model('Game History', GameHistorySchema);