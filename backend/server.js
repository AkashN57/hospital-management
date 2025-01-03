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
import reviewsRouter from "./routes/reviewRoutes.js"

const app = express()
const port = process.env.PORT || 4000

// Only connect to DB if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB()
  connectCloudinary()
}

app.use(express.json())
app.use(cors())

app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter,staffRouter)
app.use("/api/doctor", doctorRouter)
app.use("/api/reviews", reviewsRouter)
app.use("/api/admin/complaints", complaintRouter) 

app.get("/", (req, res) => {
  res.send("API Working")
});

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Server started on PORT:${port}`))
}

export default app