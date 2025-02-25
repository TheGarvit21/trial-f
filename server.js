const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Subscription Schema
const subscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    plan: { type: String, required: true },
    status: { type: String, required: true },
    stripeSubscriptionId: String,
    startDate: Date,
    endDate: Date,
    isYearly: Boolean
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

// Payment Routes
app.post('/api/create-payment-intent', async (req, res) => {
    try {
        const { plan, isYearly } = req.body;
        
        // Get price based on plan and billing period
        const price = getPlanPrice(plan, isYearly);
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: price * 100, // Stripe uses cents
            currency: 'usd',
            metadata: {
                plan,
                isYearly
            }
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/create-subscription', async (req, res) => {
    try {
        const { userId, plan, isYearly, paymentMethodId } = req.body;

        // Create or get Stripe customer
        const customer = await createOrGetCustomer(userId, paymentMethodId);

        // Create subscription in Stripe
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: getPlanPriceId(plan, isYearly) }],
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent']
        });

        // Save subscription in database
        await Subscription.create({
            userId,
            plan,
            status: 'active',
            stripeSubscriptionId: subscription.id,
            startDate: new Date(),
            endDate: calculateEndDate(isYearly),
            isYearly
        });

        res.json({
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Webhook handling
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            await handlePaymentSuccess(event.data.object);
            break;
        case 'customer.subscription.updated':
            await handleSubscriptionUpdate(event.data.object);
            break;
        case 'customer.subscription.deleted':
            await handleSubscriptionCancellation(event.data.object);
            break;
    }

    res.json({ received: true });
});

// Helper functions
function getPlanPrice(plan, isYearly) {
    const prices = {
        basic: { monthly: 29, yearly: 279 },
        pro: { monthly: 49, yearly: 469 },
        enterprise: { monthly: 99, yearly: 949 }
    };
    return prices[plan][isYearly ? 'yearly' : 'monthly'];
}

function getPlanPriceId(plan, isYearly) {
    // Replace with your actual Stripe price IDs
    const priceIds = {
        basic: { monthly: 'price_H1YggUeALrX4pg', yearly: 'price_H1YhbUeALrX4pg' },
        pro: { monthly: 'price_H1YiUeALrX4pg', yearly: 'price_H1YjbUeALrX4pg' },
        enterprise: { monthly: 'price_H1YkUeALrX4pg', yearly: 'price_H1YlbUeALrX4pg' }
    };
    return priceIds[plan][isYearly ? 'yearly' : 'monthly'];
}

function calculateEndDate(isYearly) {
    const date = new Date();
    date.setFullYear(date.getFullYear() + (isYearly ? 1 : 0));
    date.setMonth(date.getMonth() + (isYearly ? 0 : 1));
    return date;
}

async function createOrGetCustomer(userId, paymentMethodId) {
    // Implementation to create or get Stripe customer
}

async function handlePaymentSuccess(paymentIntent) {
    // Implementation to handle successful payment
}

async function handleSubscriptionUpdate(subscription) {
    // Implementation to handle subscription updates
}

async function handleSubscriptionCancellation(subscription) {
    // Implementation to handle subscription cancellation
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));