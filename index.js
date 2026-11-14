import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"         //cors : CORS controls which frontends (origins) can access my backend data in a browser.”
import dotenv from "dotenv"
import connectDb from "./utils/db.js";
import userRoute from "./routes/user.route.js"
import companyRoute from "./routes/company.route.js"
import jobRoute from "./routes/job.route.js"
import applicationRoute from "./routes/application.routes.js"
dotenv.config({})


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))        //The middleware intercepts the "raw" data stream, parses it based on the extended rules, and attaches it to the req object. Without it, req.body is undefined.
app.use(cookieParser())

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://job-application-frontend-nu.vercel.app/"
    ],
    credentials: true
};

app.use(cors(corsOptions))

const PORT = process.env.PORT || 2000


//api
app.use("/api/v1/user" , userRoute)
app.use("/api/v1/company" , companyRoute)
app.use("/api/v1/job" , jobRoute)
app.use("/api/v1/application" , applicationRoute)






app.listen( PORT, async()=>{
    await connectDb();
    console.log(`Server running at port ${PORT}`)
})