const express = require("express");
const request = require("request");
const router = express.Router();
const { authorize } = require("../../middlewares/authorization");
const {
  CartItem,
  validateCartItem,
  validateBundleItem,
  makeCartItem,
} = require("../../models/CartItem");
const { SubscriptionPlan } = require("../../models/SubscriptionPlan");
const { Course } = require("../../models/Course");
const { Chapter } = require("../../models/Chapter");
const { Cart } = require("../../models/Cart");
const { Coupon } = require("../../models/Coupon");
const { MyCourse } = require("../../models/MyCourse");
const { BankAlfalahSession } = require("../../models/BankAlfalahSession");
const { XeroResetToken } = require("../../models/XeroResetToken");
const { getAllParentCategories } = require("../../models/Category");
const config = require("config");
const {
  Checkout,
  CHECKOUT_METHODS,
  validateCashCollectionCheckout,
} = require("../../models/Checkout");
const Safepay = require("safepay");
const moment = require("moment");
const _ = require("lodash");
const { userRoles } = require("../../models/User");
const { validateObjectId } = require("../../helpers/validation");
const { ADMIN } = userRoles;
const axios = require("axios");
const {
  Account,
  Accounts,
  AccountType,
  Allocation,
  Allocations,
  BankTransaction,
  BankTransactions,
  BankTransfer,
  BankTransfers,
  BatchPayment,
  BatchPayments,
  Contact,
  ContactGroup,
  ContactGroups,
  ContactPerson,
  Contacts,
  Currency,
  CurrencyCode,
  Employees,
  HistoryRecords,
  Invoice,
  Invoices,
  Item,
  Items,
  LineAmountTypes,
  LineItem,
  LinkedTransaction,
  LinkedTransactions,
  ManualJournal,
  ManualJournals,
  Payment,
  Payments,
  PaymentServices,
  Prepayment,
  PurchaseOrder,
  PurchaseOrders,
  Quote,
  Quotes,
  Receipt,
  Receipts,
  TaxRate,
  TaxRates,
  TaxType,
  TrackingCategories,
  TrackingCategory,
  TrackingOption,
  XeroAccessToken,
  XeroClient,
  XeroIdToken,
  CreditNotes,
  CreditNote,
  Employee,
} = require("xero-node");

const {
  sendOrderPlacingEmail,
  sendOrderCompletionEmail,
  sendOrderAdminNotificationEmail,
} = require("../../services/mailer");

const xero_client_id = "CAB50E194DC246E6B65AAB18776085D0";
const xero_client_secret = "J20jJay-R0xwaiWcJNdVOtE2u6533XQkpwbUPR4EiDwZO_EA";

const xero_scopes =
  "openid profile email accounting.transactions accounting.settings offline_access";
const xero_refresh_token =
  "b446e272cfe40a3e8ece944336b7d7c0ed9fdff7e93684d00782e4d12accff89";
const { v4: uuidv4 } = require("uuid");

const xero = new XeroClient({
  clientId: xero_client_id,
  clientSecret: xero_client_secret,
  redirectUris: [],
  scopes: xero_scopes.split(" "),
  state: "imaParam=look-at-me-go",
  httpTimeout: 2000,
});

/////////////////////////////////
/*            BYKEYA           */
/////////////////////////////////

const BYKEYA_BASE_URL = "https://raptor.bykea.net/v2/";
const BYKEYA_USER_NAME = "923076882527";
const BYKEYA_PASSWORD = "@et,CL~4LM";

/////////////////////////////////
/*            BYKEYA           */
/////////////////////////////////

/////////////////////////////////
/*         BANK ALFALAH        */
/////////////////////////////////

const BANK_ALFALAH_API_BASE_URL =
  "https://bankalfalah.gateway.mastercard.com/api/rest/version/56/";
const BANK_ALFALAH_MERCHENT_ID = "OUTCLASSLEAR";
const BANK_ALFALAH_OPERATOR_ID = "OUTCLASSLEAR1";
const BANK_ALFALAH_PASSWORD = "abcd*12345";
const BANK_ALFALAH_API_PASSWORD = "2bf23346e516c5ad8eea8fac4b02e45c";

/////////////////////////////////
/*         BANK ALFALAH        */
/////////////////////////////////

router.get("/xero", async (req, res) => {
  await makeXeroInvoice({ unitAmount: 500 });

  res.sendApiResponse({ message: "abc" });
});

router.post("/add_subscription_bundle", authorize(), async (req, res) => {
  const { value, error } = validateBundleItem(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const { user } = req.authSession;

  const cartItem = await new CartItem({
    user: user._id,
    ...value,
    itemType: "BUNDLE",
  }).save();

  res.sendApiResponse({ data: await makeCartItem(cartItem) });
});

router.post("/add_item", authorize(), async (req, res) => {
  const { value, error } = validateCartItem(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const { user } = req.authSession;

  const prevQuery = {
    user: user._id,
    course: value.course,
  };
  let cartItem = await CartItem.findOne(prevQuery);
  if (cartItem) {
    const previousChaps = cartItem.chapters || [];
    if (!previousChaps.includes(value.chapters[0])) {
      previousChaps.push(value.chapters[0]);
      // If Prevous Available then Upating that one
      for (let key in value) cartItem[key] = value[key];
      cartItem.chapters = previousChaps;
      await cartItem.save();
    }
  } else {
    //Adding New Item To Cart
    cartItem = await new CartItem({
      user: user._id,
      ...value,
    }).save();
  }
  res.sendApiResponse({ data: await makeCartItem(cartItem) });
});

//bykeya
router.post(
  "/checkout/initiate_cash_collection/:orderId",
  authorize(ADMIN),
  async (req, res) => {
    const { orderId } = req.params;

    const order = await Checkout.findById(orderId);
    if (!order)
      return res.sendApiResponse({ status: 400, message: "Invalid order Id" });

    const googleLocationAPI = await axios.get(
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
      {
        params: {
          key: "AIzaSyAXcXxxX-SIIfacX23BYLbIjM4j7Yh6APY",
          fields: "photos,formatted_address,name,rating,opening_hours,geometry",
          inputtype: "textquery",
          input: "johar town lahore zeikh",
        },
      }
    );

    if (!googleLocationAPI.data.candidates[0])
      return res.sendApiResponse({
        status: 400,
        message: "Could not find latitude and longitude of the given address",
      });
    const { geometry } = googleLocationAPI.data.candidates[0];

    const authenticateBykeya = await axios.post(
      BYKEYA_BASE_URL + "authenticate/customer",
      {
        username: BYKEYA_USER_NAME,
        password: BYKEYA_PASSWORD,
      }
    );

    console.log("BYKEYA TOKEN =>", authenticateBykeya.data.data.token);

    const bykeyaBooking = await axios.post(
      "https://api.bykea.net/api/v2/bookings",
      {
        meta: {
          service_code: "29",
        },
        customer: {
          phone: order.cashCollectionDetail.phone.replace("+", ""),
        },
        pickup: {
          lat: geometry.location.lat,
          lng: geometry.location.lng,
          phone: order.cashCollectionDetail.phone.replace("+", ""),
          address: order.cashCollectionDetail.address,
          gps_address: order.cashCollectionDetail.address,
          name:
            order.cashCollectionDetail.firstName +
            " " +
            order.cashCollectionDetail.lastName,
        },
        details: {
          iban: "PK55MEZN0099380101916915",
          amount: order.amountPayed,
        },
      },
      {
        headers: {
          "x-api-customer-token": authenticateBykeya.data.data.token,
        },
      }
    );

    //saving order record
    order.cashCollectionInitiated = true;
    order.cashCollectionDetail.bykeyaBookingId =
      bykeyaBooking.data.data.booking_id;

    order.cashCollectionDetail.bykeyaBookingNo =
      bykeyaBooking.data.data.booking_no;

    await order.save();

    res.sendApiResponse({ data: order });
  }
);

router.post("/checkout/cash_collection", authorize(), async (req, res) => {
  const { value, error } = validateCashCollectionCheckout(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const { user } = req.authSession;
  let cart = await Cart.findOne({ user: user._id });
  if (!cart)
    return res.sendApiResponse({ status: 400, message: "Invalid Checkout." });

  const cartItems = await CartItem.find({ user: user._id });

  const items = [];

  for (let i = 0; i < cartItems.length; ++i) {
    if (cartItems[i]) {
      const citem = await makeCartItem(cartItems[i]);

      items.push(citem);
    }
  }

  const checkoutData = {
    user: user._id,
    method: CHECKOUT_METHODS.CASH_COLLECTION,
    cashCollectionDetail: value,
    items: cartItems,
    totalAmount: cart.totalAmount,
    createdAt: new Date(),
    amountPayed: cart.price,
    checkoutCompleted: false,
    paymentDone: false,
    courseEnroled: false,
  };

  if (cart.coupon) checkoutData.couponApplied = cart.coupon;

  const checkout = await new Checkout(checkoutData).save();

  // enroll user to courses
  // for (let i = 0; i < cartItems.length; ++i) {
  //   if (cartItems[i]) {
  //     const { course, completeCourse, chapters } = cartItems[i];
  //     await new MyCourse({
  //       user: user._id,
  //       course,
  //       completeCourse,
  //       chapters: chapters.map((c) => c._id),
  //     }).save();
  //   }
  // }

  //cleanup
  await CartItem.deleteMany({ user: user._id });
  await Cart.findOneAndDelete({ user: user._id });
  const { base_url } = req;
  sendOrderPlacingEmail({
    to: user.email,
    orderId: checkout._id,
    logoImage: base_url + "/images/logo.png",
  });
  sendOrderAdminNotificationEmail({
    userName: `${user.firstName} ${user.lastName}`,
    orderId: checkout._id,
    logoImage: base_url + "/images/logo.png",
  });
  res.sendApiResponse({ data: checkout });
});

router.post(
  "/checkout/complete_cash_collection/:id",
  authorize(ADMIN),
  async (req, res) => {
    const { id } = req.params;
    if (!validateObjectId(id))
      return res.sendApiResponse({ status: 400, message: "Invalid Item Id" });

    const checkout = await Checkout.findById(id).populate("user");
    if (!checkout)
      return res.sendApiResponse({ status: 400, message: "Invalid Order" });

    // enroll user to courses
    await completeCheckoutEnrollment(checkout);

    checkout.paymentDone = true;
    checkout.checkoutCompleted = true;
    checkout.courseEnroled = true;
    await checkout.save();

    const { base_url } = req;
    sendOrderCompletionEmail({
      to: checkout.user.email,
      orderId: checkout._id,
      logoImage: base_url + "/images/logo.png",
    });

    await makeXeroInvoice({ unitAmount: checkout.amountPayed });
    res.sendApiResponse({ message: "enrolled" });
  }
);

/////BANK ALFALAH ////

router.post("/create_bank_alfalah_session", authorize(), async (req, res) => {
  const { user } = req.authSession;
  let orderId = uuidv4();
  orderId = orderId.replace("-", "");
  orderId = orderId.replace("-", "");
  orderId = orderId.replace("-", "");
  orderId = orderId.replace("-", "");
  orderId = orderId.replace("-", "");

  const CREATE_SESSION_URL = `${BANK_ALFALAH_API_BASE_URL}merchant/${BANK_ALFALAH_MERCHENT_ID}/session`;

  var requestData = {
    apiOperation: "CREATE_CHECKOUT_SESSION",
    interaction: {
      operation: "PURCHASE",
      // cancelUrl: "https://www.out-class.org/",
      // returnUrl: "https://www.out-class.org/cart/",
      // merchant: {
      //   name: "OUTCLASS",
      //   address: {
      //     line1: "200 Sample St",
      //     line2: "1234 Example Town",
      //   },
      // },
    },
    order: {
      id: orderId,
      currency: "PKR",
    },
  };

  const options = {
    url: CREATE_SESSION_URL,
    json: requestData,
    auth: {
      user: "merchant." + BANK_ALFALAH_MERCHENT_ID,
      pass: BANK_ALFALAH_API_PASSWORD,
    },
  };

  request.post(options, async function (error, response, body) {
    if (error) {
      return res.sendApiResponse({ status: 400, message: error.message });
    }

    const bankAlfalahSession = await new BankAlfalahSession({
      user: user._id,
      sessionId: response.body.session.id,
      orderId: orderId,
      successIndicator: response.body.successIndicator,
    }).save();

    res.sendApiResponse({
      data: {
        sessionId: response.body.session.id,
        orderId: orderId,
        sessionVersion: response.body.session.version,
      },
    });
  });
});

router.get("/bank_alfalah_payment/", async (req, res) => {
  const { resultIndicator } = req.query;

  const bankAlfalahSession = await BankAlfalahSession.findOne({
    successIndicator: resultIndicator,
  }).populate("user");

  if (!bankAlfalahSession) return res.redirect("/");

  const { user } = bankAlfalahSession;

  let cart = await Cart.findOne({ user: user._id });
  if (!cart)
    return res.sendApiResponse({ status: 400, message: "Invalid Checkout." });

  let cartItems = await CartItem.find({ user: user._id });

  const items = [];

  for (let i = 0; i < cartItems.length; ++i) {
    if (cartItems[i]) {
      const citem = await makeCartItem(cartItems[i]);

      items.push(citem);
    }
  }

  const checkoutData = {
    user: user._id,
    method: CHECKOUT_METHODS.BANK_ALFALAH,
    bankAlfalahDetails: {
      orderId: bankAlfalahSession.orderId,
    },
    items: cartItems,
    totalAmount: cart.totalAmount,
    createdAt: new Date(),
    amountPayed: cart.price,
    checkoutCompleted: true,
    paymentDone: true,
    courseEnroled: true,
  };

  if (cart.coupon) checkoutData.couponApplied = cart.coupon;

  const checkout = await new Checkout(checkoutData).save();

  // enroll user to courses
  await completeCheckoutEnrollment(checkout);

  checkout.paymentDone = true;
  checkout.checkoutCompleted = true;
  checkout.courseEnroled = true;
  await checkout.save();
  await BankAlfalahSession.findByIdAndDelete(bankAlfalahSession._id);
  await CartItem.deleteMany({ user: user._id });
  await Cart.findOneAndDelete({ user: user._id });
  const { base_url } = req;
  sendOrderCompletionEmail({
    to: checkout.user.email,
    orderId: checkout._id,
    logoImage: base_url + "/images/logo.png",
  });

  sendOrderAdminNotificationEmail({
    userName: `${user.firstName} ${user.lastName}`,
    orderId: checkout._id,
    logoImage: base_url + "/images/logo.png",
  });
  await makeXeroInvoice({ unitAmount: cart.price });
  res.redirect("/dashboard/courses");
});

/////BANK ALFALAH ////

/////////// PAY PRO ////////

router.post("/checkout/pay_pro", authorize(), async (req, res) => {
  const { user } = req.authSession;
  let cart = await Cart.findOne({ user: user._id });
  if (!cart)
    return res.sendApiResponse({ status: 400, message: "Invalid Checkout." });

  const cartItems = await CartItem.find({ user: user._id });

  const items = [];

  for (let i = 0; i < cartItems.length; ++i) {
    if (cartItems[i]) {
      const citem = await makeCartItem(cartItems[i]);
      items.push(citem);
    }
  }

  const checkoutData = {
    user: user._id,
    method: CHECKOUT_METHODS.PAYPRO,

    items: cartItems,
    totalAmount: cart.totalAmount,
    createdAt: new Date(),
    amountPayed: cart.price,
    checkoutCompleted: false,
    paymentDone: false,
    courseEnroled: false,
  };

  if (cart.coupon) checkoutData.couponApplied = cart.coupon;

  const checkout = await new Checkout(checkoutData).save();

  // https://demoapi.paypro.com.pk/cpay/co?oJson=[{
  //   "MerchantId": "Outclass",
  //   "MerchantPassword": "Staging@0712"
  // }, {
  //   "OrderNumber": "845abc",
  //   "OrderAmount": "3000",
  //   "OrderDueDate": "21\/12\/2020",
  //   "OrderType": "Service",
  //   "IssueDate": "14\/10\/2020",
  //   "OrderExpireAfterSeconds": "0",
  //   "CustomerName": "Tariq",
  //   "CustomerMobile": "03116654646",
  //   "CustomerEmail": "email@email.com",
  //   "CustomerAddress": "Address"
  // }]

  const currentDate = moment();
  const createPayProOrder = await axios.post(
    "https://api.paypro.com.pk/cpay/co",
    {},
    {
      params: {
        oJson: JSON.stringify([
          {
            MerchantId: "Outclass",
            MerchantPassword: "Live@2021",
          },
          {
            OrderNumber: checkout._id,
            OrderAmount: cart.price,
            OrderDueDate: currentDate.add("days", 7).format("DD/MM/YYYY"),
            OrderType: "Service",
            IssueDate: currentDate.format("DD/MM/YYYY"),
            OrderExpireAfterSeconds: "604800",
            CustomerName: req.body.name,
            CustomerMobile: req.body.phone.replace("+92", "0"),
            CustomerEmail: req.body.email,
            CustomerAddress: req.body.address,
          },
        ]),
      },
    }
  );
  res.sendApiResponse({ message: "Order Placed" });
  checkout.payproDetails = createPayProOrder.data[1];
  checkout.payproPaymentDetails = req.body;
  await checkout.save();

  await CartItem.deleteMany({ user: user._id });
  await Cart.findOneAndDelete({ user: user._id });

  const { base_url } = req;
  sendOrderPlacingEmail({
    to: user.email,
    orderId: checkout._id,
    logoImage: base_url + "/images/logo.png",
  });
  sendOrderAdminNotificationEmail({
    userName: `${user.firstName} ${user.lastName}`,
    orderId: checkout._id,
    logoImage: base_url + "/images/logo.png",
  });
});

/////////// PAY PRO/////////
router.get("/", authorize(), async (req, res) => {
  const { user } = req.authSession;

  let { couponCode = "", removeCoupon = "0" } = req.query;
  couponCode = couponCode.trim();
  let cart = await Cart.findOne({ user: user._id });
  if (!cart) cart = await new Cart({ user: user._id }).save();

  if (removeCoupon == 1) {
    cart.coupon = "";
  }
  const couponQuery = {
    code: couponCode || cart.coupon,
    isDeleted: false,
    validTill: { $lt: Date.now() },
  };

  let coupon;
  if (couponCode || cart.coupon) {
    coupon = await Coupon.findOne(couponQuery);

    if (!coupon && couponQuery.code === couponCode) {
      return res.sendApiResponse({
        status: 400,
        message: "Invalid coupon code.",
      });
    }
  }

  const cartItems = await CartItem.find({ user: user._id });

  //populateItem
  let couponUsable = false;
  const items = [];
  let couponPrice = 0;
  let withoutCouponPrice = 0;
  let couponApplicable = false;

  if (coupon && (await isCouponUsable(coupon, user))) {
    couponUsable = true;
  }

  for (let i = 0; i < cartItems.length; ++i) {
    if (cartItems[i]) {
      const cItem = await makeCartItem(cartItems[i], coupon);
      items.push(cItem);

      if (coupon && couponUsable && (await isCouponApplicable(cItem, coupon))) {
        couponPrice += cItem.price;
        couponApplicable = true;
      } else {
        withoutCouponPrice += cItem.price;
      }
    }
  }

  const totalAmount = withoutCouponPrice + couponPrice;
  cart.totalAmount = totalAmount;
  if (coupon && couponUsable && couponApplicable) {
    couponPrice = applyCouponDiscount(couponPrice, coupon);
    cart.coupon = coupon.code;
  }

  const data = _.pick(cart, ["user", "coupon", "createdAt"]);
  data.items = items;
  data.price = couponPrice + withoutCouponPrice;
  data.totalAmount = totalAmount;
  cart.price = data.price;
  await cart.save();
  res.sendApiResponse({ data });
});

router.delete("/:id", authorize(), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Item Id" });

  const { user } = req.authSession;
  const item = await CartItem.findOneAndDelete({ _id: id, user: user._id });

  if (!item)
    res.sendApiResponse({ status: 404, message: "Cart Item already deleted" });

  res.sendApiResponse({ data: item });
});

async function isCouponUsable(coupon, user) {
  if (!coupon.isActive) return false;

  const currentDateTime = parseInt(moment().format("X"));

  const validTill = parseInt(coupon.validTill);

  if (validTill <= currentDateTime) return false;

  if (coupon.referalEmails && !coupon.referalEmails.includes(user.email))
    return false;
  switch (coupon.reusability) {
    case "overall":
      const overallUsage = await Checkout.find({ couponApplied: coupon.code });

      if (overallUsage.length >= coupon.reusabilityCount) return false;
      break;

    case "per_user":
      const perUserUsage = await Checkout.find({
        couponApplied: coupon.code,
        user: user._id,
      });

      if (perUserUsage.length >= coupon.reusabilityCount) return false;
      break;
  }
  return true;
}

async function isCouponApplicable(item, coupon) {
  if (coupon.applicableTo === "courses") {
    const courseId = item.course._id;
    return coupon.courses.includes(courseId);
  } else if (coupon.applicableTo === "categories") {
    let courseCategory =
      item.itemType === "BUNDLE"
        ? item.courses[0].category._id
        : item.course.category._id;
    const parentCategories = await getAllParentCategories(courseCategory);

    let applicable = false;
    for (let i = 0; i < parentCategories.length; ++i) {
      if (
        parentCategories[0] &&
        coupon.categories.includes(parentCategories[0]._id)
      ) {
        applicable = true;
        break;
      }
    }
    return applicable;
  }

  return false;
}

function applyCouponDiscount(price, coupon) {
  if (coupon.discountType === "percentage") {
    const discount = (price / 100) * coupon.discount;
    return price - discount;
  } else if (coupon.discountType === "flat") {
    return price <= coupon.discount ? 0 : price - coupon.discount;
  }
  return price;
}
module.exports = router;

const makeXeroInvoice = async ({ unitAmount }) => {
  try {
    let xeroTokenData = await XeroResetToken.findOne();
    if (!xeroTokenData)
      xeroTokenData = await new XeroResetToken({
        token: xero_refresh_token,
      }).save();

    const newXeroClient = new XeroClient();

    const newTokenSet = await newXeroClient.refreshWithRefreshToken(
      xero_client_id,
      xero_client_secret,
      xeroTokenData.token
    );

    xeroTokenData.token = newTokenSet.refresh_token;
    await xeroTokenData.save();

    const invoice1 = {
      type: Invoice.TypeEnum.ACCREC,
      contact: {
        contactID: "c63dfb0a-a85f-47f9-b82e-f86a30b4d184",
      },
      date: new Date(),
      dueDate: new Date(), //"2009-06-06T00:00:00",
      lineAmountTypes: LineAmountTypes.Inclusive,
      lineItems: [
        {
          description: "",
          taxType: "OUTPUT",
          quantity: 1,
          unitAmount,
          accountCode: "200",
        },
      ],

      status: Invoice.StatusEnum.AUTHORISED,
    };

    const newInvoices = new Invoices();
    newInvoices.invoices = [invoice1];

    const teanetId = "0556432b-e26c-4706-b604-f6624ef1a6a8";

    const createdInvoice = await newXeroClient.accountingApi.createInvoices(
      teanetId,
      newInvoices
    );
    const invoice = createdInvoice.body.invoices[0];
    res.sendApiResponse({
      data: {
        invoice,
        createdInvoice,
      },
    });
  } catch (err) {
    // console.log("Xero Error", err);
  }
};

const completeCheckoutEnrollment = async (checkout) => {
  const cartItems = [];

  //make a linear array by unpacking the bundles
  for (let i = 0; i < checkout.items.length; ++i) {
    const item = checkout.items[i];
    if (item) {
      if (item.itemType === "BUNDLE") {
        //do stuff
        for (let j = 0; j < item.courses.length; ++j) {
          const c = item.courses[j];
          if (!c) continue;

          const chapters = await Chapter.find({ course: c });
          const unpackedItem = {
            ...item,
            completeCourse: true,
            course: c,
            chapters: chapters.map((chap) => chap._id),
          };
          delete unpackedItem.courses;

          cartItems.push(unpackedItem);
        }
      } else {
        cartItems.push(item);
      }
    }
  }

  //enroll the user
  cartItems.forEach(async (cartItem, index) => {
    await enrollToCourse(cartItem, checkout.user);
  });

  let expiryNotificationDate;
  if (cartItems[0] && cartItems[0].itemType === "BUNDLE") {
    expiryNotificationDate = parseInt(
      moment().add(cartItems[0].numberOfDays, "days").format("X")
    );
  } else {
    expiryNotificationDate = parseInt(moment().add(1, "years").format("X"));
  }
  checkout.expiryNotificationDate = expiryNotificationDate;
  await checkout.save();
};

const enrollToCourse = async (cartItem, userId) => {
  const { course, completeCourse, chapters, itemType, numberOfDays } = cartItem;

  const alreadyEnrolled = await MyCourse.findOne({
    user: userId,
    course,
  });

  if (itemType === "BUNDLE") {
    let startDate = parseInt(moment().format("X"));
    let endDate = parseInt(moment().add(numberOfDays, "days").format("X"));

    const chapterEnrollments = chapters.map((chapter) => {
      return {
        chapter,
        startDate,
        endDate,
      };
    });

    if (alreadyEnrolled) {
      endDate =
        alreadyEnrolled.endDate && alreadyEnrolled.endDate > startDate
          ? parseInt(
              moment(alreadyEnrolled.endDate, "X")
                .add(daysToAdd, "days")
                .format("X")
            )
          : endDate;

      alreadyEnrolled.chapters = chapters;
      alreadyEnrolled.chapterEnrollments = chapterEnrollments;
      alreadyEnrolled.endDate = endDate;
      alreadyEnrolled.completeCourse = true;

      await alreadyEnrolled.save();
    } else {
      await new MyCourse({
        user: userId,
        course,
        completeCourse,
        chapters,
        chapterEnrollments,
        startDate,
        endDate,
      }).save();
      //updating course buyCount
      await Course.findByIdAndUpdate(course, { $inc: { buyCount: 1 } });
    }

    //
  } else {
    const startDate = parseInt(moment().format("X"));
    const endDate = parseInt(moment().add(1, "year").format("X"));

    if (alreadyEnrolled) {
      const prevEnrollments = alreadyEnrolled.chapterEnrollments;
      const chapterEnrollments = chapters.map((chapter) => {
        return {
          chapter,
          startDate,
          endDate,
        };
      });
      alreadyEnrolled.chapters = [...alreadyEnrolled.chapters, ...chapters];
      alreadyEnrolled.chapterEnrollments = [
        ...prevEnrollments,
        ...chapterEnrollments,
      ];
      alreadyEnrolled.endDate = endDate;
      await alreadyEnrolled.save();
    } else {
      const chapterEnrollments = chapters.map((chapter) => {
        return {
          chapter,
          startDate,
          endDate,
        };
      });
      await new MyCourse({
        user: userId,
        course,
        completeCourse,
        chapters,
        chapterEnrollments,
        startDate,
        endDate,
      }).save();
      //updating course buyCount
      await Course.findByIdAndUpdate(course, { $inc: { buyCount: 1 } });
    }
  }
};
