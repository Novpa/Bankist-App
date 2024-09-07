'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

/////////////////////////////////////////////////
////////////////////////////////////////////////

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
console.log(accounts);

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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => (acc += mov), 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

const calcDisplaySummary = function (movements) {
  const incomes = movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);

  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(deposit => (deposit * 1.2) / 100)
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
const updateUI = function (acc) {
  //Display Movements
  displayMovements(acc.movements);
  //Display Balace
  calcDisplayBalance(acc);
  //Display Sumarry
  calcDisplaySummary(acc.movements);
};
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
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI & Welcome Message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    //Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    containerApp.style.opacity = 100;

    //NOTE Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.usernames === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.usernames !== currentAccount.usernames
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //NOTE Update UI
    updateUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});

//NOTE Loan Request
//Only allows once the user has put deposit at least 10% of the loan request amount

btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  const checkLoan = currentAccount.movements.some(mov => mov >= amount * 0.1);
  if (checkLoan) {
    console.log(`Approved`);

    //REMARK Add movement
    currentAccount.movements.push(amount);

    //REMARK Update UI
    updateUI(currentAccount);
  }

  //REMARK Clear Input field
  inputLoanAmount.value = '';
});

//NOTE findIndex
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.usernames &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.usernames === currentAccount.usernames
    );
    console.log(index);
    //NOTE Delete Account
    accounts.splice(index, 1);

    //NOTE Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//NOTE Sort the movements
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

//
const arr = [1, 2, 3, 4, 5, 6, 7];

const x = new Array(7);
console.log(x);

//NOTE fill()
x.fill(1, 3, 5);
console.log(x);

arr.fill(23, 4, 6);
console.log(arr);

//NOTE Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

const dice = Array.from({ length: 100 }, () =>
  Math.floor(Math.random() * 6 + 1)
);

console.log(dice);

labelBalance.addEventListener('click', () => {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  // console.log(movementsUI.map(el => Number(el.textContent.replace('€', ''))));
  console.log(movementsUI);
});
