const crypto = require("crypto")
const { getGameById } = require('../db/models/GameSchema')

class Game {

    constructor(gameId) {

        this.gameId = gameId
        this.matrix_table = null
        this.total_rows = 0
        this.total_cols = 0
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
    async game_get_config() {
        
        // bunlar veritabanından gelecek gameId ile config alınacak.
        console.log("REQUESTED GAME ID:", this.gameId)

        // dbden tüm parçaları, dataları çek.
        const game_source = await getGameById(this.gameId)
        console.log("game source:", game_source, "\nGame Reels:", game_source.resource.reels)

        const reels  = [
            { id: 0, reel: "ACE", probability: 0.2 }, 
            { id: 1, reel: "ANCHOR", probability: 0.2 }, 
            { id: 2, reel: 'FISH', probability: 0.1 }, 
            { id: 3, reel: 'HORSE', probability: 0.1 }, 
            { id: 4, reel: 'JACK', probability: 0.1 }, 
            { id: 5, reel: 'KING', probability: 0.04}, 
            { id: 6, reel: "NINE", probability: 0.03 }, 
            { id: 7, reel: "QUEEN", probability: 0.01 }, 
            { id: 8, reel: "SCATTER", probability: 0.01 },
            { id: 9, reel: "SHELL", probability: 0.01 },
            { id: 10, reel: "STAR", probability: 0.01 },
            { id: 11, reel: "TEN", probability: 0.01 },
            { id: 12, reel: "WILD", probability: 0.01 }
        ];

        // ödeme tablosu
        const payTable = [
            
            { reel:'Orc', payouts: { 3: 10, 2: 5 } },
            { reel:'Skull', payouts: { 3: 15, 2: 12 } },
            { reel:'Knight', payouts: { 3: 25, 2: 20 } },
            { reel:'Archer', payouts: { 3: 27, 2: 21 } },
            { reel:'Horse Knight', payouts: { 3: 30, 2: 26 } },
            { reel:'Elite Wild', payouts: { 3: 35 } },
            { reel:'King', payouts: { 3: 60, 2: 50 } },
            { reel:'Queen', payouts: { 3: 50, 2: 45 } },
        ];


        // oyunun valalotiysi
        const volalitiy = "low"
        /*
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
            
            ]

            */
            const paylines = [

               // 1
               [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
        
               [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]],

               [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]],

               [[0, 0], [1, 1], [2, 3], [1, 3], [0, 4]],
       
               [[0, 2], [1, 1], [1, 3], [2, 0], [2, 4]],

               [[0, 0], [0, 1], [1, 2], [0, 3], [0, 4]],

               [[1, 2], [2, 0], [2, 1], [2, 3], [2, 4]],
  
               [[1, 0], [0, 1], [0, 2], [0, 3], [1, 4]],

               [[1, 0], [2, 1], [2, 2], [2, 3], [1, 4]],
               // 10
               [[1, 0], [1, 1], [0, 2], [1, 3], [1, 4]],

               [[1, 0], [1, 1], [2, 2], [1, 3], [1, 4]],

               [[0, 0], [0, 1], [1, 2], [2, 3], [2, 4]],

               [[2, 0], [2, 1], [1, 3], [0, 3], [0, 4]],

               [[0, 1], [1, 0], [1, 2], [2, 3], [1, 4]],
               // 15
               [[1, 0], [2, 1], [1, 2], [0, 3], [1, 4]],
               
               [[0, 0], [1, 1], [1, 2], [1, 3], [2, 4]],

               [[2, 0], [1, 1], [1, 2], [1, 3], [0, 4]],

               [[1, 0], [0, 1], [0, 2], [1, 3], [2, 4]],

               [[1, 0], [2, 1], [2, 2], [1, 3], [0, 4]],
               // 20
               [[0, 0], [2, 1], [0, 3], [2, 3], [0, 4]],

               [[2, 0], [0, 1], [2, 2], [0, 3], [2, 4]],

               [[0, 0], [0, 1], [1, 2], [2, 3], [1, 4]],

               [[2, 0], [2, 1], [1, 2], [0, 3], [1, 4]],

               [[1, 0], [1, 1], [0, 2], [1, 3], [2, 4]],
               // 25
               [[1, 0], [1, 1], [2, 2], [1, 3], [0, 4]],

            ]
            // paylinesi dışarı çıkart
            this.paylines = paylines
            this.reels = reels
            this.payTable = payTable
            this.volalitiy = volalitiy
    }


        /**
         * generate_game_table: oyunun matrix tablosunu ve linelerini belirler
         * @param {Number} total_rows - toplam tablo satır
         * @param {Number} total_cols - toplam tablo sütun
         * @param {Number} totalLines - toplam kazanma çizgisi
        */
        async generate_game_table(total_rows, total_cols, totalLines) {
        
        this.total_rows = total_rows
        this.total_cols = total_cols
        this.requestedLines = totalLines

        // get assets
        await this.game_get_config()

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

        for (const line of this.paylines) {

            let symbols = line.map(([row, col]) => this.matrix_table[row][col]);

            
            if (symbols.includes(undefined)) continue;
        

            let cardCount = {}
            
            for (let symbol of symbols) {

                if (!cardCount[symbol.cardId]) {
                    cardCount[symbol.cardId] = 0;
                }

                cardCount[symbol.cardId]++;
            }

            for (let cardId in cardCount) {


                if (cardCount[cardId] >= 3) {

                    data.win = true;

                    const table = []

                            symbols.forEach(symbol => {

                                const cardId = symbol.cardId;
                                const x = symbol.cordinate.x;
                                const y = symbol.cordinate.y;
                                
                                const row = table.find(data => data.line === symbol.line)

                                if (row) {

                                    row.cards.push({ cardId, x, y})
                                
                                } else {

                                    table.push({ line: symbol.line, cards: [{ cardId, x, y }]})
                                }
                                
                            });


                     data.winningPaylines = table
                }
            }



        /*
            if (symbols.every((symbol) => symbol.cardId === symbols[0].cardId)) {

                data.win = true
                // data.payline = line

                console.log("veri:", symbols)
        
                const table = []

                symbols.forEach(symbol => {

                    const cardId = symbol.cardId;
                    const x = symbol.cordinate.x;
                    const y = symbol.cordinate.y;
                    
                    const row = table.find(data => data.line === symbol.line)

                    if (row) {

                        row.cards.push({ cardId, x, y})
                    
                    } else {

                        table.push({ line: symbol.line, cards: [{ cardId, x, y }]})
                    }
                    
                });

                data.winningPaylines = table
                
                // data.payout = calculatePayout(symbols, multiplier)
                break
            }
          */
        }

   
        this.diagram(data)

        // restructure response data for cells key
        for (const rows of this.matrix_table) {

            data.cells.push(rows.map(object => object.cardId))            
        }


        return data
    }



    async calculatePayout(data) {
        // win oranı ve volality ve kard kombinasyonları baz alınarak ödeme yapılacak, balance için 
        // kuvvetli ihtimal operator API ile iletişim kurulacak
    }


    diagram(data) {

        return null
        
        const { winningCards } = data

        const diagram = Array.from({ length: this.total_rows }, () => Array(this.total_cols).fill('*'))

        if (winningCards.length) {
                
            // array data
            // diagram[x][y] = 'x';
            
        }
    
        console.log(diagram.map(table => table.join(' ')).join('\n'));
    }
}










module.exports = Game