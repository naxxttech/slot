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

                    cordinate: { x: row, y: col },
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



    calculate_payouts(symbolName, symbolDropObject) {

        const { cardId, dropCount } = symbolDropObject[symbolName]

        let prize = 0;

        for (const symbol of payTable) {
            
            if (symbol.id === cardId) {

                switch(dropCount) {

                    case 2:
                        prize += symbol.payouts?.x2 || 0
                        break;

                    case 3:
                        prize += symbol.payouts.x3
                        break;

                    case 4: 
                        prize += symbol.payouts.x4
                        break;

                    case 5: 
                        prize += symbol.payouts.x5
                        break;
                }

            }
        }

        return prize
    }

     /**
         * calculate_results: oyunun kazanma durumunu belirler
    */
    calculate_results() {

        // initials

        let data = { 
        
            win: false,
            winningPaylines: [],
            cells: [],
            totalPayout: 0
          
        }

        // restrucute object

        for (const payline of this.paylines) {

            let symbols = payline.map(([row, col]) => this.matrix_table[row][col]);
            console.log("len sym:", symbols.length)
            if (symbols.includes(undefined)) continue;
    

            const droppedSymbols = {}
            
            // düşen parçanın düşme sayısını al
            for (let symbol of symbols) {

                if (!droppedSymbols[symbol.cardName]) {
                    
                    const entry = droppedSymbols[symbol.cardName] = {...symbol, dropCount: 0 }
                    // remove unwanted keys
                    delete entry.cardName
                }

                droppedSymbols[symbol.cardName].dropCount += 1;
            }

            // game rules starts here
            for (let cardName in droppedSymbols) {

                const { cardId, x, y, dropCount } = droppedSymbols[cardName]
                // if payline contains same card three times then we count as win
                if (dropCount >= 3) {
                    
                    data.win = true
                    const winLine = paylines.findIndex(lines => lines === payline) + 1
                    const cardsInWinLine = payline.filter(([row, col]) => this.matrix_table[row][col].cardName === cardName);

                    // arrange winning cards with their cordinates for frontend
                    const winEntry = {

                        line: winLine,
                        cards: cardsInWinLine.map(([row, col]) => ({

                            cardId: cardId,
                            cardName: cardName,
                            x: col,
                            y: row,
               
                        } )),

                        // static value for now
                        multiplier: 1,
                        // line prize
                        payout: this.calculate_payouts(cardName, droppedSymbols)
                    };
            
                    data.winningPaylines.push(winEntry)
                }

            }
        
        }

    
        for (const rows of this.matrix_table) {

            data.cells.push(rows.map(object => object.cardId))            
    
        }

        // get total prize
        data.totalPayout = data.winningPaylines.reduce((total, object) => {
            return total + (object.payout || 0);

        }, 0);

        return data
    }

}










module.exports = Game