const  mongoose = require("mongoose")

async function main (){

    await  mongoose.connect ( "mongodb+srv://Vishal:07022005vishal@database.zzugmbr.mongodb.net/carelens");

}

module.exports = main ;