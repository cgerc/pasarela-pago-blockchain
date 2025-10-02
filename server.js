require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Web3 = require('web3');
const web3 = new Web3(process.env.INFURA_URL);

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Pago fiat con Stripe
app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body; // Monto en centavos
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Pago cripto con Ethereum
app.post('/crypto-payment', async (req, res) => {
  const { toAddress, amountEth, fromAddress } = req.body;
  try {
    const tx = {
      from: fromAddress,
      to: toAddress,
      value: web3.utils.toWei(amountEth, 'ether'),
      gas: 21000,
    };
    // Nota: La firma de la transacción debe hacerse en el frontend (MetaMask)
    res.json({ message: 'Transacción lista para firmar', tx });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Servidor en puerto 3000'));