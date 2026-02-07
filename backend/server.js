import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors())
app.use(express.json())

app.post('/api/execute', async (req, res) => {
    const { language_id, source_code, stdin } = req.body;

    try {
        const submission = await axios.post(
            'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
            { language_id, source_code, stdin },
            {
                headers: {
                    'x-rapidapi-key': process.env.JUDGE0_KEY,
                    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
                    'Content-Type': 'application/json'
                }
            }
        )
        res.json(submission.data)
    } catch(err){
        res.status(500).json({error:err.message})
    }
})


app.listen(process.env.PORT, () => console.log(`Server started at port:${process.env.PORT}`))