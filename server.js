const express = require('express'); // Import the express module
const cors = require('cors'); // 1. Import it
const app = express(); // Create an Express application instance
app.use(cors()); // 2. Enable it for all routes
const PORT = 3000; // Define the port number
const {listarEnderecos, listarCidades, listarPaises} = require('./main')

// Define a route for the home page (root URL)
app.get('/listarTudo', (req, res) => {
  listarDadosCompletos2() // Call the listarTudo function from the main module
    .then((result) => {
      res.json(result); // Send the result as a JSON response
    })
    .catch((error) => {
      console.error('Error:', error); // Log any errors to the console
      res.status(500).json({ error: 'An error occurred' }); // Send a 500 error response with a message
    });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`); // Log a message to the console
});

app.get('/listarCidades', (req, res) => {
    listarCidades() 
      .then((result) => {
        res.json(result); // Send the result as a JSON response
      })
      .catch((error) => {
        console.error('Error:', error); // Log any errors to the console
        res.status(500).json({ error: 'An error occurred' }); // Send a 500 error response with a message
      });
  });

app.get('/listarPaises', (req, res) => {
  listarPaises() 
    .then((result) => {
      res.json(result); // Send the result as a JSON response
    })
    .catch((error) => {
      console.error('Error:', error); // Log any errors to the console
      res.status(500).json({ error: 'An error occurred' }); // Send a 500 error response with a message
    });
});

app.get('/listarEnderecos',async (req, res) => {
  try{
    let result = await listarEnderecos();
    res.json(result)
  }catch(error){
    console.error('Error:', error); // Log any errors to the console
    res.status(500).json({ error: 'An error occurred' }); // Send a 500 error response with a message
  }

})



