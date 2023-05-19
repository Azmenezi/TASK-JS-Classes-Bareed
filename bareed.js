/**************************************************************
 * Point: defines a point on the map using X and Y coordinates
 *
 * x: x coordinate
 * y: y coordinate
 *
 * distanceTo(point): takes a point, calculates the distance to
 *                     that point from the current point.
 *
 * let point = new Point(x, y);
 ****************************************************************/
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distanceTo = (point) => {
    let xDelta = this.x - point.x;
    let yDelta = this.y - point.y;
    return Math.sqrt(xDelta * xDelta + yDelta * yDelta); // PYTHAGORAS!
  };

  equals = (point) => point.x === this.x && point.y === this.y;

  static randomPoint = (maxX, maxY) => {
    let x = Math.random() * (maxX || 100);
    let y = Math.random() * (maxY || 100);
    return new Point(x, y);
  };
}

// const point1 = new Point(30, 20);
let point = new Point(500, 200);

console.log(point.distanceTo({ x: 102, y: 283 }));
/**********************************************************
 * Wallet: keeps track of money
 *
 * money: how much money is in the wallet. Defaults to 0.
 *
 * credit(amount): adds `amount` to `money`.
 *
 * debit(amount): subtracts `amount` from `money`.
 *
 * let wallet = new Wallet(money);
 **********************************************************/
class Wallet {
  // implement Wallet!
  constructor(money = 0) {
    this.money = money;
  }

  credit = (amount) => (amount > 0 ? (this.money += amount) : undefined);
  debit = (amount) => (amount > 0 ? (this.money -= amount) : undefined);
}

const wallet = new Wallet(100);
wallet.credit(100);
wallet.debit(100);
console.log(wallet);
/**********************************************************
 * Person: defines a person with a name (and feelings)
 *
 * name: name of said person
 * location: a Point instance
 * wallet: a Wallet instance initially with 0.
 *
 * moveTo(point): updates the `location` to `point`
 *
 * let person = new Person(name, x, y);
 **********************************************************/
class Person {
  // implement Person!
  name = "";
  location = "";
  constructor(name, x, y) {
    this.name = name;
    this.location = new Point(x, y);
    this.wallet = new Wallet();
  }

  moveTo = (point) => (this.location = point);
}

let person = new Person("Aziz", 100, 200);
console.log(person);
person.moveTo(point);
console.log(person);
// console.log(person.location.distanceTo({ x: 102, y: 283 }));
/**********************************************************
 * Vendor: defines a vendor
 * Subclasses Person
 *
 * range: the maximum distance this vendor can travel - initially 5
 * price: the cost of a single ice cream - initially 1
 *
 * sellTo(customer, numberOfIceCreams):  sells a specific number of ice creams
 *     to the customer by doing the following:
 *         - Moves to the customer's location
 *         - Transfers money from the customer's wallet
 *           to the vendor's wallet
 *
 * new vendor = new Vendor(name, x, y);
 **********************************************************/
class Vendor extends Person {
  // implement Vendor!

  constructor(name, location, wallet, range = 5, price = 1) {
    super(name, location, wallet);
    this.range = range;
    this.price = price;
  }
  sellTo = (customer, numberOfIceCreams) => (
    this.moveTo(customer.location),
    this.wallet.credit(this.price * numberOfIceCreams),
    customer.wallet.debit(this.price * numberOfIceCreams)
  );

  // sellTo = (customer, numberOfIceCreams) => {
  //   this.moveTo(customer.location);
  //   let totalMoney = this.price * numberOfIceCreams;
  //   this.wallet.credit(totalMoney);
  //   customer.wallet.debit(totalMoney);
  // };
}
const vendor = new Vendor("Aziz", 300, 200);
// console.log(vendor);
/**********************************************************
 * Customer: defines a customer
 * Subclasses Person
 *
 * wallet: a Wallet instance initially with 10.
 *
 * _isInRange(vendor): checks if the customer is in range of vendor.
 *
 * _haveEnoughMoney(vendor, numberOfIceCreams): checks if the customer
 *     has enough money to buy a specific number of ice creams from vendor.
 *
 * requestIceCream(vendor, numberOfIceCreams): if the customer is in the vendor's
 *     range and has enough money for ice cream, a request is sent to the vendor.
 *
 * new customer = new Customer(name, x, y);
 **********************************************************/
class Customer extends Person {
  // implement Customer!
  constructor(name, location, wallet) {
    super(name, location, wallet);
  }
  _isInRange = (vendor) =>
    vendor.range > this.location.distanceTo(vendor.location) ? true : false;

  _haveEnoughMoney = (vendor, numberOfIceCreams) =>
    this.wallet.money >= vendor.price * numberOfIceCreams ? true : false;

  requestIceCream = (vendor, numberOfIceCreams) =>
    !this._isInRange(vendor)
      ? "out of range"
      : !this._haveEnoughMoney(vendor, numberOfIceCreams)
      ? "not enough money"
      : (vendor.sellTo(this, numberOfIceCreams), "Done");
}

// export { Point, Wallet, Person, Customer, Vendor };
const customer = new Customer("Turki", 300, 200);
//console.log(customer._isInRange(vendor));
customer.wallet.credit(200);

// console.log(customer);
/***********************************************************
 * If you want examples of how to use the
 * these classes and how to test your code manually,
 * check out the README.md file
 ***********************************************************/
let vendorAsis = new Vendor("Asis", 10, 10); // create a new vendor named Asis at location (10,10)
let nearbyCustomer = new Customer("MishMish", 11, 11); // create a new customer named MishMish at location (11,11)
let distantCustomer = new Customer("Hamsa", 1000, 1000); // create a new customer named Hamsa at location (1000,1000)
let brokeCustomer = new Customer("Maskeen", 12, 12); // create a new customer named Maskeen at location (12,12)
nearbyCustomer.wallet.credit(200);
brokeCustomer.wallet.money = 0; // steal all of Maskeen's money

console.log(nearbyCustomer.requestIceCream(vendorAsis, 10)); // ask to buy 10 ice creams from Asis
// money was transferred from MishMish to Asis
nearbyCustomer.wallet.money; // 0 left
vendorAsis.wallet.money; // 10
// Asis moved to MishMish's location
vendorAsis.location; // { x: 11, y: 11 }

console.log(distantCustomer.requestIceCream(vendorAsis, 10)); // ask to buy 10 ice creams from Asis
// no money was transferred because the request failed - Hamsa is too far away
distantCustomer.wallet.money; // 10 left
vendorAsis.wallet.money; // still only 10
// Asis didn't move
vendorAsis.location; // { x: 11, y: 11 }

console.log(brokeCustomer.requestIceCream(vendorAsis, 1)); // ask to buy 1 ice creams from Asis
// no money was transferred because the request failed - Maskeen doesn't have enough money to buy even one ice cream :(
brokeCustomer.wallet.money; // 0
vendorAsis.wallet.money; // still only 10
// Asis didn't move
vendorAsis.location; // { x: 11, y: 11 }
