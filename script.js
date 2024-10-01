// Defining main variables 
const mainClicker = document.querySelector("#buttonClicker");
const balanceText = document.querySelector("#balanceText");
const clickWorthText = document.querySelector("#clickWorthText");

// Defining shop Variables
const moreByClick = document.getElementById("moreByClickID");
const moneyAfk = document.getElementById("moneyAfkID");
const upgMoneyAfk = document.getElementById("upgMoneyAfkID");

let balance = 0; // Initial balance at the start of the session
let clicks = 0; // Initial clicks (mainly used for the Badge System)
let clicksWorth = 1; // Initial amount of clicks /per/ click
let moneyPerSecond = 0; // Initial amount earned per second
let moneyAfkPurchased = false; // Track if moneyAfk is purchased

// Shop System Class
class ShopSystem {
    constructor() {
        this.moreByClickprice = 10;
        this.moneyAfkprice = 100;
        this.upgMoneyAfkprice = 50;

        // Bind methods to the current context
        this.moreByClick_Func = this.moreByClick_Func.bind(this);
        
        // Add event listeners for buttons
        moreByClick.onclick = () => {
            this.handleMoreByClick();
        };
        
        moneyAfk.onclick = () => {
            this.handleMoneyAfk();
        };

        upgMoneyAfk.onclick = () => {
            this.handleUpgMoneyAfk();
        };
        
        // Initialize shop system state
        this.updateShopButtons();
    }

    moreByClick_Func() {
        if (balance >= this.moreByClickprice) {
            balance -= this.moreByClickprice;
            this.moreByClickprice *= 4.5;
            clicksWorth *= 2;
            clickWorthText.textContent = `1 Click = ${clicksWorth}$`;
            moreByClick.textContent = `Buy - ${this.moreByClickprice}$`;
        }
    }

    moneyAfk_Func() {
        if (balance >= this.moneyAfkprice && !moneyAfkPurchased) { // Check if not already purchased
            balance -= this.moneyAfkprice;
            moneyAfkPurchased = true; // Mark that moneyAfk has been purchased
            moneyPerSecond = 1; // Set money per second to 1
    
            // Change button text and class
            moneyAfk.textContent = `Purchased`; // Change button text to indicate purchase
            
    
            // Disable the button after purchase
            moneyAfk.disabled = true; 
            
            // Reset button text after 1 second
            setTimeout(() => {
                moneyAfk.textContent = `Purchased`; // Keep it as purchased text
                moneyAfk.className = "btn btn-light"; // Change button class to btn-info
                moneyAfkPurchased = true; // Mark that moneyAfk has been purchased
                console.log("moneyAfk purchased. Button disabled and class set to btn-info."); // Log purchase
            }, 1000);
    
            this.updateShopButtons();
        } else if (moneyAfkPurchased) {
            console.log("You have already purchased moneyAfk!");
        } else {
            console.log("Not enough balance to buy!");
        }
    }
    
    upgMoneyAfk_Func() {
        if (balance >= this.upgMoneyAfkprice) {
            balance -= this.upgMoneyAfkprice;
    
            if (moneyAfkPurchased) {
                // Update the moreByClickprice and moneyPerSecond
                this.moreByClickprice *= 4.5; // Change the price after user has bought the upgrade
                moneyPerSecond *= 2; // Double the money per second if moneyAfk is purchased
            }
    
            // Update the button text and class after purchase
            upgMoneyAfk.textContent = `Purchased`; // Change button text to indicate purchase
            upgMoneyAfk.className = "btn btn-info"; // Change button class to btn-info
    
            // Reset button text after 1 second
            setTimeout(() => {
                upgMoneyAfk.textContent = `Buy - ${this.upgMoneyAfkprice}$`; // Update button text to reflect new price
            }, 1000);
    
            // Update the price displayed on the button for the next purchase
            this.upgMoneyAfkprice *= 2; // Example: double the price for the next purchase
            
            // Update the display immediately after purchase
            this.updateShopButtons();
    
        } else {
            console.log("Not enough balance to buy!");
        }
    }
    
    handleMoreByClick() {
        if (balance >= this.moreByClickprice) {
            this.moreByClick_Func();
        } else {
            console.log("Not enough balance to buy!");
        }
        this.updateShopButtons();
    }

    handleMoneyAfk() {
        if (balance >= this.moneyAfkprice) {
            this.moneyAfk_Func();
        } else {
            console.log("Not enough balance to buy!");
        }
        this.updateShopButtons();
    }

    handleUpgMoneyAfk() {
        if (moneyAfkPurchased && balance >= this.upgMoneyAfkprice) { // Check if moneyAfk is purchased
            this.upgMoneyAfk_Func();
        } else {
            console.log("You must purchase moneyAfk first or not enough balance!");
        }
        this.updateShopButtons();
    }

    updateShopButtons() {
        // Update button class based on balance
        
        if (balance >= this.moreByClickprice) {
            moreByClick.className = "btn btn-success";
            moreByClick.disabled = false;
        } else {
            moreByClick.className = "btn btn-danger";
            moreByClick.disabled = true;
        }
        
        if (balance >= this.moneyAfkprice) {
            moneyAfk.className = "btn btn-success";
            moneyAfk.disabled = false;
        } else {
            moneyAfk.className = "btn btn-danger";
            moneyAfk.disabled = true;
        }
        
        if (moneyAfkPurchased && balance >= this.upgMoneyAfkprice) { // Only enable upgMoneyAfk if moneyAfk is purchased
            upgMoneyAfk.className = "btn btn-success";
            upgMoneyAfk.disabled = false;
        } else {
            upgMoneyAfk.className = "btn btn-danger";
            upgMoneyAfk.disabled = true;
        }
    }
}

// Create an instance of the ShopSystem
const shop = new ShopSystem();

// Function to reset mainClicker text after 3 seconds
function resetMainClickerText() {
    setTimeout(() => {
        mainClicker.textContent = "Click Me!";
    }, 3000);
}

// Function to update UI every second
function updateUI() {
    clickWorthText.textContent = `1 Click = ${clicksWorth}$`;
    balanceText.textContent = `Balance: ${balance}$`;
}

// Main Class for Clicker Functionality
class MainFunctionClicker {
    constructor() {
        mainClicker.onclick = () => {
            this.handleMainClick();
        };
    }

    handleMainClick() {
        balance += 1;
        clicks += clicksWorth;
        balanceText.textContent = `Balance: ${balance}$`;
        shop.updateShopButtons();

        // Badge System
        if (clicks === 10) {
            mainClicker.textContent = "Click me even More!";
            console.log("Badge unlocked!: You reached 10 Clicks");
            console.log("As a reward you get 15 in-game $!");
            balance += 15;
            resetMainClickerText();
        }    
        if (clicks === 100) {
            mainClicker.textContent = "You are crazy!";
            console.log("Badge unlocked!: You reached 100 Clicks");
            console.log("As a reward you get 55 in-game $!");
            balance += 55;
            resetMainClickerText();
        }  
        if (clicks === 1000) {
            mainClicker.textContent = "Like a God";
            console.log("Badge unlocked!: You reached 1000 Clicks");
            console.log("As a reward you get 150 in-game $!");
            balance += 150;
            resetMainClickerText();
        }  
        if (clicks === 10000) {
            mainClicker.textContent = "You're unstoppable!";
            console.log("Badge unlocked!: You reached 10,000 Clicks");
            console.log("As a reward you get 1500 in-game $!");
            balance += 1500;
            resetMainClickerText();
        }  
        if (clicks === 100000) {
            mainClicker.textContent = "Are you even alive?";
            console.log("Badge unlocked!: You reached 100,000 Clicks");
            console.log("As a reward you get 1500 in-game $!");
            balance += 1500;
            resetMainClickerText();
        }  
    }
}

// Create an instance of MainFunctionClicker
const mainClickerInstance = new MainFunctionClicker();

// Main Loop for earning money every second
setInterval(() => {
    if (moneyAfkPurchased) {
        balance += moneyPerSecond; // Increment balance by moneyPerSecond
    }
}, 1000); // Run every second

// Update UI every second
setInterval(() => updateUI(), 1000);
