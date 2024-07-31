class PaymentProcessor {

    constructor() {
    
    }

    async checkUserBalance(userId) {
    
        return await this.connect_to_payment_service({userId}, "getBalance")
        
      }



    async pay(userId, amount) {

        return await this.connect_to_payment_service({amount, userId, multiplier: 2 }, "payUser")
    }


    async charge(userId, amount) {

        return await this.connect_to_payment_service({ amount, userId}, "chargeUser")
    }

    async connect_to_payment_service(payload, action) {

        try {
            
            const defaultUserBalance = 4500
            const { amount, userId } = payload
            
            let response = {}

            // api request
            // test data for now
            switch(action) {

                case "getBalance":
                response = { balanceBefore: defaultUserBalance }
                break;

                case "payUser":
                response = { balanceBefore: defaultUserBalance, balanceAfter: 4800 }
                break;

                case "chargeUser":
                response = { balanceBefore: defaultUserBalance, balanceAfter: amount }
                break;
            }
       

            return response

        } catch (error) {
            
            console.log("[Payment] Error:", error)
            throw error
        }

    }

}



module.exports = PaymentProcessor