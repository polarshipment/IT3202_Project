const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

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
    
  } finally {
    await testDashboard(driver);
    //await driver.quit();
  }
}
async function testDashboard(driver) {
  try {
    let selectElement = await driver.wait(until.elementLocated(By.css('select')), 5000);
    await selectElement.click();
  
    let options = await driver.wait(until.elementsLocated(By.tagName('option')), 5000);
    assert(options.length > 1, 'No products fetched');
    await options[1].click();

    let quantityInput = await driver.wait(until.elementLocated(By.css('#root > div > div > div > div > div.h-full.w-full.flex.justify-center.items-center > form > div:nth-child(2) > input')), 5000);
    await enterText(quantityInput, '2', 80);
  
    let submitButton = await driver.wait(until.elementLocated(By.css('#root > div > div > div > div > div.h-full.w-full.flex.justify-center.items-center > form > div:nth-child(3) > button')), 5000);
    await submitButton.click();
  

    await driver.wait(until.alertIsPresent(), 5000);
    let alert = await driver.switchTo().alert();
    let alertText = await alert.getText();
    assert.strictEqual(alertText, 'Product stock updated!');
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

loginTest();
