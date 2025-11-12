import express from "express";
import connectDB from "./config/db.js";
import fileRoutes from "./routes/file.routes.js"
import authRoutes from "./routes/auth.routes.js"
import aiRoutes from "./routes/ai.routes.js"

const PORT = 3000;
const app = express();

connectDB();
app.use(express.json());

app.use("/api/file", fileRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/ai", aiRoutes)


app.listen(PORT,()=>{
    console.log(`Server is running on PORT: ${PORT} `)
})