'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// LECTURES

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

displayMovements(account1.movements);

const calcDisplayBalance = function (movements) {
  const balance = movements.reduce((acc, mov) => (acc += mov), 0);
  labelBalance.textContent = `${balance} EUR`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);

  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (mov) {
      return (mov * acc.interestRate) / 100;
    })
    .filter(function (mov, i, arr) {
      return mov >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);

  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.usernames = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

//Accumulater -> Snowball
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);

const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);

// console.log(max);

const eurToUsd = 1.1;
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

const totalWithdrawal = movements
  .filter(function (mov) {
    return mov < 0;
  })
  .reduce(function (acc, mov) {
    return acc + mov;
  }, 0);

//Event Handlers
let currentAccount;
btnLogin.addEventListener('click', e => {
  //prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.usernames === inputLoginUsername.value
  );

  console.log(currentAccount);
  if (currentAccount?.pin == Number(inputLoginPin.value)) {
    //Display UI & Welcome Message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    //Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    containerApp.style.opacity = 100;
    //Display Movements
    displayMovements(currentAccount.movements);
    //Display Balace
    calcDisplayBalance(currentAccount.movements);
    //Display Sumarry
    calcDisplaySummary(currentAccount);
  }
});

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(firstWithdrawal);
// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// for (const [index, account] of accounts.entries()) {
//   if (account.owner === 'Jessica Davis') {
//     console.log(account);
//   }
// }
// const humanAge1 = [5, 2, 4, 1, 15, 8, 3];
// const humanAge2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHUmanAge = humanAge1.reduce((acc, mov, index, arr) => {
//   const sum = acc + mov;
//   return sum;
// }, 0);

// console.log(calcAverageHUmanAge);

// const average = (sum, arr) => {
//   const average = sum / arr.length;
//   return average;
// };

// console.log(average(calcAverageHUmanAge, humanAge1));

// const averageCalc = humanAge1
//   .map(mov => mov + 0)
//   .reduce((acc, mov, index, arr) => {
//     acc += mov;
//     return acc;
//   });
// console.log(averageCalc);
// console.log(humanAge1.length);
// const calcAverageHUmanAge = humanAge => {
//   humanAge.reduce((cur, mov, index) => {
//     console.log(index);
//     return cur + mov;
//   }, humanAge[0]);
// };

// const totalSum = calcAverageHUmanAge(humaAge1);
// console.log(totalSum);
// // const balance = movements.reduce(function (acc, cur, i, arr) {
// //   console.log(`Iteration number ${i}: ${acc}`);
// //   return acc + cur;
// // }, 0);

// const balance = movements.reduce((acc, cur) => acc + cur, 0);

// console.log(balance);
// console.log(`----------------`);
// let sum = 0;
// for (const [index, move] of movements.entries()) {
//   sum += move;
//   console.log(`Iteration number ${index}: ${sum}`);
// }
// console.log(sum);
// const deposits = movements.filter(function (move) {
//   return move > 0;
// });

// console.log(deposits);

// const depositsFor = [];
// for (const move of movements) {
//   if (move > 0) depositsFor.push(move);
// }

// console.log(depositsFor);

// const withdraws = movements.filter(move => {
//   if (move < 0) {
//     return move;
//   }
// });

// console.log(withdraws);
// Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

// Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

// 1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
// 2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
// 3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
// 4. Run the function for both test datasets

// TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]

// const dogs1 = [5, 2, 4, 1, 15, 8, 3];
// const dogs2 = [16, 6, 10, 5, 6, 1, 4];

// function calcdogs(dogAges) {
//   const calcDogToHuman = dogAges.map(age => {
//     if (age <= 2) {
//       return (age *= 2);
//     } else if (age > 2) {
//       return (age = 16 + age * 4);
//     }
//   });

//   console.log(calcDogToHuman);

//   const filterDogs = calcDogToHuman.filter(age => {
//     if (age > 18) return age;
//   });

//   console.log(filterDogs);

//   const calcAverageDog = filterDogs.reduce((acc, age) => {
//     acc += age;
//     return acc;
//   }, 0);
//   const average = calcAverageDog / filterDogs.length;

//   console.log(average);
// }
// calcdogs(dogs1);
// calcdogs(dogs2);
