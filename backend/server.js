// Minimal Express server for Stripe Connect MVP
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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
    res.json({ url: accountLink.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to create a payment intent (simulate payment to connected account)
app.post('/pay', async (req, res) => {
  try {
    const { accountId } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // $10
      currency: 'usd',
      payment_method_types: ['card'],
      transfer_data: { destination: accountId },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
