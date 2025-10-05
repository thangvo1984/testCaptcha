const { launch } = require("puppeteer");
const {
  CapMonsterCloudClientFactory,
  ClientOptions,
  RecaptchaV2ProxylessRequest,
  RecaptchaV2Request,
} = require("@zennolab_com/capmonstercloud-client");

const CAPMONSTER_API_KEY = "2347d801714d55f3b30a2fa04a5fd900";
// const WEBSITE_KEY = "6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd-7SK";
// const WEBSITE_URL =
//   "https://lessons.zennolab.com/captchas/recaptcha/v2_simple.php?level=high";
const WEBSITE_KEY = "6Ld7H5QrAAAAANbaGHqHHWsuviWCLZRTTXAh-7SK";
const WEBSITE_URL = "https://bhxh.pvi.com.vn/#/login";

async function solveRecaptcha() {
  const browser = await launch({
    headless: false,
    slowMo: 10,
    defaultViewport: null,
    waitUntil: "networkidle2",

    // // TẮT HOÀN TOÀN CỜ MẶC ĐỊNH
    // ignoreDefaultArgs: true,
  });
  const page = await browser.newPage();

  // Initializing the CapMonster client
  const cmcClient = CapMonsterCloudClientFactory.Create(
    new ClientOptions({ clientKey: CAPMONSTER_API_KEY })
  );

  try {
    await page.goto(WEBSITE_URL);
    console.log("Page is open, reCAPTCHA solving...");

    // Creating a request for a reCAPTCHA solving type V2 Proxyless
    // const recaptchaV2ProxylessRequest = new RecaptchaV2ProxylessRequest({
    //   websiteURL: WEBSITE_URL,
    //   websiteKey: WEBSITE_KEY,
    // });

    // // reCAPTCHA solving using CapMonster
    // const solution = await cmcClient.Solve(recaptchaV2ProxylessRequest);
    // console.log("Solution from CapMonster:", solution);

    ///

    await new Promise((resolve) => setTimeout(resolve, 15000));

    const recaptchaV2Request = new RecaptchaV2Request({
      websiteURL: WEBSITE_URL,
      websiteKey: WEBSITE_KEY,
    });

    // // reCAPTCHA solving using CapMonster
    const solution = await cmcClient.Solve(recaptchaV2Request);
    console.log("Solution from CapMonster:", solution);

    // Retrieving a token from a solution object
    const token = solution.solution.gRecaptchaResponse;

    // Inserting the result into a form
    // await page.evaluate((result) => {
    //   document.querySelector('[name="g-recaptcha-response"]').value = result;
    //   console.log("Token is in the console:", result); // Output the token to the console
    // }, token);

    //  await page.evaluate((token) => {
    //     document.querySelector('[name="g-recaptcha-response"]').value = token;
    // }, captchaSolution);

    await page.evaluate((token) => {
      const el = document.getElementById("g-recaptcha-response");
      document.getElementById("g-recaptcha-response").innerHTML = token;
      el.dispatchEvent(new Event("change", { bubbles: true }));
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("blur", { bubbles: true })); // THÊM SỰ KIỆN NÀY
    }, token);

    console.log("The token is inserted into the form!");
    await new Promise((resolve) => setTimeout(resolve, 300));

    await page.type("input[type=text]", "15BHXH0020");
    await page.type("input[type=password]", "Jkljkl456");
    //   await delay(5000);
    await page.click("button[type=submit]");

    // await new Promise((resolve) => setTimeout(resolve, 10000));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // await browser.close();
  }
}

solveRecaptcha();
