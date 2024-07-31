const RNG = require("../../base/symbol.picker")
const { gamble_symbols } = require("../../base/default.config")

const { update_game_history, get_game_history, types } = require("../../db/models/GameHistory")
const PaymentProcessor = require("../../base/payment.config")



/*
    dünden kalan session devam ediyor
    aynı session ile diger sayfaya girilebiliyor
*/ 

module.exports = {

    name: "playGamble",
    exe: async (socket, data, cb) => {

        const { gameid, user_id } = socket.request.session
        const { entryId, pickedCard } = data

        // will change later. histories can be found according entry ids.
        const game_history = await get_game_history(entryId)

        // can this user play gamble?
        // testing for now
        if (game_history.gamble.length >= 5) {

            throw new Error(`User can't play gamble because play limit exceeded`)
        }

        let userBalance

        if (game_history.status === types.GAMBLE || game_history.status === types.WIN) {

                const cardTypes = ["red", "black"]
                const gambleCards = new RNG(gamble_symbols, cardTypes)
                const card = gambleCards.getRandomSymbol()

                console.log("picked:", pickedCard, "card:", card)
                
                // if user win
                if (pickedCard == card.color) {
                
                const currentDate = new Date().toISOString();

                const new_entry = { 
                    guess: cardTypes[pickedCard], 
                    result: cardTypes[card.color],
                    cardId: cardTypes[card.color].id,
                    playedAt: currentDate
                };

                game_history.gamble.push(new_entry)
                game_history.markModified("gamble")
          
                const payment = new PaymentProcessor()
                userBalance = await payment.pay(user_id, 150)

                } else {

                    game_history.status = types.LOSE
                }

       
                await game_history.save()
 
                return { 
                    status: game_history.status, 
                    gamble: { played: game_history.gamble.length, history: game_history.gamble.at(-1)}, 
                    balance: userBalance }

        } else {

            throw new Error(`User can't play gamble their status is: ${game_history.status}`)
        }

 
          

    }
}