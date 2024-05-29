const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

//Test Case1: Create a product
async function loginTest() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('http://localhost:3000/');

    let emailInput = await driver.findElement(By.name('email'));
    await enterText(emailInput, 'test@gmail.com', 30); 

    let passInput = await driver.findElement(By.name('pass'));
    await enterText(passInput, 'testtest', 30); 

    let loginButton = await driver.findElement(By.css('#root > div > div > div > form > button'));
    await loginButton.click();
    await loginButton.click();

    const productsLink = await driver.wait(until.elementLocated(By.css('a.cursor-pointer.ms-8.hover\\:text-gray-500[href="/user/products"]')), 10000);
    await driver.wait(until.elementIsVisible(productsLink), 10000);
    await driver.wait(until.elementIsEnabled(productsLink), 10000);
    await productsLink.click();

  } finally {
    await createProductTest(driver);
    //await driver.quit();
  }
}

async function createProductTest(driver) {
  try {        
    const addButton = await driver.wait(until.elementLocated(By.css('#root > div > div > div > div > a')), 10000);
    await addButton.click();

    const productNameInput = await driver.wait(until.elementLocated(By.css('#root > div > div > div > div > form > div:nth-child(1) > input')), 10000);
    await enterText(productNameInput, 'Sample Product', 50);

    const productStockInput = await driver.wait(until.elementLocated(By.css('#root > div > div > div > div > form > div:nth-child(2) > input')), 10000);
    await enterText(productStockInput, '80', 50);

    const productPriceInput = await driver.wait(until.elementLocated(By.css('#root > div > div > div > div > form > div:nth-child(3) > input')), 10000);
    await enterText(productPriceInput, '26.99', 50);

    const createButton = await driver.wait(until.elementLocated(By.css('#root > div > div > div > div > form > div:nth-child(4) > button.bg-custom-skyblue.text-white.px-10.py-2.rounded-md')), 10000);
    await createButton.click();

    await driver.wait(until.alertIsPresent(), 10000);
    let alert = await driver.switchTo().alert();
    let alertText = await alert.getText();
    assert.strictEqual(alertText, 'Product added successfully!');
    await alert.accept();

    await driver.wait(until.titleContains('Products'), 10000);

    console.log('Product added successfully!');
  } catch (error) {
    console.error('Error adding product:', error);
  }
}

async function enterText(element, text, typingSpeed) {
  for (let char of text) {
    await element.sendKeys(char);
    await new Promise(resolve => setTimeout(resolve, typingSpeed));
  }
}

loginTest();