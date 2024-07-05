const mongoose = require("mongoose")
const { Schema } = mongoose;

const GameSchema = new Schema({
  
    gameId: { type: String, required: true }, // Game ID or reference
    gameName: { type: String, required: true }, 
    lines: { type: [[Number]], required: true },  // Array of arrays representing paylines
    rows: { type: Number, default: 5},
    cols: { type: Number, default: 3}
    
}, {

    timestamps: true
});



const model = mongoose.model('Game', GameSchema);




module.exports = model