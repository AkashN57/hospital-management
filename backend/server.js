import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import staffRouter from "./routes/staffRoutes.js" 
import complaintRouter from "./routes/complaintRoutes.js"  

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter,staffRouter)
app.use("/api/doctor", doctorRouter)

// app.use("/api/reviews", reviewsRouter)
app.use("/api/admin/complaints", complaintRouter) // Fix: Move complaints under admin

app.get("/", (req, res) => {
  res.send("API Working")
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))