const { getRandomReel, getReelsForVolatility} = require('../helpers/reels')


function simulateSpins(spinCount, volatility) {
    const reels = getReelsForVolatility(volatility);
    let winCount = 0;

    for (let i = 0; i < spinCount; i++) {
        const spinResult = [];
        for (let j = 0; j < 3; j++) {
            const random = Math.random();
            let cumulativeProbability = 0;
            
            for (const reel of reels) {
                cumulativeProbability += reel.probability;
                if (random < cumulativeProbability) {
                    spinResult.push(reel.reel);
                    break;
                }
            }
        }

        // Check for win (3 reel)
        if (spinResult[0] === spinResult[1] && spinResult[1] === spinResult[2]) {
            winCount++;
        }
    }

    console.log(`Results for ${spinCount} spins with ${volatility} volatility:`);
    console.log(`Win count: ${winCount}`);
    console.log(`Win frequency: ${(winCount / spinCount).toFixed(2)}`);
}


const round = 1000
simulateSpins(round, 'low');
simulateSpins(round, 'medium');
simulateSpins(round, 'high');