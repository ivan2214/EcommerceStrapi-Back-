"use strict";

/**
 * product controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const mercadopago = require("mercadopago");
const token =
  "TEST-5252115275455780-121417-be37b959d204d0f35c680239791faf1b-1264128618";
mercadopago.configure({
  access_token: token,
});

module.exports = createCoreController("api::product.product", () => ({
  async index(ctx, next) {
    let preference = {
      items: [
        {
          title: "Mi producto",
          unit_price: 100,
          quantity: 1,
        },
      ],
      purpose: "wallet_purchase",
      back_urls: {
        success: "http://localhost:3000",
        failure: "http://localhost:3000/failure",
        pending: "http://localhost:3000/pending",
      },
      auto_return: "approved",
      notification_url: "https://www.your-site.com/ipn",
      statement_descriptor: "StripeEcommerce",
      binary_mode: true,
      shipments: {
        cost: 3000,
        mode: "not_specified",
      },
    };
    try {
      const responde = await mercadopago.preferences.create(preference);

      ctx.send(responde);
    } catch (error) {
      console.log(error.message);
    }
  },
}));
