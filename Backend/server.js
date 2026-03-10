require("dotenv").config()
const app=require("./src/app")
const db=require("./src/config/db")
const {resume,selfDescription,JobDescription} =require("./src/services/temp")
const generateInterviewReport=require("./src/services/ai.service")

// dotenv.config()

// generateInterviewReport({resume,selfDescription,JobDescription})

db();

app.listen(3000,()=>{
    console.log("server is running on port 3000");
    
})