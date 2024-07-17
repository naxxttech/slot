const crypto = require("crypto")
const { getGameById } = require('../db/models/GameSchema')

const { symbols, paylines } = require("./default.config")

class Game {

    constructor(gameId) {

        this.gameId = gameId
        this.matrix_table = null
        this.total_rows = 3
        this.total_cols = 5
        this.paylines = null
        this.payout = null
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

        for (let row = 0; row < this.total_rows; row++) {
            matrix_table[row] = [];
    
            for (let col = 0; col < this.total_cols; col++) {
                // Generate a random index within the range of reels length
                const card = await this.getRandomReel()
                // probability'i çıkart
                // delete card.probability
                // matrix_table[row][col] = {...card, position: { line: row, x: row + 1, y: col + 1 } }; 
                matrix_table[row][col] = { line: row, cordinate: { x: row, y: col}, cardId: card.id}
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



     /**
         * calculate_results: oyunun kazanma durumunu belirler
    */
    calculate_results() {

        // initials

        let data = { 
        
            win: false,
            payout: this.payout, 
            winningPaylines: [],
            cells: [],
          
        }

        // restrucute object

        for (const payline of this.paylines) {

            let symbols = payline.map(([row, col]) => this.matrix_table[row][col]);

            if (symbols.includes(undefined)) continue;
        

            let droppedSymbols = {}
        

            
            for (let symbol of symbols) {

                if (!droppedSymbols[symbol.cardId]) {
                    droppedSymbols[symbol.cardId] = 0;
                }

                droppedSymbols[symbol.cardId]++;
            }
            

            // will refactor this code later
            for (let cardId in droppedSymbols) {


                if (droppedSymbols[cardId] >= 3) {

            
                    const winLine = paylines.findIndex(lines => lines === payline) + 1
                    console.log("kazanan payline:", winLine)
                    data.win = true;

                    const table = []


                            
                            symbols.forEach(symbol => {
                                const cardId = symbol.cardId;
                                const x = symbol.cordinate.x;
                                const y = symbol.cordinate.y;
                                
                                const row = table.find(data => data.line === winLine)

                                if (row) {

                                    row.cards.push({ cardId, x, y})
                                
                                } else {

                                    table.push({ line: winLine, cards: [{ cardId, x, y }]})
                                }
                                
                            })


                     data.winningPaylines = table
                }
            }
        }

        // restructure response data for cells key
        for (const rows of this.matrix_table) {

            data.cells.push(rows.map(object => object.cardId))            
        }


        return data
    }

}










module.exports = Game