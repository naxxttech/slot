const crypto = require("crypto")

/*
0.5 = %50
0.3 = %30
0.1 = %10
0.0.5 = %5
0.0.3= %3

*/

const reels  = [
    { id: 1, reel: "Orc", probability: 0.2 }, 
    { id: 2, reel: 'Skull', probability: 0.1 }, 
    { id: 3, reel: 'Knight', probability: 0.1 }, 
    { id: 4, reel: 'Archer', probability: 0.1 }, 
    { id: 5, reel: 'Horse Knight', probability: 0.04}, 
    { id: 6, reel: "Elite Wild", probability: 0.03 }, 
    { id: 7, reel: "King", probability: 0.01 }, 
    { id: 8, reel: "Queen", probability: 0.01 }
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

function getReelsForVolatility(volatility) {

    const totalProbability = reels.reduce((sum, reel) => sum + reel.probability, 0);
    console.log("sembollerin toplam olasılığı:", totalProbability)

    switch (volatility) {
        case 'low':
            return reels.map(reel => ({
                ...reel,
                probability: (reel.probability / totalProbability) * 0.3
            }));

        case 'medium':
            return reels.map(reel => ({
                ...reel,
                probability: reel.probability / totalProbability
            }));

        case 'high':
            return reels.map(reel => ({
                ...reel,
                probability: (reel.probability / totalProbability) * 0.1
            }));

        default:
            throw new Error('Unknown volatility level');
    }
}


/**
 * volatility: kazanma oranını belirler. Yüksek volat.. az win ama bol kazanç vadeder.
 * düşük volatility: daha sık kazanma ama az kazanç vadeder.
 * @param {string} volatility <low | medium | high>
 * 
*/

function getRandomReel(volatility) {

    const reels = getReelsForVolatility(volatility);
    
    const random_number = crypto.randomInt(100000) / 100000;

    console.log("random number:", random_number)

    let chance = 0;


    // parça döndürmeye başla
    for (const reel of reels) {
        chance += reel.probability;
        console.log("chance:", chance, "random number:", random_number)
        if (random_number < chance) {
            console.log("Şans oranı tuttu düşen parça:", reel.reel)
            return reel;
        }

    }



   console.log("Şans oranı düşük rastgele belirleniyor.")
   return reels[Math.floor(Math.random() * reels.length)]
   // parça düşene kadar tekrarla
//    return getRandomReel(volatility);
}



module.exports = { getRandomReel, getReelsForVolatility, reels, payTable }