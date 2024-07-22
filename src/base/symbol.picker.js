const crypto = require('crypto');

class RNG {

    constructor(symbols) {
        this.symbols = symbols;
    }


    /**
         * Rastgele sembol üretir
         * @returns {Object} - Rastgele sembol
     */
    getRandomSymbol() {
        const index = this.getRandomInteger(0, this.symbols.length);
        console.log("index:", index)
        return symbols[index];
    }



    /**
         * Sembolleri düşme olasılığına göre seçer
         * @returns {Object} - Rastgele sembol
    */
     getRandomSymbolWithProbability() {

            const totalProbability = this.symbols.reduce((sum, symbol) => sum + symbol.probability, 0);
            let random = Math.random() * totalProbability;
            
            console.log("generated random:", random)
            
            for (const symbol of this.symbols) {
                if (random < symbol.probability) {
                    return symbol;
                }
                random -= symbol.probability;
            }
     }

    /**
         * Kriptografik olarak güvenli rastgele sayı üreteci
         * @param {number} min - Minimum değer 
         * @param {number} max - Maksimum değer
         * @returns {number} - Rastgele sayı
     */
    getRandomInteger(min, max) {
            // min dahil, max hariç
            if (min >= max) {
                throw new Error('Min should be less than max');
            }


            const range = max - min;
            const randomBytes = crypto.randomBytes(4).readUInt32LE();
            const potentialNumber =  min + (randomBytes % range);
            
            console.log("rng:", potentialNumber)
            return potentialNumber
        }
}


const test_symbols = [
    { id: 0, name: 'ACE', probability: 0.7 },
    { id: 1, name: 'KING', probability: 0.01 },
    { id: 2, name: 'QUEEN', probability: 0.1 },
    { id: 3, name: 'JACK', probability: 0.1 },
    { id: 4, name: 'TEN', probability: 0.1 },
    { id: 5, name: 'NINE', probability: 0.1 },
    { id: 6, name: 'CHERRY', probability: 0.15 },
    { id: 7, name: 'BAR', probability: 0.15 },
];



/*
const random = new RNG(test_symbols);

// Örnek kullanım
for (let index = 0; index <= 15; index++) {
    
    console.log("devir - ", index, random.getRandomSymbolWithProbability());
}

*/


module.exports = RNG