import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COURSES = [
    { id: 'CS101' , title : 'Introduction to web programming' , credits: 6},
    { id: 'CS202' , title : 'Backend architecture & APIs' , credits : 6},
    { id: 'CS305' , title : 'Modern Javacript & async System' , credits : 5 }       
];

let requestsServed = 0;

app.use((req , res , next) => {
    const timestamp = new Date().toISOString();
    console.log('[${timestamp}] ${req.method} ${req.url}');
    next();
});

app.use((req , res , next) => {
    requestsServed += 1;
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/hello' , (req , res) => {
    res.type('text/plain').send("Hello from Mounib's server!");
})
app.get('/robots.txt' , (req , res) => {
    res.type('text/plain').send('User-agent: *\nDisallow: /api/admin\n');
})

app.get('/welcome' , (req , res) => {
    res.redirect('/hello');
});

app.get('/api/courses' , (req , res) => {
    res.json(COURSES);
});

app.get('/api/status' , (req , res) => {
    res.json({ status:'OK' , nodeVersion: process.version , uptimeSeconds: Math.floor(process.uptime())});
});

app.get('/api/headers' , (req , res) => {
    res.json({
        userAgent: req.get('User-Agent') || null,
        accept: req.get('Accept') || null});
    });

app.post('/api/subscriber' , (req,res) => {
    res.status(201).json({subscribed : true});
})

app.get('/api/admin' , (req,res) => {
    res.status(403).json({error:'Forbidden'});
})

app.get('/api/stats' , (req , res) => {
    res.json({requestsServed});
});

app.use((req , res) => {
    if (req.path.startsWith('/api')){
        return res.status(404).json({error : 'Not found'});
    }
    res.status(404).type('text/plain').send('404 - Page not found');
});

app.listen(PORT , () => {
    console.log(`Server is running at http://localhost:${PORT}`)
});

