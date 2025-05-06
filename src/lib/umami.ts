import umami from "@umami/node";

umami.init({
  websiteId: "1ba6356b-607a-4f5a-9234-99930847e7b6", // Your website id
  hostUrl: "https://cloud.umami.is/", // URL to your Umami instance
});

export const umamiTrackCheckoutSuccessEvent = async (payload: {
  [key: string]: string | number | Date;
}) => {
  await umami.track("checkout_success", payload);
};
