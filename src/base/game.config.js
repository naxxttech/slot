const crypto = require("crypto")
const { getGameById } = require('../db/models/GameSchema')

const { symbols, paylines, payTable } = require("./default.config")

class Game {

    constructor(gameId) {

        this.gameId = gameId
        this.matrix_table = null
        this.total_rows = 3
        this.total_cols = 5
        this.paylines = null
        this.multiplier = null
        this.volalitiy = null
        this.paylines = null
        this.requestedLines = null
        this.payTable = null
    }

    /**
         * game_get_config: databaseden ilgili oyunun datasını çeker
    * 
    */
    async start_game(requestedPaylines) {
        
        // bunlar veritabanından gelecek gameId ile config alınacak.
        console.log("REQUESTED GAME ID:", this.gameId)

        // dbden tüm parçaları, dataları çek.
        const game_source = await getGameById(this.gameId)

        // if resource is not found
        if (game_source.code === 404) {

            return game_source
        }

        console.log("game source:", game_source, "\nGame Reels:", game_source?.resource?.reels)

            // do game has their own paylines & symbols if yes use it, otherwise default configuration
            if (game_source.resource.paylines.length) {

                this.paylines = game_source.resource.paylines
            } else {

                this.paylines = paylines
            }

            if (game_source.resource.reels.length) {

                this.reels = game_source.resource.reels

            } else {

                this.reels = symbols
            }
      
            this.payTable = []
            this.volalitiy = game_source.resource.volalitiy

            // start game
            return this.generate_game_table(requestedPaylines)
    }


        /**
         * generate_game_table: oyunun matrix tablosunu ve linelerini belirler
         * @param {Number} totalLines - toplam kazanma çizgisi
        */
        async generate_game_table(totalLines) {
        
        this.requestedLines = totalLines

        // get assets
        // await this.game_get_config()

        this.paylines = this.paylines.slice(0, totalLines)

        const matrix_table = [];


        for (let col = 0; col < this.total_cols; col++) {

            let columnCards = new Set();

            for (let row = 0; row < this.total_rows; row++) {

                let card;

                // sütuna aynı kart geldiği sürece tekrar kart ata
                do {
                    card = await this.getRandomReel();

                } while (columnCards.has(card.reel));


                columnCards.add(card.reel);

                if (!matrix_table[row]) {
                    matrix_table[row] = [];
                }

                matrix_table[row][col] = {

                    cordinate: { y: row, x: col },
                    cardId: card.id,
                    cardName: card.reel
                };
            }
        }    
        
        this.matrix_table = matrix_table
        
        return this.calculate_results()
        
    }


     /**
         * getRandomReel: oyunun matrix tablosuna RNG ile atanacak parçaları belirler
    */
    async getRandomReel() { 

        const totalProbability = this.reels.reduce((sum, reel) => sum + reel.probability, 0);

        switch (this.volalitiy) {
            case 'low':
                this.reels = this.reels.map(reel => ({
                    ...reel,
                    probability: (reel.probability / totalProbability) * 0.5
                }));
                
                this.payout = 1
                break;

            case 'medium':
                this.reels = this.reels.map(reel => ({
                    ...reel,
                    probability: reel.probability / totalProbability
                }));
                
                this.payout = 2
                break;

            case 'high':
                this.reels = this.reels.map(reel => ({
                    ...reel,
                    probability: (reel.probability / totalProbability) * 0.1
                }));
    
                this.payout = 3
                break;

            default:
                throw new Error('Unknown volatility level');
        }

        const RNG = crypto.randomInt(100000) / 100000;

        let chance = 0;

        // parça döndürmeye başla
        for (const reel of this.reels) {
            chance += reel.probability;
            console.log("chance:", chance, "random number:", RNG)

            if (RNG < chance) {
                console.log("Şans oranı tuttu düşen parça:", reel)
                return reel;
            }
    
            // tutmazsa rastgele döndür
            const randomReel = this.reels[Math.floor(Math.random() * this.reels.length)]
            console.log("Şans oranı tutmadı başka bir parça atılıyor", randomReel.reel)

            return randomReel
        }

    }



    calculate_payouts(symbolDropCount, paytable) {

        const { payouts } = paytable

        let prize = 0;

        switch(symbolDropCount) {

                    case 2:
                        prize += payouts?.x2 || 0
                        break;

                    case 3:
                        prize += payouts.x3
                        break;

                    case 4: 
                        prize += payouts.x4
                        break;

                    case 5: 
                        prize += payouts.x5
                        break;
                }

            
        

        return prize
    }

     /**
         * calculate_results: oyunun kazanma durumunu belirler
    */
    calculate_results() {

        let data = { 
        
            win: false,
            winningPaylines: [],
            cells: [],
            totalPayout: 0
          
        }

        for (const payline of this.paylines) {

            let symbols = payline.map(([col, row]) => this.matrix_table[col][row]);
            if (symbols.includes(undefined)) continue;
          

            for (let symbol of symbols) {

                const currentLine = paylines.findIndex(lines => lines === payline) + 1

                symbol.line = currentLine
                
                // check paytable and minimum card drop requiriment
                const { cardId } = symbol
                // console.log("card cordinates:", cordinate, "card name:", cardName)

                const droppedCardsInLine = symbols.filter(card => card.line === currentLine)
                const dropCountForCard = droppedCardsInLine.filter(card => card.cardId === cardId).length
                const payRulesForCard = payTable.find(entry => entry.id === cardId);

                if (dropCountForCard >= payRulesForCard.minSymbols) {

                    console.log("name:", symbol.cardName, "dropped", dropCountForCard, "times in line:", currentLine)
                    // calculate payouts
                    const linePayout = this.calculate_payouts(dropCountForCard, payRulesForCard)

                    // is there any entry for this card? 
                    let lineInfo = data.winningPaylines.find(entry => entry.line === currentLine);
                    
                    if (!lineInfo) {

                        lineInfo = {
                            line: currentLine,
                            cards: [],
                            multiplier: 1,
                            payout: linePayout
                        };

                        data.winningPaylines.push(lineInfo);
                    }
                
                    // add winning cards to the lineInfo
                    droppedCardsInLine.filter(card => card.cardId === cardId).forEach(cardEntry => {

                        // if there is no info for our dropped cards then create info object
                        if (!lineInfo.cards.some(card => card.cardId === cardEntry.cardId && card.x === cardEntry.cordinate.x && card.y === cardEntry.cordinate.y)) {
                            
                            lineInfo.cards.push({
                                cardId: cardEntry.cardId,
                                cardName: cardEntry.cardName,
                                y: cardEntry.cordinate.y,
                                x: cardEntry.cordinate.x
                            });
                        }
                    });

                    // mark as win
                    data.win = true
                    data.totalPayout += linePayout
                }
             
        
            }
        }

    
        for (const rows of this.matrix_table) {

            data.cells.push(rows.map(object => object.cardId))            
    
        }

        return data
    }

}










module.exports = Game