const { getRandomReel } = require('../helpers/reels')

function generate_game(total_rows, total_cols, requested_volatility) {
    // total_rows = makara
    // total_cols = sütun

    const matrix_table = [];

    for (let row = 0; row < total_rows; row++) {
        matrix_table[row] = [];

        for (let col = 0; col < total_cols; col++) {
            // Generate a random index within the range of reels length
            const card = getRandomReel(requested_volatility)
            // probability'i çıkart
            // delete card.probability
            matrix_table[row][col] = { ...card, position: { x: row, y: col } }; // kartın matrix deki pozisyonu
        }
    }


    return matrix_table

}



module.exports = generate_game