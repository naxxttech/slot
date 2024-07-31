const RNG = require("../../base/symbol.picker")
const { gamble_symbols } = require("../../base/default.config")

const { update_game_history, get_game_history } = require("../../db/models/GameHistory")

module.exports = {

    name: "playGamble",
    exe: async (socket, data, cb) => {

        const { gameid } = socket.request.session
        const { entryId, pickedCard } = data

        // will change later. histories can be found according entry ids.
        const game_history = await get_game_history(gameid)

        const cardTypes = ["red", "black"]
        const gambleCards = new RNG(gamble_symbols, cardTypes)
        const card = gambleCards.getRandomSymbol()

        console.log("picked:", pickedCard, "card:", card)
        // pickedCard number, card ile aynı ise 
        if (pickedCard == card.color) {

           // db kontrollerini yap.
           game_history.gamble = { guess: cardTypes[pickedCard], result: cardTypes[card.color]}

        } else {

           game_history.status = 0
        }


        await game_history.save()

        return { status: game_history.status, gamble: game_history.gamble }
    }
}