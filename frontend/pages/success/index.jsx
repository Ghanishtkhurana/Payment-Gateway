import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Success = () => {
  const router = useRouter();
  const { session_id } = router.query;
  console.log("router.query", router.query.session_id);

  useEffect(() => {
    if (session_id) {
      console.log("session id mil gyi", session_id);
    }
  }, [session_id]);
  return <div>Success page</div>;
};

export default Success;
