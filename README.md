# mvm-mvp

## Stripe Connect MVP Quickstart

### 1. Install dependencies
```bash
cd backend
npm init -y
npm install express stripe cors dotenv
```

### 2. Set your Stripe secret key
- Edit `backend/.env` and set `STRIPE_SECRET_KEY=sk_test_...` (get from your Stripe dashboard)

### 3. Run the backend server
```bash
node server.js
```

### 4. Open the frontend
- Open `frontend/index.html` in your browser (use Live Server or open directly)

### 5. Try onboarding and payment
- Click **Onboard as Seller** to create a Connect account (complete onboarding in Stripe)
- Click **Pay Seller** and enter the connected account ID to simulate a payment

---

This is a minimal MVP for Stripe Connect Express onboarding and payment.