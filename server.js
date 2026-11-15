import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

const COURSES = [
    { id: 'CS101' , title : 'Introduction to web programming' , credits: 6},
    { id: 'CS202' , title : 'Backend architecture & APIs' , credits : 6},
    { id: 'CS305' , title : 'Modern Javacript & async System' , credits : 5 }       
];


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
app.listen(PORT , () => {
    console.log(`Server is running at http://localhost:${PORT}`)
});

