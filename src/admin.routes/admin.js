const express = require("express")
const router = express.Router()
const GameSchema = require("../db/models/Game")

router.get("/admin", async (request, response) => {

    response.render("admin/index", { title: "Admin Dashboard"})
})


// game routes (CRUD)



module.exports = router