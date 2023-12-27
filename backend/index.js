require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  try {
    res.status(200).send("Homepage");
  } catch (error) {
    res.status(400).send("Homepage");
  }
});
app.post("/phone_pay/payment", async (req, res) => {
  try {
    const url= 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay'
  } catch (error) {
    return res.status(400).send({message : error.message ,status : false })
  }
});

// stripe
app.post("/create-checkout-session", async (req, res) => {
  try {
    // const { name, amount } = req.body;
    const products = req.body;
    console.log("products=>", products);

    const LineItems = products.map((el, i) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: el.dish,
        },
        unit_amount: el.price * 100,
      },
      quantity: el.qnty,
    }));
    console.log("line items =>", LineItems);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: LineItems,
      mode: "payment",
      success_url:
        "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/stripe/cancel",
    });

    res.json({ id: session.url });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});

app.get("/success", async (req, res) => {
  const session_id = req.query.session_id;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === "paid") {
      try {
        const name = session.name;
        const amount = session.amount_total / 100;
        const transactionID = session.payment_intent;

        console.log({
          name: name,
          amount: amount,
          transactionId: transactionID,
        });
        // const newTransaction = new Transaction({name ,amount , transactionID})
        // await newTransaction.save()
      } catch (error) {
        res.status(400).send({ message: error.message, status: false });
      }
    } else {
      res.send({ message: "Payment Unseccessfull" });
    }
  } catch (error) {
    res.status(400).send({ message: "Payment success", status: false });
  }
});

app.get("/cancel", (req, res) => {
  res.send({ message: "Payment cancel ho gya apka", status: false });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
