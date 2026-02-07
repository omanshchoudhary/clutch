import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.get('/', (req,res)=>{
    res.end('Hello naught boy')
})

app.listen(process.env.PORT, ()=> console.log(`Server started at port:${process.env.PORT}`))