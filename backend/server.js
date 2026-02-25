// Imports
import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// App
const app = express();

// Env Imports
const PORT = process.env.PORT || 3000;
const configuredOrigins = (
  process.env.ALLOWED_ORIGINS ||
  process.env.ALLOWED_ORIGIN ||
  'http://localhost:5501,http://127.0.0.1:5501'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const ALLOWED_ORIGINS = [...new Set(
  configuredOrigins.flatMap((origin) => {
    try {
      const parsed = new URL(origin);
      if (parsed.hostname === 'localhost') {
        return [origin, `${parsed.protocol}//127.0.0.1${parsed.port ? `:${parsed.port}` : ''}`];
      }
      if (parsed.hostname === '127.0.0.1') {
        return [origin, `${parsed.protocol}//localhost${parsed.port ? `:${parsed.port}` : ''}`];
      }
    } catch (_err) {
      
    }
    return [origin];
  })
)];
const ALLOWED_LANGUAGE_IDS = new Set([50, 51, 54, 60, 62, 63, 71, 73, 74]);


// Adding Contraits
const MAX_SOURCE_BYTES = 100 * 1024;
const MAX_STDIN_BYTES = 10 * 1024;


//Middleware
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      const err = new Error('CORS: origin not allowed');
      err.status = 403;
      err.isCors = true;
      return cb(err);
    }
  })
)

app.use(express.json({ limit: '200kb' }))

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const languageId = req.body?.language_id ?? '-';
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ip=${ip} lang=${languageId}
  status=${res.statusCode} duration=${ms}ms`
    );
  });
  next();
});

const executeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: true,
  message: { error: 'Rate limit exceeded' }
})

function validateExecuteRequest(req, res, next) {
  const { language_id, source_code, stdin } = req.body ?? {};
  const errors = [];

  if (!Number.isInteger(language_id) || !ALLOWED_LANGUAGE_IDS.has(language_id)) {
    errors.push('language_id must be one of: 50,51,54,60,62,63,71,73,74');
  }

  if (typeof source_code !== 'string' || source_code.trim().length === 0) {
    errors.push('source_code must be a non-empty string');
  } else if (Buffer.byteLength(source_code, 'utf8') > MAX_SOURCE_BYTES) {
    errors.push('source_code exceeds 100KB limit');
  }

  let normalizedStdin = '';
  if (stdin !== undefined) {
    if (typeof stdin !== 'string') {
      errors.push('stdin must be a string');
    } else if (Buffer.byteLength(stdin, 'utf8') > MAX_STDIN_BYTES) {
      errors.push('stdin exceeds 10KB limit');
    } else {
      normalizedStdin = stdin;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  req.validated = { language_id, source_code, stdin: normalizedStdin };
  next();
}

//Routes
app.post('/api/execute', executeLimiter, validateExecuteRequest, async (req, res) => {
  const { language_id, source_code, stdin } = req.validated;

  try {
    const submission = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
      { language_id, source_code, stdin },
      {
        headers: {
          'x-rapidapi-key': process.env.JUDGE0_KEY,
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    )
    res.json(submission.data)
  } catch (err) {
    console.error('Judge0 upstream error:', err.message);
    return res.status(502).json({ error: 'Execution provider unavailable' });
  }
})

app.use((err, req, res, next) => {
  if (err?.isCors || err?.message === 'CORS: origin not allowed') {
    return res.status(err.status || 403).json({ error: 'CORS: origin not allowed' });
  }

  console.error('Unhandled server error:', err?.message || err);
  return res.status(err?.status || 500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`Server started at port:${PORT}`))
