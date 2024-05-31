const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

async function loginTest() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('http://localhost:3000/');

    let emailInput = await driver.findElement(By.name('email'));
    await emailInput.sendKeys('test@gmail.com');

    let passInput = await driver.findElement(By.name('pass'));
    await passInput.sendKeys('testtest');

    let loginButton = await driver.findElement(By.css('#root > div > div > div > form > button'));
    await loginButton.click();
    await loginButton.click();

    await driver.wait(until.titleIs('Dashboard'), 5000); 

    console.log('Login successful');
  } catch (error) {
    console.error('Error logging in:', error);
  } finally {
    //await driver.quit();
  }
}

loginTest();
