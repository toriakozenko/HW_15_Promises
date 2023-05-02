// Task 'fetch basic'
// const htmlElement = document.getElementById('table-container');
// fetch('https://swapi.dev/api/people/1/')
//   .then(res => res.json())
//   .then(data => displayData(htmlElement, data))

// function displayData(dom, json) {
//   const table = document.createElement('table');
//   table.style.borderCollapse = 'collapse';
//   const header = table.createTHead();
//   const headerRow = header.insertRow();
//   for (let key in json) {
//     const cell = headerRow.insertCell();
//     cell.textContent = key;
//     cell.style.fontWeight = 'bold';
//     cell.style.padding = '5px';
//     cell.style.border = '1px solid black';
//   }
//   const body = table.createTBody();
//   const bodyRow = body.insertRow();
//   for (let key in json) {
//     const cell = bodyRow.insertCell();
//     cell.textContent = json[key];
//     cell.style.padding = '5px';
//     cell.style.border = '1px solid black';
//   }
//   dom.appendChild(table);
// }

// Task 'fetch improved'

// const htmlElement = document.getElementById('table-container');
// fetch('https://swapi.dev/api/people/1/')
//   .then(res => res.json())
//   .then(data => displayData(htmlElement, data))

// function displayData(dom, json) {
//   const table = document.createElement('table');
//   table.style.borderCollapse = 'collapse';

//   const header = table.createTHead();
//   const headerRow = header.insertRow();
//   for (let key in json) {
//     const cell = headerRow.insertCell();
//     cell.textContent = key;
//     cell.style.fontWeight = 'bold';
//     cell.style.padding = '5px';
//     cell.style.border = '1px solid black';
//   }
  
//   const body = table.createTBody();
//   const bodyRow = body.insertRow();
//   for (let key in json) {
//     const cell = bodyRow.insertCell();
//     if (typeof json[key] === 'string' && json[key].startsWith('https://swapi.dev/api/')) {
//       const button = document.createElement('button');
//       button.textContent = json[key];
//       button.addEventListener('click', () => {
//         fetch(json[key])
//           .then(res => res.json())
//           .then(data => {
//             displayData(cell, data);
//           })
//       })
//       cell.appendChild(button);
//     } else if (Array.isArray(json[key]) || typeof json[key] === 'object') {
//       const button = document.createElement('button');
//       button.textContent = 'Show ' + key;
//       button.addEventListener('click', () => {
//         displayData(cell, json[key]);
//       })
//       cell.appendChild(button);
//     } else {
//       cell.textContent = json[key];
//       cell.style.padding = '5px';
//       cell.style.border = '1px solid black';
//     }
//   }
//   dom.appendChild(table);
// }

// Task 'race'
// async function myFetch(){
//   const response = await fetch('https://swapi.dev/api/people/1/');
//   const data = await response.json();
//   return data;
// }

// const delay = ms => new Promise(ok => setTimeout(() => ok(ms), ms));

// const compare_1 = Promise.race([delay(10), myFetch()]);
// const compare_2 = Promise.race([delay(1000), myFetch()]);

// compare_1.then(res => console.log('Promise race result>>>', res));
// compare_2.then(res => console.log('Promise race result>>>', res));

// Task 'Promisify: confirm'

// function confirmPromise(text) {
//   return new Promise((resolve, reject) => {
//     const confirmed = confirm(text);
//     if (confirmed) {
//       resolve("OK");
//     } else {
//       reject("Cancel");
//     }
//   });
// }

// confirmPromise('Проміси це складно?')
//   .then(() => console.log('не так вже й складно'), () => console.log('respect за посидючість і уважність'));


// Task 'Promisify: prompt'

// function promptPromise(text){
//   return new Promise((resolve, reject) => {
//     const question = prompt(text);
//     if (question) {
//       resolve(question);
//     } else {
//       reject();
//     }
//   });
// }

// promptPromise("Як тебе звуть?")
// .then(name => console.log(`Тебе звуть ${name}`),
// () => console.log('Ну навіщо морозитися, нормально ж спілкувалися'));


// Task 'Promisify: LoginForm'

function Password(parent, open) {
  let isOpen = open;

  const input = document.createElement('input');
  input.placeholder = 'Password';
  parent.appendChild(input);

  const toggleButton = document.createElement('button');
  toggleButton.innerText = isOpen ? 'Hide' : 'Show';
  input.type = isOpen ? 'text' : 'password';
  toggleButton.type = 'button';
  parent.appendChild(toggleButton);

  function togglePasswordVisibility() {
    isOpen = !isOpen;
    input.type = isOpen ? 'text' : 'password';
    toggleButton.innerText = isOpen ? 'Hide' : 'Show';

    if (typeof this.onOpenChange === 'function') {
      this.onOpenChange(isOpen);
    }
  }

  toggleButton.addEventListener('click', togglePasswordVisibility.bind(this));

  input.addEventListener('input', () => {
    if (typeof this.onChange === 'function') {
      this.onChange(input.value);
    }
    this.setValue(input.value);
  });

  this.setValue = function(value) {
    input.value = value;
  };

  this.getValue = function() {
    return input.value;
  };

  this.setOpen = function(open) {
    if (isOpen !== open) {
      togglePasswordVisibility.call(this);
    }
  };

  this.getOpen = function() {
    return isOpen;
  };

  this.setStyle = function(style) {
    input.setAttribute('style', style);
  };
}

function LoginForm(parent) {
  return new Promise((resolve, reject) => {
    const form = document.createElement('form');

    const loginInput = document.createElement('input');
    loginInput.type = 'text';
    loginInput.placeholder = 'Login';
    form.appendChild(loginInput);

    const passwordInput = new Password(form, false);

    const button = document.createElement('button');
    button.disabled = true;
    button.innerText = 'Log In';
    button.setAttribute('style', 'display: block');
    form.appendChild(button);

    parent.appendChild(form);

    const handleButtonVisibility = () => {
      const loginValue = loginInput.value;
      const passwordValue = passwordInput.getValue();
      
      if(loginValue === '' || passwordValue === '') button.disabled = true;
    
      if(loginValue && passwordValue) button.disabled = false;
    }

    button.addEventListener('click', function(e){
      e.preventDefault();
      const login = loginInput.value;
      const password = passwordInput.getValue();
      resolve({ login, password });
      loginInput.value = '';
      passwordInput.setValue('');
      button.disabled = true;
    });

    loginInput.addEventListener('input', () => {
      handleButtonVisibility();
    });

    passwordInput.onChange = (value) => {
      handleButtonVisibility();
    };
  });
}

function loginPromise(parent) {
  return new Promise((resolve, reject) => {
    const formPromise = new LoginForm(parent);
    formPromise.then(({ login, password }) => {
      resolve({ login, password });
    }).catch((error) => {
      reject(error);
    });
  });
}

const parent = document.querySelector('#form-container');
loginPromise(parent).then(({login, password}) => console.log(`Ви ввели ${login} та ${password}`))
