import express, { Request, Response } from 'express'
import cors from 'cors'
import { userRoute } from './router/userRoute'
import { postRoute } from './router/postRoute'


const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.use("/users", userRoute);
app.use("/posts", postRoute);
