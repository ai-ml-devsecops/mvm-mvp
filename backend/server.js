// Minimal Express server for Stripe Connect MVP
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.get('/', (req, res) => {
  // res.send('<h1>Backend is running!</h1>');
  // Serve the html file in /mvm-mvp/frontend/index.html
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));

});

// Endpoint to create a Connect account link (onboarding)
app.post('/create-account-link', async (req, res) => {
  try {
    const account = await stripe.accounts.create({ type: 'express' });
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'http://localhost:3000',
      return_url: 'http://localhost:3000',
      type: 'account_onboarding',
    });
    
    // Log the created account and accountLink for inspection
    console.log('Created Stripe account:', account);
    console.log('Created Stripe accountLink:', accountLink);

    // Return the link and the created objects for easier debugging in dev
    res.json({ url: accountLink.url, account, accountLink });
  } catch (err) {
    // Log error details for inspection
    const stripeError = {
      message: err && err.message,
      type: err && err.type,
      code: err && err.code,
      statusCode: err && err.statusCode,
      raw: err && err.raw,
    };
    console.error('Error creating account link:', stripeError);
    res.status(500).json({ error: stripeError });
  }
});

// Endpoint to create a payment intent (simulate payment to connected account)
app.post('/pay', async (req, res) => {
  try {
    const { accountId } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 10, // $10
      currency: 'usd',
      payment_method_types: ['card'],
      transfer_data: { destination: accountId },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const stripeError = {
      message: err && err.message,
      type: err && err.type,
      code: err && err.code,
      statusCode: err && err.statusCode,
      raw: err && err.raw,
    };
    console.error('Error creating payment intent:', stripeError);
    res.status(500).json({ error: stripeError });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
