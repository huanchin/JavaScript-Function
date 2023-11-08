"use strict";

/****************************** default parameters ************************************/

const bookings = [];

const createBooking = function (
  flightNum,
  numPassengers = 1,
  price = 199 * numPassengers
) {
  const booking = {
    flightNum,
    numPassengers,
    price,
  };
  console.log(booking);
  bookings.push(booking);
};

createBooking("LH123");
createBooking("LH123", 2, 800);
createBooking("LH123", 2);
createBooking("LH123", undefined, 1000);

/*************************** How passing arguments works: value vs. reference **********************/

// when we pass a reference type to a function, what is copy is a reference to the object in the memory heap

const flight = "LH234";
const jonas = {
  name: "Jonas Schmedtmann",
  passport: 24739479284,
};

const checkIn = function (flightNum, passenger) {
  flightNum = "LH999"; // a copy value
  passenger.name = "Mr. " + passenger.name; // reference

  if (passenger.passport === 24739479284) {
    alert("Checked in");
  } else {
    alert("Wrong passport!");
  }
};

checkIn(flight, jonas);
console.log(flight); // LH234
console.log(jonas); // Object { name: "Mr. Jonas Schmedtmann", passport: 24739479284 }

// Is the same as doing...
// const flightNum = flight; // primitive type: passing by value
// const passenger = jonas; // reference type: passing by reference

// different function manipulate the same object can creat issue...

const newPassport = function (person) {
  person.passport = Math.trunc(Math.random() * 100000000000);
};

newPassport(jonas);
checkIn(flight, jonas);

// clearify...
// JavaScript does not have pass by reference: (even it works like it)
// for reference type, we do in fact pass in reference (the memory address of the object).
// However, the reference itself is still a value. It's simply a value that contains a memory address.

/*********************** first-class and higher-order functions ******************/

// first-class functions:
// 1. JS treats functions as first-class citizens
// 2. This means that functions are simply values
// 3. functions are just another "type" of object
// this is why we can:
// 1. store functions in variables (ex. arrow funcition, function expression...)
// 2. store functions in properties (ex. methods of objects)
// 3. pass function as an arguments to other functions (ex. callback functions)
// 4. return functions FROM functions
// 5. call methods on functions (ex. call(), apply(), bind()...)

// higher-order functions:
// 1. a function that receives another function as an argument (ex. addEventListener)
// 2. a function that returns a new function
// 3. or both (receive and return)
// 4. this is only possible because of first-class functions

// first-class function is just a feature that a programming language either has or does not have. All it means is that all functions are values.
// There are higher-order function in practice.

// functions accepting callback functions
const oneWord = function (str) {
  return str.replaceAll(" ", "").toLowerCase();
};

const upperFirstWord = function (str) {
  const [first, ...others] = str.split(" ");
  return [first.toUpperCase(), ...others].join(" ");
};

// higher-order function
const transformer = function (str, fn) {
  console.log(`Original string: ${str}`);
  console.log(`Transformed string: ${fn(str)}`);

  console.log(`Transformed by: ${fn.name}`);
};

transformer("JavaScript is the best!", upperFirstWord);
transformer("JavaScript is the best!", oneWord);

// Original string: JavaScript is the best!
// Transformed string: JAVASCRIPT is the best!
// Transformed by: upperFirstWord
// Original string: JavaScript is the best!
// Transformed string: javascriptisthebest!
// Transformed by: oneWord

// JS uses callbacks all the time
const high5 = function () {
  console.log("👋");
};
document.body.addEventListener("click", high5);
["Jonas", "Martha", "Adam"].forEach(high5);

// In object-oriented programming, abstraction is one of three central principles (along with encapsulation and inheritance). Through the process of abstraction, a programmer hides all but the relevant data about an object in order to reduce complexity and increase efficiency.

/****************************** functions returning functions *******************************/
const greet = function (greeting) {
  return function (name) {
    console.log(`${greeting} ${name}`);
  };
};

const greeterHey = greet("Hey");
greeterHey("Jonas"); // Hey Jonas
greeterHey("Steven"); // Hey Steven

greet("Hello")("Jonas"); // Hello Jonas

// using arrow function syntax:
// const greet = (greeting) => (name) => console.log(`${greeting} ${name}`);

/******************************* the call and apply methods *******************************/
const lufthansa = {
  airline: "Lufthansa",
  iataCode: "LH",
  bookings: [],
  // book: function() {}
  book(flightNum, name) {
    console.log(
      `${name} booked a seat on ${this.airline} flight ${this.iataCode}${flightNum}`
    );
    this.bookings.push({ flight: `${this.iataCode}${flightNum}`, name });
  },
};

lufthansa.book(239, "Jonas Schmedtmann"); // Jonas Schmedtmann booked a seat on Lufthansa flight LH239
lufthansa.book(635, "John Smith"); // John Smith booked a seat on Lufthansa flight LH635
console.log(lufthansa.bookings);
// Array [ {…}, {…} ]
// 0: Object { flight: "LH239", name: "Jonas Schmedtmann" }
// 1: Object { flight: "LH635", name: "John Smith" }
// length: 2

const eurowings = {
  airline: "Eurowings",
  iataCode: "EW",
  bookings: [],
};

const book = lufthansa.book;

// Does NOT work: book is now regular function call, not a method
// book(23, "Sarah Williams"); // Error: this is not defined

// call method
book.call(eurowings, 23, "Sarah Williams"); // Sarah Williams booked a seat on Eurowings flight EW23
console.log(eurowings);

book.call(lufthansa, 239, "Mary Cooper"); // Mary Cooper booked a seat on Lufthansa flight LH239
console.log(lufthansa);

const swiss = {
  airline: "Swiss Air Lines",
  iataCode: "LX",
  bookings: [],
};

book.call(swiss, 583, "Mary Cooper"); // Mary Cooper booked a seat on Swiss Air Lines flight LX583

// apply method: not that used now in modern JS
const flightData = [583, "George Cooper"];
book.apply(swiss, flightData); // George Cooper booked a seat on Swiss Air Lines flight LX583
console.log(swiss);

// better way: use call and spread out the array
book.call(swiss, ...flightData); // George Cooper booked a seat on Swiss Air Lines flight LX583

/***************** The bind Method: explicitly define this keyword in any function we want ****************/

// Just like the call method, bind also allows us to manually set this keywords for any function call.
// The difference is that: 🔥🔥🔥🔥 bind does not immediately call the function.🔥🔥🔥 Instead it returns a new function where the this keyword is bound.
// It's set to whatever value we pass into bind
book.call(eurowings, 23, "Sarah Williams"); // Sarah Williams booked a seat on Eurowings flight EW23

const bookEW = book.bind(eurowings);
const bookLH = book.bind(lufthansa);
const bookLX = book.bind(swiss);

bookEW(23, "Steven Williams"); // Steven Williams booked a seat on Eurowings flight EW23

// partial application: a part of arguments of the original function are already applied
const bookEW23 = book.bind(eurowings, 23);
bookEW23("Jonas Schmedtmann"); // Jonas Schmedtmann booked a seat on Eurowings flight EW23
bookEW23("Martha Cooper"); // Martha Cooper booked a seat on Eurowings flight EW23

// other situation where bind method is useful: use objects together with event listener
lufthansa.planes = 300;
lufthansa.buyPlane = function () {
  // for (1): this key word is button element -> in an event handler function, this keyword always points to the element
  // for (2): this is bind to lufthansa
  console.log(this);

  this.planes++;
  console.log(this.planes);
};

// (1)
// document.querySelector(".buy").addEventListener("click", lufthansa.buyPlane);

// (2)
document
  .querySelector(".buy")
  .addEventListener("click", lufthansa.buyPlane.bind(lufthansa));

// Partial application (other usecase of bind)
const addTax = (rate, value) => value + value * rate;
console.log(addTax(0.1, 200)); // 220

const addVAT = addTax.bind(null, 0.23);
// addVAT = value => value + value * 0.23;
console.log(addVAT(100)); // 123
console.log(addVAT(23)); // 28.29

// syntax in functional programing
const addTaxRate = function (rate) {
  return function (value) {
    return value + value * rate;
  };
};
const addVAT2 = addTaxRate(0.23);
console.log(addVAT2(100));
console.log(addVAT2(23));

/************************** immediately invoked function expression (IIFE) **************************/

// Usage scenarios: Async/ Await
const runOnce = function () {
  console.log("This function can run again");
};
runOnce();

// IIFE
(function () {
  console.log("This will never run again");
  const isPrivate = 23; // this variable is encapsulated
})();
// one scope does not have access to variables from an inner scope
// console.log(isPrivate);

(() => console.log("This will ALSO never run again"))();

// encapsulation of variables
{
  const isPrivate = 23; // const has block scope
  var notPrivate = 46; // var has globel scope
}
// console.log(isPrivate); // cannot be accessed
console.log(notPrivate); // can be accessed

/************************** closures ***************************/
const secureBooking = function () {
  let passengerCount = 0;

  return function () {
    passengerCount++;
    console.log(`${passengerCount} passengers`);
  };
};

// booker function: born in the execution context of secure booking
const booker = secureBooking();

booker();
booker();
booker();

// any function always has access to the variable environment (VE) of the execution context in which the function was created
// Closure: VE attached to the function, exactly as it was at the time and place the function was created
console.dir(booker);

// more example
let f;

const g = function () {
  const a = 23;
  f = function () {
    console.log(a * 2);
  };
};

const h = function () {
  const b = 777;
  f = function () {
    console.log(b * 2);
  };
};

g(); // a = 23, f = fn...
f(); // 46
console.dir(f); // closure: a = 23

// Re-assigning f function
h(); // b = 777, f = fn2...
f(); // 777*2
console.dir(f); // closure: b = 777

// Example 2
const boardPassengers = function (n, wait) {
  const perGroup = n / 3;

  setTimeout(function () {
    console.log(`We are now boarding all ${n} passengers`);
    console.log(`There are 3 groups, each with ${perGroup} passengers`);
  }, wait * 1000);

  console.log(`Will start boarding in ${wait} seconds`);
};

const perGroup = 1000; // the closure has priority over the scope chain
boardPassengers(180, 3);

// Will start boarding in 3 seconds
// We are now boarding all 180 passengers
// There are 3 groups, each with 60 passengers

/*************************  Thinking Challenge  **************************/

/* 
This is more of a thinking challenge than a coding challenge 🤓

Take the IIFE below and at the end of the function, attach an event listener that changes the color of the selected h1 element ('header') to blue, each time the BODY element is clicked. Do NOT select the h1 element again!

And now explain to YOURSELF (or someone around you) WHY this worked! Take all the time you need. Think about WHEN exactly the callback function is executed, and what that means for the variables involved in this example.

GOOD LUCK 😀
*/

(function () {
  const header = document.querySelector("h1");
  header.style.color = "red";

  document.querySelector("body").addEventListener("click", function () {
    header.style.color = "blue";
  });
})();

/********* Coding Challenge #1 **********/
/* 
Let's build a simple poll app!

A poll has a question, an array of options from which people can choose, and an array with the number of replies for each option. This data is stored in the starter object below.

Here are your tasks:

1. Create a method called 'registerNewAnswer' on the 'poll' object. The method does 2 things:
  1.1. Display a prompt window for the user to input the number of the selected option. The prompt should look like this:
        What is your favourite programming language?
        0: JavaScript
        1: Python
        2: Rust
        3: C++
        (Write option number)
  
  1.2. Based on the input number, update the answers array. For example, if the option is 3, increase the value AT POSITION 3 of the array by 1. Make sure to check if the input is a number and if the number makes sense (e.g answer 52 wouldn't make sense, right?)
2. Call this method whenever the user clicks the "Answer poll" button.
3. Create a method 'displayResults' which displays the poll results. The method takes a string as an input (called 'type'), which can be either 'string' or 'array'. If type is 'array', simply display the results array as it is, using console.log(). This should be the default option. If type is 'string', display a string like "Poll results are 13, 2, 4, 1". 
4. Run the 'displayResults' method at the end of each 'registerNewAnswer' method call.

HINT: Use many of the tools you learned about in this and the last section 😉

BONUS: Use the 'displayResults' method to display the 2 arrays in the test data. Use both the 'array' and the 'string' option. Do NOT put the arrays in the poll object! So what shoud the this keyword look like in this situation?

BONUS TEST DATA 1: [5, 2, 3]
BONUS TEST DATA 2: [1, 5, 3, 9, 6, 1]

GOOD LUCK 😀
*/

/************* 解答 ****************/

const poll = {
  question: "What is your favourite programming language?",
  options: ["0: JavaScript", "1: Python", "2: Rust", "3: C++"],
  // This generates [0, 0, 0, 0]. More in the next section 😃
  answers: new Array(4).fill(0),
  registerNewAnswer() {
    const input = Number(
      prompt(
        "What is your favourite programming language?\n0: JavaScript\n1: Python\n2: Rust\n3: C++\n(Write option number)"
      )
    );
    this.answers[input]++;
    this.displayResults();
  },
  displayResults(type = "array") {
    if (type === "array") {
      console.log(this.answers);
    } else if (type === "string") {
      console.log(`Poll results are ${this.answers.join(", ")}`);
    }
  },
};

document
  .querySelector(".poll")
  .addEventListener("click", poll.registerNewAnswer.bind(poll));

/************* 我的寫法 ****************/

const poll = {
  question: "What is your favourite programming language?",
  options: ["0: JavaScript", "1: Python", "2: Rust", "3: C++"],
  // This generates [0, 0, 0, 0]. More in the next section 😃
  answers: new Array(4).fill(0),
  registerNewAnswer(
    input = Number(
      prompt(
        "What is your favourite programming language?\n0: JavaScript\n1: Python\n2: Rust\n3: C++\n(Write option number)"
      )
    )
  ) {
    this.answers[input]++;
    this.displayResults();
  },
  displayResults(type = "array") {
    if (type === "array") {
      console.log(this.answers);
    } else if (type === "string") {
      console.log(`Poll results are ${this.answers.join(", ")}`);
    }
  },
};

// 會跳出prompt
poll.registerNewAnswer();

/**************** 以下皆為錯誤寫法 **************/
// click 卻不會跳出 prompt： input 被 click event 取代掉了
// 把 <bind 過的 registerNewAnswer 函數> 給 listener ，等待 click event 發生的時候呼叫，並且自動將 click event object 作為 input 輸入給 <bind 過的 registerNewAnswer 函數>
// click發生的時候： 執行 <bind過的registerNewAnswer>，但 listener 自行將 event object 作為 input
document
  .querySelector(".poll")
  .addEventListener("click", poll.registerNewAnswer.bind(poll));

// 沒反應：return 一個 this 綁定 poll 的 registerNewAnswer function，但這個function沒有被call
// 把 arrow function 給 listener ，等待 click event 發生的時候呼叫 (arrow function)
// click 發生的時候： 1. bind <registerNewAnswer 函數> (綁定 this 為 poll) 2. 回傳 <bind 過的 registerNewAnswer 函數>
document
  .querySelector(".poll")
  .addEventListener("click", (e) => poll.registerNewAnswer.bind(poll));

// 會有error: 語法錯誤
document
  .querySelector(".poll")
  .addEventListener("click", (e) => poll.registerNewAnswer(e).bind(poll));

// 沒反應：return 一個 this 綁定 poll，並且 input 綁定 event object 的 registerNewAnswer function，但這個function沒有被call
// click 發生的時候：1. bind <registerNewAnswer 函數> (綁定 this 為 poll, input 為 event object) 2. 回傳 <bind 過的 registerNewAnswer 函數>
document
  .querySelector(".poll")
  .addEventListener("click", (e) => poll.registerNewAnswer.bind(poll, e));

/**************** 正解 **************/
// click 發生的時候：1. bind <registerNewAnswer 函數> (綁定 this 為 poll) 2. 回傳 <bind 過的 registerNewAnswer 函數> 3. immediately invoke <bind 過的 registerNewAnswer 函數>!!!
document
  .querySelector(".poll")
  .addEventListener("click", (e) => poll.registerNewAnswer.bind(poll)());
