const mongoose=require("mongoose")

async function connectDb(){
    try{

        await mongoose.connect(process.env.MONGO_URI);
        console.log("DataBase connected Successfully");
    }catch(e){
        console.log(e);
    }
}

module.exports=connectDb;