const express = require("express")
const router = express.Router()



router.get("/admin", (request, response) => {

    response.render("admin/index", { title: "Admin Dashboard"})
})




module.exports = router