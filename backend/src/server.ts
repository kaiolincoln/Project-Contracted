// Arquivo para iniciar backend -- ass: lincoln

// ARQUITETURA EM CAMADAS:


import cors from 'cors'
import "dotenv/config"
import  express  from "express";

const app = express();

app.use(express.json());
app.use(cors())

const PORT = process.env.PORT! || 3333;

app.listen(PORT, () => {
    console.log("testeee")
})