

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_KEY);
const app = express();

// UPDATED CORS - Allow both ports
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5001'];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test endpoint
app.get("/", (req, res) => {
    res.json({ 
        message: "Backend is running!",
        status: "success"
    });
});

// Payment endpoint
app.post("/payment/create", async (req, res) => {
    console.log("=== PAYMENT REQUEST RECEIVED ===");
    console.log("Request body:", req.body);
    console.log("Origin:", req.headers.origin);
    
    const total = parseInt(req.body.total);
    
    if (!total || total <= 0) {
        console.log("Invalid total:", total);
        return res.status(400).json({
            error: "Total must be greater than 0",
            received: total
        });
    }
    
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100),
            currency: "usd",
            payment_method_types: ["card"],
        });
        
        console.log("PaymentIntent created:", paymentIntent.id);
        
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
        
    } catch (error) {
        console.error("Stripe error:", error.message);
        res.status(500).json({
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`🚀 Backend Server Running`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`✅ Allowed Origins: ${allowedOrigins.join(', ')}`);
    console.log(`💳 Payment endpoint: http://localhost:${PORT}/payment/create`);
    console.log(`=================================`);
});


// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");

// dotenv.config();

// const stripe = require("stripe")(process.env.STRIPE_KEY);
// const app = express();

// // COMPLETE CORS FIX - Allow everything for development
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
//   // Handle preflight requests
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }
//   next();
// });

// // Also use cors middleware
// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Test endpoint
// app.get("/", (req, res) => {
//     res.json({ 
//         message: "Backend is running!",
//         status: "success"
//     });
// });

// // Payment endpoint
// app.post("/payment/create", async (req, res) => {
//     console.log("=== PAYMENT REQUEST RECEIVED ===");
//     console.log("Request body:", req.body);
//     console.log("Origin:", req.headers.origin);
    
//     const total = parseInt(req.body.total);
    
//     if (!total || total <= 0) {
//         console.log("Invalid total:", total);
//         return res.status(400).json({
//             error: "Total must be greater than 0",
//             received: total
//         });
//     }
    
//     try {
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: Math.round(total * 100),
//             currency: "usd",
//             payment_method_types: ["card"],
//         });
        
//         console.log("PaymentIntent created:", paymentIntent.id);
        
//         res.status(200).json({
//             clientSecret: paymentIntent.client_secret,
//             paymentIntentId: paymentIntent.id
//         });
        
//     } catch (error) {
//         console.error("Stripe error:", error.message);
//         res.status(500).json({
//             error: error.message
//         });
//     }
// });

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//     console.log(`=================================`);
//     console.log(`🚀 Backend Server Running`);
//     console.log(`📍 URL: http://localhost:${PORT}`);
//     console.log(`💳 Payment endpoint: http://localhost:${PORT}/payment/create`);
//     console.log(`🧪 Test endpoint: http://localhost:${PORT}/`);
//     console.log(`=================================`);
// });