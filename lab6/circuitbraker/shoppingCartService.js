const express = require('express');
const bodyParser = require('body-parser');
const circuitBreaker = require('./paymentServiceCircuit');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

app.get('/checkout', async (req, res) => {
  const paymentDetails = req.body;

  try {
    const response = await circuitBreaker.fire(paymentDetails);
    res.status(200).send(response);
  } catch (err) {
    try {
      // Solicitar la página de error desde el servicio error-pages
      const errorResponse = await fetch('http://localhost:8080/410.html');
      const errorBody = await errorResponse.text();

      // Enviar el contenido de la página de error al cliente
      res.status(410).type('text/html').send(errorBody);
    } catch (fetchErr) {
      // Manejar errores en caso de que error-pages no esté disponible
      //res.status(500).send("Error loading error page");
      res.status(410).type('text/html').send(errorBody);
    }
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Shopping cart service listening on port ${PORT}`);
});















































// const express = require('express');
// const bodyParser = require('body-parser');
// const circuitBreaker = require('./paymentServiceCircuit');

// const app = express();
// app.use(bodyParser.json());

// app.get('/checkout', async (req, res) => {
//   const paymentDetails = req.body;

//   try {
//     const response = await circuitBreaker.fire(paymentDetails);
//     res.status(200).send(response);
//   } catch (err) {
//     res.redirect('http://localhost:8080/410.html');
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Shopping cart service listening on port ${PORT}`);
// });