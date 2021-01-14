"use strict";

// Data
const account1 = {
  owner: "Andrei Castro",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2020-11-14T21:31:17.178Z',
    '2020-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-12-20T23:36:17.929Z',
    '2020-12-13T10:51:36.790Z'
  ],
  currency: 'EUR',
  locale: 'pt-PT' // de-DE  
};

const account2 = {
  owner: "Geralt Rivia",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z'
  ],
  currency: 'USD',
  locale: 'en-US'  
};

const account3 = {
  owner: "Isabella Roma",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Ayakaa Kmisato",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
//login
const btnLogin = document.querySelector(".btn-login");
const loginInput = document.querySelector(".usernames");
const userPin = document.querySelector(".password");
const greet = document.querySelector(".greetings");
const balanceDate = document.querySelector(".balanceDate");
const transferName = document.querySelector(`.transfer__name`);
const transferAmount = document.querySelector(`.transfer__amount`);
const transferBtn = document.querySelector(`.btn-transfer`);

// delete
const deleteName = document.querySelector(`.delete__name`);
const deletePin = document.querySelector(`.delete__pass`);
const deleteBtn = document.querySelector(`.btn-delete`);

// sort

const sortBtn = document.querySelector(`.btn-sort`);

// Loan
const loanAmount = document.querySelector(`.loan__amount`);
const loanBtn = document.querySelector(`.btn-loan`);

const logins = document.querySelector(`.login`);
const containerApp = document.querySelector(".container");
const containerMovements = document.querySelector(".movements");

const labelBalance = document.querySelector(".balance");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");







const formatMovementDate = function(date, locale){
  const dayPassed = (date1, date2) =>  
  Math.round((date2 - date1) / (1000 * 60 * 60 * 24));
  

    const days = dayPassed(new Date(), date);
    console.log(days);

    if (days === 0) return `Today`;
    

    if (days === 1) return `Yesterday`;
    


    if (days >= 7 ) return `${Math.abs(days)} days ago!`
    

    return new Intl.DateTimeFormat(locale).format(date);

}



const formatCurrency = function(value, locale, currency){
  return Intl.NumberFormat(locale, {
    style: `currency`,
    currency: currency
  }).format(value);
}




// Creat User Names
const createUsername = function(accs) {
  accs.forEach(
    (acc) =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(` `)
        .map((name) => name[0])
        .join(``))
  );
};

createUsername(accounts);

/// Display

const displayMovements = function(acc, sort = false) {
  containerMovements.innerHTML = ``;
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? `deposit` : `withdrawal`;
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formatMov = formatCurrency(mov, acc.locale, acc.currency);

    const html = `

         <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${i + 1} ${type}
          </div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formatMov}</div>
        </div>     
    `;

    containerMovements.insertAdjacentHTML(`afterbegin`, html);
  });
};

const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCurrency(acc.balance, currentAccount.locale, currentAccount.currency);
};

const calcDisplaySummary = function(acc) {
  const income = acc.movements
    .filter((cur) => cur > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCurrency(income, acc.locale, acc.currency);

  const outcome = acc.movements
    .filter((cur) => cur < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = formatCurrency(outcome, acc.locale, acc.currency);

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurrency(interest, acc.locale, acc.currency);
};

const updateUI = function(acc) {
  displayMovements(acc);

  calcDisplayBalance(acc);

  calcDisplaySummary(acc);
};

// Event Handlers

let currentAccount;

btnLogin.addEventListener(`click`, function(e) {
  e.preventDefault();

  currentAccount = accounts.find((acc) => acc.username === loginInput.value);

  console.log(currentAccount);
  if (currentAccount?.pin === Number(userPin.value)) {
    greet.textContent = `Welcome back, ${currentAccount.owner.split(` `)[0]}`;

    anime({
      targets: `.login`,
      translateY: [0, -1000],
      easing: "easeOutExpo",
      duration: 1000,
      opacity: [1, 0],
    });

    logins.style.visibility = `hidden`;

    anime({
      targets: `.container`,
      easing: "easeOutExpo",
      duration: 500,
      delay: 3500,
      opacity: [0, 1],
    });

    containerApp.style.visibility = `visible`;

    anime({
      targets: `.greetings`,
      easing: "easeOutExpo",
      duration: 3000,
      delay: 100,
      opacity: [0, 1],
      complete: function() {
        greet.style.visibility = `hidden`;
      },
    });

    greet.style.visibility = `visible`;

    // diplay the date
    const now = new Date();

    const options = {
      hour: `numeric`,
      min: `numeric`,
      day: `numeric`,
      month: `long`,
      year: `numeric`
    };

    balanceDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);
    updateUI(currentAccount);
  }
});

// TRANSFTER

transferBtn.addEventListener(`click`, function(e) {
  e.preventDefault();

  const amount = Number(transferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === transferName.value
  );

  transferAmount.value = transferName.value = ``;

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

loanBtn.addEventListener(`click`, function(e) {
  e.preventDefault();

  const loans = Number(loanAmount.value);

  if (loans > 0 && currentAccount.movements.some((mov) => mov >= loans * 0.1)) {
    currentAccount.movements.push(loans);

    updateUI(currentAccount);
  }

  loanAmount.value = ``;
});

deleteBtn.addEventListener(`click`, function(e) {
  e.preventDefault();
  if (
    deleteName.value === currentAccount.username &&
    Number(deletePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);

    accounts.splice(index, 1);

    deleteName.value = deletePin.value = ``;

    anime({
      targets: `.container`,
      easing: "easeOutExpo",
      duration: 750,
      opacity: [1, 0],
      complete: function() {
        containerApp.style.visibility = `hidden`;
      },
    });

    anime({
      targets: `.login`,
      easing: "easeOutExpo",
      duration: 2000,
      delay: 1000,
      opacity: [0, 1],
      translateY: [0, 0],
      complete: function() {
        logins.style.visibility = `visible`;
      },
    });
  }
});

let sorted = false;
sortBtn.addEventListener(`click`, function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

///////// ANIMAION

anime({
  targets: `.login`,
  translateX: [1000, 0],
  easing: "easeOutExpo",
  duration: 3000,
  opacity: [0, 1],
});

anime({
  targets: `.login__heading`,
  translateY: [-1000, 0],
  easing: "easeOutExpo",
  duration: 3000,
  delay: 1500,
  opacity: [0, 1],
});

anime({
  targets: `.usernames`,
  translateY: [-1000, 0],
  easing: "easeOutExpo",
  duration: 3000,
  delay: 1500,
  opacity: [0, 1],
});

anime({
  targets: `.password`,
  translateY: [1000, 0],
  easing: "easeOutExpo",
  duration: 3000,
  delay: 1500,
  opacity: [0, 1],
});

anime({
  targets: `.btn-login`,
  translateY: [1000, 0],
  easing: "easeOutExpo",
  duration: 3000,
  delay: 1700,
  opacity: [0, 1],
});

// Challenges

///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners
 about their dog's age, and stored the data into an array (one array for each).
 For now, they are just interested in knowing whether a dog is an adult or
 a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs!
 So create a shallow copy of Julia's array, and remove the cat ages 
 from that copied array (because it's a bad practice to mutate function parameters)

2. Create an array with both Julia's (corrected) and Kate's data

3. For each remaining dog, log to the console whether it's an adult
 ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")

4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data 
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

const juliaDog = [3, 5, 2, 12, 7];
const kateDog = [4, 1, 15, 8, 3];

juliaDog.splice(-2);

const dogs = [...juliaDog, ...kateDog];
console.log(dogs);

const checkDogs = function(arr) {
  arr.map((cur, i) => {
    const doggy =
      cur >= 3
        ? `Dog number ${i + 1} is an adult and is ${cur} years old`
        : `Dog number ${i + 1} is puppy and is ${cur} years old`;

    console.log(doggy);
  });
};

checkDogs(dogs);

console.log(`---------------------CHALLENGE 2-------------------------`);

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, 
they want to convert dog ages to human ages and calculate 
the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an 
arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula:
 if the dog is <= 2 years old, 
 humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.

2. Exclude all dogs that are less than 18 human years 
old (which is the same as keeping dogs that are at least 18 years old)

3. Calculate the average human age of all adult dogs
 (you should already know from other challenges how we calculate averages 😉)

4. Run the function for both test datasets

TEST DATA 1: 
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

const data1 = [5, 2, 4, 1, 15, 8, 3]

const calcAverageHumanAge = function(arr) {
  let humanAge = 0;
 const dogHuman =  arr.map((cur, _, arr) => {
    if (cur <= 2) {
     return (humanAge = 2 * cur);
    } else if (cur > 2) {
     return (humanAge =16 + cur * 4)  
    }
  })
  .filter(cur => cur > 18)
  .reduce((acc, cur,_,arr) => acc + cur / arr.length, 0);
  console.log(`Average ages of dogs are ${dogHuman}`);
};

calcAverageHumanAge(data1);
console.log(`---------------------CHALLENGE 4-------------------------`);

/* 
Julia and Kate are still studying dogs, and this time 
they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger 
than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is 
within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog,
 calculate the recommended food portion and add it to the object as a new property. 
 Do NOT create a new array, simply loop over the array. 
 Forumla: recommendedFood = weight ** 0.75 * 28. 
 (The result is in grams of food, and the weight needs to be in kg)

2. Find Sarah's dog and log to the console whether it's eating too much or too little. 
HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, 
and so this one is a bit tricky (on purpose) 🤓

3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') 
and an array with all owners of dogs who eat too little ('ownersEatTooLittle').

4. Log a string to the console for each array created in 3., 
like this: "Matilda and Alice and Bob's dogs eat too much!" 
and "Sarah and John and Michael's dogs eat too little!"

5. Log to the console whether there is any dog eating
EXACTLY the amount of food that is recommended (just true or false)

6. Log to the console whether there is any dog eating 
an OKAY amount of food (just true or false)

7. Create an array containing the dogs that are eating an 
OKAY amount of food (try to reuse the condition used in 6.)

8. Create a shallow copy of the dogs array and sort it by
recommended food portion in an ascending order 
(keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these 
challenges, you can use the summary lecture to choose between them 😉

HINT 2: Being within a range 10% above and below the recommended 
portion means: current > (recommended * 0.90) && current < (recommended * 1.10). 
Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:

GOOD LUCK 😀
*/

const dogsx = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

//1
dogsx.map(cur => cur.recommendedFood = (cur.weight ** 0.75) * 28);

console.log(dogsx);


//2
const sarahDog = dogsx.find(cur => cur.owners.includes(`Sarah`));
console.log(sarahDog);
if (sarahDog.curFood > sarahDog.recommendedFood) {
  console.log(`Sarah's dog is eating too much`);
}else{
  console.log(`Sarah's dog is eating not right`);
}

//3 & 4

const ownersEatTooMuch = [];
const ownersEatTooLittle = [];

dogsx.map(cur =>{
  if (cur.curFood > cur.recommendedFood) {
    ownersEatTooMuch.push(cur.owners);
  }else{
    ownersEatTooLittle.push(cur.owners);
  }
});

console.log(`${ownersEatTooMuch.flat().join(` and `)} dogs eats too much`);
console.log(`${ownersEatTooLittle.flat().join(` and `)} dogs eats too litle`);



// 5

console.log(dogsx.some(cur => cur.curFood === cur.recommendedFood));

//6 & 7

const chekcEatingOkay = dog => dog.curFood > dog.recommendedFood * 0.90 && dog.curFood < dog.recommendedFood * 1.10;

console.log(dogsx.some(dog => dog.curFood > dog.recommendedFood * 0.90 && dog.curFood < dog.recommendedFood * 1.10));

console.log(dogsx.filter(chekcEatingOkay));


//8
const [...shallowCopy] = dogsx;

console.log(dogsx);


shallowCopy.sort((a,b) => a.recommendedFood - b.recommendedFood);
console.log(shallowCopy);