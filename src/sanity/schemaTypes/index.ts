import { type SchemaTypeDefinition } from "sanity";
import { product } from "./schemas/product";
import { productCategory } from "./schemas/product-category";
import { promotionCode } from "./schemas/promotion-codes";
import { promotionCampaign } from "./schemas/promotion-campaign";
import { order, orderItem, shippingAddress } from "./schemas/order";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    productCategory,
    product,

    promotionCode,
    promotionCampaign,

    shippingAddress,
    orderItem,
    order,
  ],
};
