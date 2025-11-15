const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

module.exports = paypal;

//test api credentials .. application name :demo-app with (Client ID/Secret key 1)
//https://developer.paypal.com/dashboard/applications/sandbox
//account:
//uid: nazihjr2@gmail.com
//pwd: njr@575...48
