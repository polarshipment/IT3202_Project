const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

//Test Case2: Update a product with an empty field
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

    console.log("Clicked on the products link successfully.");

    
  } finally {
    await updateProduct(driver);
    //await driver.quit();
  }
}

async function updateProduct(driver) {
  try {
    const updateButton = await driver.findElement(By.css('#root > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(5) > a'));
    await updateButton.click();

    console.log("Clicked the update button.");

    const productNameInput = await driver.wait(until.elementLocated(By.css('#root > div > div > div > div > form > div:nth-child(1) > input')), 10000);
    await clearAndEnterText(productNameInput, 'Updated Product2', 50);

    const productStockInput = await driver.wait(until.elementLocated(By.css('#root > div > div > div > div > form > div:nth-child(2) > input')), 10000);
    await clearAndEnterText(productStockInput, '75', 50);

    const productPriceInput = await driver.wait(until.elementLocated(By.css('#root > div > div > div > div > form > div:nth-child(3) > input')), 10000);
    await clear(productPriceInput, '60.99', 50);

    const submitButton = await driver.wait(until.elementLocated(By.css('#root > div > div > div > div > form > div:nth-child(4) > button.bg-custom-skyblue.text-white.px-10.py-2.rounded-md')), 10000);
    await submitButton.click();

    await driver.wait(until.alertIsPresent(), 10000);
    let alert = await driver.switchTo().alert();
    let alertText = await alert.getText();
    assert.strictEqual(alertText, 'Product updated successfully!');
    await alert.accept();

    console.log('Product updated successfully!');
  } catch (error) {
    console.error('Error updating product:', error);
  }
}

async function enterText(element, text, typingSpeed) {
  for (let char of text) {
    await element.sendKeys(char);
    await new Promise(resolve => setTimeout(resolve, typingSpeed));
  }
}

async function clearAndEnterText(element, text, typingSpeed) {
  await element.clear();
  await enterText(element, text, typingSpeed);
}

async function clear(element) {
  await element.clear();
}

loginTest();