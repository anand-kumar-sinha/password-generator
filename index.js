const copy = document.querySelector("[data-copy]");
const span = document.getElementById("active")
const passwordDisplay = document.querySelector("#password");
const passwordLength = document.querySelector("[data-lengthNumber]");
const passwordSlider = document.querySelector("[data-slider]");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const number = document.querySelector("#number");
const symbol = document.querySelector("#symbol");
const strength = document.querySelector(".color-round");
const generate = document.querySelector("#generate");
const symbolsString = "!@#$%&_?";
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let sliderLength = 10;
let checkCount = 1;

const handelSlider = () => {
  passwordSlider.value = sliderLength;
  passwordLength.innerText = sliderLength;
  let min = passwordSlider.min;
  let max = passwordSlider.max;
  passwordSlider.style.backgroundSize =
    ((sliderLength - min) * 100) / (max - min) + "% 100%";
};

handelSlider();

const setStrength = (color) => {
  passwordDisplay.style.color = color;
  strength.style.backgroundColor = color;
  strength.style.boxShadow = `0px 0px 12px 1px ${color}`;
};

setStrength("#fff");

const randomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const randomNumber = () => {
  return randomInteger(0, 9);
};

const randomLowercase = () => {
  return String.fromCharCode(randomInteger(97, 123));
};

const randomUppercase = () => {
  return String.fromCharCode(randomInteger(65, 91));
};

const randomSymbol = () => {
  let randomNum = randomInteger(0, symbolsString.length);
  return symbolsString.charAt(randomNum);
};

const calcStrength = () => {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;

  if (uppercase.checked) hasUpper = true;
  if (lowercase.checked) hasLower = true;
  if (number.checked) hasNumber = true;
  if (symbol.checked) hasSymbol = true;

  if (hasUpper && hasLower && (hasNumber || hasSymbol) && sliderLength >= 8) {
    setStrength("#0f0");
  } else if (
    (hasUpper || hasLower) &&
    (hasNumber || hasSymbol) &&
    sliderLength >= 6
  ) {
    setStrength("#ff0");
  } else {
    setStrength("#f00");
  }
};

const copyPassword = async () => {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    span.classList.add("active")
    span.innerHTML = 'Copied'

    setTimeout(() => {
      span.classList.remove("active")
      span.innerHTML = ''
    }, 3000);
  } catch (error) {
    alert(error);
  }
};

passwordSlider.addEventListener("input", (e) => {
  sliderLength = e.target.value;
  handelSlider();
});

copy.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyPassword();
  }
});

const shufflePassword = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  let str = "";
  array.forEach((el) => (str += el));
  return str;
};

const handleCheckBoxChange = () => {
  checkCount = 0;
  allCheckBox.forEach((checkBox) => {
    if (checkBox.checked) {
      checkCount++;
    }
  });

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handelSlider();
  }
};

allCheckBox.forEach((checkBox) => {
  checkBox.addEventListener("change", handleCheckBoxChange);
});

generate.addEventListener("click", () => {
  if (checkCount <= 0) {
    alert("Please check the options");
    return;
  }

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handelSlider();
  }

  password = "";

  let funArr = [];

  if (uppercase.checked) {
    funArr.push(randomUppercase);
  }

  if (lowercase.checked) {
    funArr.push(randomLowercase);
  }

  if (number.checked) {
    funArr.push(randomNumber);
  }

  if (symbol.checked) {
    funArr.push(randomSymbol);
  }

  for (let i = 0; i < funArr.length; i++) {
    password += funArr[i]();
  }

  for (let i = 0; i < sliderLength - funArr.length; i++) {
    password += funArr[randomInteger(0, funArr.length)]();
  }

  password = shufflePassword(Array.from(password));
  passwordDisplay.value = password;

  calcStrength();
});
