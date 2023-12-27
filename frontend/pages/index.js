import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { v4 as uuidv4 } from "uuid";
import sha256 from "sha256";

const Index = () => {
  const [name, setName] = useState("Ghanisht");
  const [amount, setAmount] = useState("2000");
  const router = useRouter();

  let carts = [
    {
      dish: "dahi kabab",
      img: "image photo",
      price: 1,
      qnty: 1,
    },
    {
      dish: "malai murga",
      img: "image photo",
      price: 1,
      qnty: 1,
    },
  ];
  const checkPayment = async (e) => {
    e.preventDefault();
    try {
      const stripePromise = loadStripe(
        "pk_test_51NyFucSIXg0FffGqrdVVBcKU0cqHDOqcl1czsS9CW4DjH6Qvn6Q0fZ24sfcSV3YP0mgfJlkJ2qHP9PcqCAWsDbid00ttGB1t7h"
      );
      const response = await axios.post(
        "http://localhost:8080/create-checkout-session",
        carts
      );
      const data = response.data;
      console.log("data in frontend second func", data);
      router.push(data?.id);
    } catch (error) {
      console.log("error=>", error);
    }
  };

  const handlePhonePe = async () => {
    const transactionId = "MT-" + uuidv4().toString(36).slice(-6);

    let payload = {
      merchantId: process.env.NEXT_PUBLIC_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: "MUID123" + uuidv4().toString(36).slice(-6),
      amount: 10000,
      redirectUrl: `http://localhost:3000/phonepe/success/${transactionId}`,
      redirectMode: "POST",
      callbackUrl: `http://localhost:3000/phonepe/cancel/${transactionId}`,
      mobileNumber: "9999999999",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const dataPayload = JSON.stringify(payload);
    console.log("data payload =>", dataPayload);

    const dataBase64 = Buffer.from(dataPayload).toString("base64");
    console.log("data base 64 =>", dataBase64);

    const fullURL =
      dataBase64 + "/pg/v1/pay" + process.env.NEXT_PUBLIC_SALT_KEY;
    const datasha256 = sha256(fullURL);
    console.log("data sha=>", datasha256);
    const checksum = datasha256 + "###" + process.env.NEXT_PUBLIC_SALT_INDEX;
    console.log("check sum =>", checksum);
    const url = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

    try {
      const res = await axios.post(
        url,
        {
          request: dataBase64,
        },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            "X-VERIFY": checksum,
          },
        }
      );
      const data = res.data;
      console.log("data after response", data);
    } catch (error) {
      console.log("error in response =>", error);
    }

    // router.push(data.data.instrumentResponse.redirectInfo.url);
  };
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex gap-4">
        <button
          className="bg-purple-500 border px-5 py-2 text-white rounded-md"
          onClick={checkPayment}
        >
          Stripe
        </button>
        <button
          className="bg-purple-500 border px-5 py-2 text-white rounded-md"
          onClick={handlePhonePe}
        >
          Phone pe
        </button>
      </div>
    </div>
  );
};

export default Index;
