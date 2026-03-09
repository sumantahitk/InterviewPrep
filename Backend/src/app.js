const express=require("express")
const authRouter=require("./routes/auth.routes")
const cookiesParser=require("cookie-parser")
const cors=require("cors")

const app=express();

app.use(express.json())
app.use(cookiesParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentilas:true
}))

app.use("/api/auth",authRouter);




module.exports = app