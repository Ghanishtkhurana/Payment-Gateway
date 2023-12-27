import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { loadStripe } from "@stripe/stripe-js";

const Stripe = () => {
  const [name, setName] = useState("Ghanisht");
  const [amount, setAmount] = useState("2000");
  const router = useRouter();

  const handleThePayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/create-checkout-session",
        {
          name,
          amount: parseFloat(amount) * 100,
        }
      );
      const data = response.data;
      router.replace(data.url);
      console.log("response data in frontend =>", response.data);
    } catch (error) {
      console.log("err in frontend=>", error);
    }
  };

  let carts = [
    {
      dish: "dahi kabab",
      img: "image photo",
      price: 1,
      qnty: 1,
    },
    // {
    //   dish: "malai murga",
    //   img: "image photo",
    //   price: 1,
    //   qnty: 1,
    // },
  ];
  const checkPayment = async (e) => {
    e.preventDefault();
    console.log("helo bro ");
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
  };
  const makePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51ONu2ASDx4aDwhPb0dRa2WfNrv2edL4hwQntDTs5mQ9TTRZHekibrdo0akhrV2xk9KhfIsHJW44Z8Oeouv8evVKr00rVNH1dp0"
    );

    const response = await axios.post(
      "http://localhost:8080/create-checkout-session",
      carts
    );
    const data = response.data;
    console.log("data in frontend second func", data);
    router.push(data?.id);
  };
  return (
    <div className="min-h-screen flex justify-center items-center">
      <form onSubmit={checkPayment} method="POST">
        <section>
          <button type="submit" role="link">
            Checkout
          </button>
        </section>
        <style jsx>
          {`
            section {
              background: #ffffff;
              display: flex;
              flex-direction: column;
              width: 400px;
              height: 112px;
              border-radius: 6px;
              justify-content: space-between;
            }
            button {
              height: 36px;
              background: #556cd6;
              border-radius: 4px;
              color: white;
              border: 0;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;
              box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
            }
            button:hover {
              opacity: 0.8;
            }
          `}
        </style>
      </form>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Stripe), { ssr: false });
