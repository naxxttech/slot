/**
 * reels: oyunun parçalarını temsil eder
 * paytable: ödeme tablosunu
 * RTP oyuncuya uzun vadede dönecek olan mikatı belirler. Bu helper bu oranı hesaplar.
 * @param {Array} reels 
 * @param {Array} payTable 
 * 
*/

/*
    RTP = ( parçanın olasılığı x parçanın payout) × 100
*/
function calculateRTP (reels, payTable) {
    let totalRTP = 0;
    // parçaların toplam olasılığı
    const totalProbability = reels.reduce((sum, reel) => sum + reel.probability, 0);

    payTable.forEach(entry => {
        const { reel, payouts } = entry;
        const reelProbability = reels.find(r => r.reel === reel).probability;

        // parça sayısına göre ödeme oranı
        Object.keys(payouts).forEach(count => {
            const payout = payouts[count];
            totalRTP += payout * count * reelProbability;
        });
    });

    const rtp = totalRTP / totalProbability;

    return `%${rtp.toFixed(2)}`
};



module.exports = calculateRTP