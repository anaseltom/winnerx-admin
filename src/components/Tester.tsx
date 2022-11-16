import axios from "axios";
import React, { useEffect } from "react";

const Tester = () => {
  useEffect(() => {
    axios
      .post(
        // "https://api.workone.cloud:4545/api/v1/products/fetch-product-pricing"
        // "https://apii.workone.cloud:5000/api/v1/user/signin", {
        //     "email": "avtividad@yahoo.com",
        //     "password": "adonis1234"
        // }
        // "https://api.workone.cloud:4545/api/v1/domains/check-availability/",
        // {
        //   email: "ahmed@meekd.work",
        //   domain: "auricgavin.com",
        // }
        "https://apii.workone.cloud:5000/api/v1/billing/fetch-subscriptions",
        {
          "ip": "83.110.87.37",
          "customer_id": "cus_LzmgacSRo9V5kP" 
      }
      )
      .then((res: any) => {
        console.log("res >>>>", res);
      });
  }, []);

  return <div>Tester</div>;
};

export default Tester;
