const { payTable } = require('../helpers/reels')

/**
 * calculatePayout: oyuncunun kazandığı / kayıp ettiği para miktarını belirler
 * @param {Array} winningSymbols 
 * 
*/
function calculatePayout(winningSymbols, multiplier) {
    let totalPayout = 0;

    for (const data of payTable) {
        const { reel, payouts } = data;

        // düşen parça sayısına göre ödeme yap
        for (const amount in payouts) {
            if (winningSymbols.filter(symbol => symbol.reel === reel).length === parseInt(amount)) {

                // multiplier oranına göre ödemeyi ayarla
                payouts[amount] *= multiplier
                console.log("Ödeme:", payouts[amount])

                totalPayout += payouts[amount];
            }
        }
    }

    return totalPayout;
}



/**
 * matrix_table: oyunun tablosu. hücreler, parça pozisyonlarının barındığı kısım
 * bu helper oyun sonucu belirler user kazanmışsa bakiyesine para eklenir aksi halde çıkarılır
 * @param {Array} matrix_table 
 * 
*/

function calculate_results(matrix_table, multiplier) {

    
    const paylines = [
        // Horizontal paylines (Yatay)
        // 1. satır (olasılıklar)
        [[0, 0], [0, 1], [0, 2]],
        [[0, 1], [0, 2], [0, 3]],
        [[0, 2], [0, 3], [0, 4]],
        // // // 2. yatay satır olasılıklar
        [[1, 0], [1, 1], [1, 2]],
        [[1, 1], [1, 2], [1, 3]],
        [[1, 2], [1, 3], [1, 4]],
        // // // 3. yatay satır olasılıklar
        [[2, 0], [2, 1], [2, 2]],
        [[2, 1], [2, 2], [2, 3]],
        [[2, 2], [2, 3], [2, 4]],
        // Vertical paylines (Dikey)
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 3], [1, 3], [2, 3]],
        [[0, 4], [1, 4], [2, 4]],
        // çapraz
        [[0, 0], [1, 1], [2, 2]], 
        [[0, 2], [1, 1], [2, 0]], 
        [[0, 2], [1, 3], [2, 4]], 
        [[0, 4], [1, 3], [2, 2]],
        //  zigzag
        [[0, 0], [1, 1], [0, 2]], 
        [[0, 1], [1, 2], [0, 3]], 
        [[0, 2], [1, 3], [0, 4]],
        [[1, 0], [0, 1], [1, 2]], 
        [[1, 1], [0, 2], [1, 3]], 
        [[1, 2], [0, 3], [1, 4]],
        [[2, 0], [1, 1], [2, 2]], 
        [[2, 1], [1, 2], [2, 3]], 
        [[2, 2], [1, 3], [2, 4]],
        [[0, 2], [1, 1], [2, 0]], 
        [[0, 3], [1, 2], [2, 1]], 
        [[0, 4], [1, 3], [2, 2]]
        
        ];

        let data = { 
            win: false,
            payout: 0, 
            winningCards: [],
            cells: matrix_table,
          
        }

        for (const line of paylines) {


            // payline kombinasyonunu tablodaki matrix de kontrol et
            const symbols = line.map(([row, col]) => matrix_table[row][col]);

            // Kazanma durumunu kontrol etmeden önce tüm sembollerin gelmesini bekle
            if (symbols.includes(undefined)) continue;

            // console.log("sembol:", symbols)

            // eğer 3 kartta eşleşirse user kazanır
            if (symbols.every((symbol) => symbol.reel === symbols[0].reel)) {

                data.win = true
                // data.payline = line
                data.winningCards = symbols
                data.payout = calculatePayout(symbols, multiplier)

                break
            }

        }

        // oyun sonucu
        return data

}



module.exports = calculate_results