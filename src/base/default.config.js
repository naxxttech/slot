const symbols  = [
    { id: 0, reel: "ACE", probability: 0.1 }, 
    { id: 1, reel: "ANCHOR", probability: 0.1 }, 
    { id: 2, reel: 'FISH', probability: 0.1 }, 
    { id: 3, reel: 'HORSE', probability: 0.1 }, 
    { id: 4, reel: 'JACK', probability: 0.1 }, 
    { id: 5, reel: 'KING', probability: 0.1}, 
    { id: 6, reel: "NINE", probability: 0.1 }, 
    { id: 7, reel: "QUEEN", probability: 0.1 }, 
    { id: 8, reel: "SCATTER", probability: 0.1 },
    { id: 9, reel: "SHELL", probability: 0.1 },
    { id: 10, reel: "STAR", probability: 0.1 },
    { id: 11, reel: "TEN", probability: 0.1 },
    { id: 12, reel: "WILD", probability: 0.1 }
];


        
// static PT for now
const starter_value = { x2: 3, x3: 5, x4: 7, x5: 10}
const common_value = { x3: 3, x4: 6, x5: 12 }
const medium_value = { x3: 15, x4: 20, x5: 25 }
const rare_value = { x3: 20, x4: 25, x5: 35 }
const tresure_value = { x2: 15, x3: 20, x4: 25, x5: 30 }
const super_value = { x3: 30, x4: 35, x5: 40 }
const requiredCards = [3, 2]
const payTable = [
    
    { id: 0, reel:'ACE', payouts: common_value, minSymbols: requiredCards[0] },
    { id: 5, reel:'KING', payouts: common_value, minSymbols: requiredCards[0] },
    { id: 2, reel:'FISH', payouts: starter_value, minSymbols: requiredCards[1] },
    { id: 1, reel:'ANCHOR', payouts: starter_value, minSymbols: requiredCards[1] },
    { id: 3, reel:'HORSE', payouts: { x3: 6, x4: 12, x5: 18}, minSymbols: requiredCards[0] },
    { id: 4, reel:'JACK', payouts: medium_value, minSymbols: requiredCards[0] },
    { id: 11, reel:'TEN', payouts: medium_value, minSymbols: requiredCards[0] },
    { id: 7, reel:'QUEEN', payouts: medium_value, minSymbols: requiredCards[0] },
    { id: 9, reel:'SHELL', payouts: rare_value, minSymbols: requiredCards[0] },
    { id: 10, reel:'STAR', payouts: rare_value, minSymbols: requiredCards[0] },
    { id: 6, reel:'NINE', payouts: { x2: 3, x3: 6, x4: 12, x5: 18}, minSymbols: requiredCards[1] },
    { id: 8, reel:'SCATTER', payouts: tresure_value, minSymbols: requiredCards[1] },
    { id: 12, reel:'WILD', payouts: super_value, minSymbols: requiredCards[0] },
];


const paylines = [
    
    [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]],

    [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],

    [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]],

    [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]],
    
    [[2, 0], [1, 1], [0, 2], [1, 3], [2, 4]],

    [[0, 0], [0, 1], [1, 2], [0, 3], [0, 4]],

    [[1, 2], [2, 0], [2, 1], [2, 3], [2, 4]],

    [[0, 1], [0, 2], [0, 3], [1, 0], [1, 4]],

    [[1, 0], [2, 1], [2, 2], [2, 3], [1, 4]],

    [[0, 2], [1, 0], [1, 1], [1, 3], [1, 4]],

    [[1, 0], [1, 1], [2, 2], [1, 3], [1, 4]],

    [[0, 0], [0, 1], [1, 2], [2, 3], [2, 4]],

    [[0, 3], [0, 4], [1, 2], [2, 0], [2, 1]],

    [[0, 1], [1, 0], [1, 2], [2, 3], [1, 4]],

    [[0, 3], [1, 0], [2, 1], [1, 2], [1, 4]],

    [[0, 0], [1, 1], [1, 2], [1, 3], [2, 4]],

    [[0, 4], [1, 1], [1, 2], [1, 3], [2, 0]],

    [[1, 0], [0, 1], [0, 2], [1, 3], [2, 4]],

    [[1, 0], [2, 1], [2, 2], [1, 3], [0, 4]],

    [[0, 0], [2, 1], [0, 2], [2, 3], [0, 4]],

    [[2, 0], [0, 1], [2, 2], [0, 3], [2, 4]],

    [[0, 0], [0, 1], [1, 2], [2, 3], [1, 4]],

    [[2, 0], [2, 1], [1, 2], [0, 3], [1, 4]],

    [[1, 0], [1, 1], [0, 2], [1, 3], [2, 4]],

    [[1, 0], [1, 1], [2, 2], [1, 3], [0, 4]],
 ]



 module.exports = { symbols, paylines, payTable }