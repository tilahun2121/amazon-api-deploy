

// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");

// dotenv.config();

// const stripe = require("stripe")(process.env.STRIPE_KEY);
// const app = express();

// // UPDATED CORS - Allow both ports
// const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'https://amazon-api-deploy-qew7.onrender.com'];

// app.use(cors({
//     origin: function(origin, callback) {
//         // Allow requests with no origin (like mobile apps or curl)
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.indexOf(origin) === -1) {
//             const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//             return callback(new Error(msg), false);
//         }
//         return callback(null, true);
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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
//     console.log(`✅ Allowed Origins: ${allowedOrigins.join(', ')}`);
//     console.log(`💳 Payment endpoint: http://localhost:${PORT}/payment/create`);
//     console.log(`=================================`);
// });

// //https://amazon-api-deploy-qew7.onrender.com


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();


// TEMPORARY OPEN CORS
// Allows all origins during deployment/testing
app.use(cors());


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Test Route
app.get("/", (req, res) => {
    res.json({
        message: "Backend is running!",
        status: "success"
    });
});


// Payment Route
app.post("/payment/create", async (req, res) => {

    console.log("=== PAYMENT REQUEST RECEIVED ===");
    console.log("Body:", req.body);

    try {

        const total = Number(req.body.total);

        if (!total || total <= 0) {
            return res.status(400).json({
                error: "Total must be greater than 0"
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100),
            currency: "usd",
            payment_method_types: ["card"]
        });

        console.log("PaymentIntent created:", paymentIntent.id);

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });

    } catch (error) {

        console.error("Stripe Error:", error.message);

        res.status(500).json({
            error: error.message
        });
    }
});


// Render PORT
const PORT = process.env.PORT || 5001;


app.listen(PORT, () => {

    console.log("=================================");
    console.log("🚀 Backend Server Running");
    console.log(`🚀 Server running on port ${PORT}`);
    console.log("🌍 CORS temporarily OPEN");
    console.log("=================================");
});