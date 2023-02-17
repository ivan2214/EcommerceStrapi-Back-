"use strict";

/**
 * product controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: process.env.ACCES_TOKEN,
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
        description:
          attributes?.description.length > 100
            ? attributes?.description.slice(0, 150)
            : attributes?.description,
        currency_id: "ARS",
      };
    });

    let preference = {
      items: itemsCart,
      purpose: "wallet_purchase",
      back_urls: {
        success: "https://ecommerce-front-mu.vercel.app/products",
        failure: "https://ecommerce-front-mu.vercel.app/failure",
        pending: "https://ecommerce-front-mu.vercel.app/pending",
      },
      notification_url: "https://ecommerce-front-mu.vercel.app",
      statement_descriptor: "StripeEcommerce",
      payment_methods: {
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
      axi
      console.log(responde);
      ctx.send(responde);
    } catch (error) {
      console.log(error.message);
    }
  },
}));
