const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

async function loginTest() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('http://localhost:3000/');

    let emailInput = await driver.findElement(By.name('email'));
    await enterText(emailInput, 'test@gmail.com', 30); 

    let passInput = await driver.findElement(By.name('pass'));
    await enterText(passInput, 'testtest',30); 

    let loginButton = await driver.findElement(By.css('#root > div > div > div > form > button'));
    await loginButton.click();
    await loginButton.click();

    const productsLink = await driver.wait(until.elementLocated(By.css('a.cursor-pointer.ms-8.hover\\:text-gray-500[href="/user/products"]')), 10000);
    await driver.wait(until.elementIsVisible(productsLink), 10000);
    await driver.wait(until.elementIsEnabled(productsLink), 10000);
    await productsLink.click();

  } finally {
    await deleteProductTest(driver);
    //await driver.quit();
  }
}

async function deleteProductTest(driver) {
  try {
    
    const deleteButton = await driver.findElement(By.css('#root > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(5) > button'));
    await deleteButton.click();

    await driver.wait(until.alertIsPresent(), 5000);
    await driver.switchTo().alert().accept();
    console.log('Product deleted successfully!');
  } catch (error) {
    console.error('Error deleting product:', error);
  }
}

async function enterText(element, text, typingSpeed) {
    for (let char of text) {
        await element.sendKeys(char);
        await new Promise(resolve => setTimeout(resolve, typingSpeed));
    }
}

loginTest();