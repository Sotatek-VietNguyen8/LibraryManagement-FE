import express from "express"
import dotenv from "dotenv"
import authRoute from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"
import cors from "cors" 
import path from "path"


import cron from 'node-cron'
import { WebSocketServer } from "ws"
import { createServer } from "http"
import { checkOverdueDockets, handleWebSocketMessage, setConnectedUser } from "./controllers/docket.controller.js"
const app = express()
const __dirname = path.resolve()

app.use(cookieParser())
app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use("/api/auth", authRoute)
app.use(express.static(path.join(__dirname, 'public')))
dotenv.config()
const port = process.env.PORT 
const host = process.env.host

const server = createServer(app)
const wss = new WebSocketServer({server})
const connectedUser  = new Map()
setConnectedUser(connectedUser)
wss.on('connection', ws => {
    console.log('Client connected')

    ws.on('message', async message => {
        await handleWebSocketMessage(message, ws)
    })

    ws.on('close', () => {
        for (const [userId, socket] of connectedUser.entries()) {
            if (socket === ws) {
                connectedUser.delete(userId)
                console.log(`User ${userId} disconnected.`)
                break
            }
        }
        console.log('Client disconnected')
    })

    ws.on('error', console.error)
})
cron.schedule('0 0 * * *', checkOverdueDockets)
app.listen(port, host, () =>{
    console.log(`Server is running on http://${host}:${port}`)
    connectDB()
})

import { checkOverdueDockets } from "../controllers/docket.controller.js"

router.post('/check-overdue', async (req, res) => {
    try {
        await checkOverdueDockets()
        res.status(200).json({ message: 'Overdue check triggered.' })
    } catch (error) {
        console.error("Error triggering overdue check:", error)
        res.status(500).json({ error: 'Failed to trigger overdue check.' })
    }
})

let connectedUser 
export const setConnectedUser = (user) => {
  connectedUser = user
}
export const checkOverdueDockets = async()=>{
    try {
        const overdueDockets = await docket.find({
            ngayHenTra: {$lt: new Date()},
            status: {$ne: 'returned'}
        })
        for(const overdueDocket of overdueDockets){
            const userId = overdueDocket.Identification
            const userSocket = connectedUser.get(userId)
            if(userSocket){
                userSocket.send(JSON.stringify({
                    type: 'overdue',
                    message: `Book "${overdueDocket.IdBook}" is overdue!. Please return it`
                }))
            }
            else{
                console.log(`User ${userId} is not connectd, cannot send notification`)
            }
        }
    } catch (error) {
        console.error("Error checking overdue books:", error)
    }
}

export const handleWebSocketMessage = async (message, ws) => {
    try {
        const parsedMessage = JSON.parse(message.toString())
        if (parsedMessage.type === 'login') {
            const userId = parsedMessage.userId
            connectedUser.set(userId, ws)
            console.log(`User ${userId} connected via WebSocket.`)
        }
    } catch (error) {
        console.error("Error parsing message", error)
    }
}

