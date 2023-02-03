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
    const { cart } = ctx?.request?.body;
    let itemsCart = cart?.cartItems?.map(({ id, attributes, cartQuantity }) => {
      return {
        title: attributes?.title,
        unit_price: attributes?.price,
        quantity: cartQuantity,
        picture_url: attributes?.images?.data[0]?.attributes?.url,
        description: attributes?.description,
        currency_id: "ARS",
      };
    });

    console.log(itemsCart);
    let preference = {
      items: itemsCart,
      purpose: "wallet_purchase",
      back_urls: {
        success: "http://localhost:3000",
        failure: "http://localhost:3000/failure",
        pending: "http://localhost:3000/pending",
      },
      auto_return: "approved",
      notification_url: "https://www.your-site.com/ipn",
      statement_descriptor: "StripeEcommerce",
      payment_methods: {
        excluded_payment_types: [
          {
            id: "ticket",
          },
        ],
        installments: 9,
      },
      /* binary_mode: true, */
      shipments: {
        cost: 1500,
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
