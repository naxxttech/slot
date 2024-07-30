class PaymentProcessor {

    constructor() {
    
    }

    async checkUserBalance(userId) {
    
        return await this.connect_to_payment_service(userId)
        
      }



    async pay(userId, amount) {

      
    }


    async connect_to_payment_service(payload) {

        try {
            
            const { amount, userId } = payload
            // api request
            // test data for now
            return { balanceBefore: 4500}

        } catch (error) {
            
            console.log("[Payment] Error:", error)
            throw error
        }

    }

}



module.exports = PaymentProcessor