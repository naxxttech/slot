const express = require("express")
const router = express.Router()

const { getRandomReel, reels, payTable } = require("../helpers/reels")

const generate_game_table = require('../helpers/setup')
const calculate_results = require('../helpers/calculate')
const drawDiagram = require('../helpers/diagram')
const RTP = require('../helpers/rtp')


const test_user = {

    name: "admin",
    bucket: 150,
}

router.get("/spin", async (request, response) => { 
    // payout
    let multiplier = null
    // volalitiy
    const requested_volatility = request.query.volatility || 'medium';

    switch(requested_volatility) {

        case "low":
            multiplier = 1
            break

        case "medium":
            multiplier = 2

        case "high":
            multiplier = 3
    }
    // bet
    const bet = request.query.bet || test_user?.bet

    if (test_user.bucket <= 0) {

        return response.status(403).json({ message: "Oynamak için yeterli bakiyeniz yok"})
    }

    // bet mantığı ve validasyonlar buraya.

    // her bir makara için parça üretmeye başla
    const total_rows = 5
    const total_cols = 5
    const matrix_table = generate_game_table(total_rows, total_cols, requested_volatility)

    // kazanma / kayıp etme durumunu kontrol et
    const round_status = calculate_results(matrix_table, multiplier)

    console.log("Diagram:\n" + drawDiagram(matrix_table, round_status.winningCards));
    console.log("RTP:", RTP(reels, payTable))

    // ödeme / geri ödeme
    if (round_status.win) {

        test_user.bucket += round_status.payout
        console.log("Kazanç:", test_user.bucket)

    } else {

        test_user.bucket -= bet
        console.log("Kayıp:", test_user.bucket)
    }

  

    return response.status(200).json(round_status)

})



module.exports = router