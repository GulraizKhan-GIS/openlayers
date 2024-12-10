const express = require('express');
const path = require('path');
const app = express();
const port =process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/t', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/test', '1.html'));   
  });
// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});