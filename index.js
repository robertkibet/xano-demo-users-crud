// Import stylesheets
import './style.css';

const usersWrapper = document.querySelector('#users-list');
const addUserButton = document.querySelector('#add-user');
const loader = document.querySelector('#loader');
const refresh = document.querySelector('#refresh');

/**
 * Fetches users list from Xano DB
 */
const getUsers = async () => {
  try {
    loader.style.display = 'block';

    // clear existing list
    usersWrapper.innerHTML = '';

    // get all users from Xano
    const response = await fetch(
      'https://x8ki-letl-twmt.n7.xano.io/api:44ariOEP/users_demo_crud'
    );

    const users = await response.json();

    // if users exists
    if (users.length > 0) {
      // create link tag

      users.forEach((user) => {
        const list = document.createElement('li');

        if (user.fullName) {
          // insert user name to the list element
          list.textContent = user.fullName;
          list.setAttribute('data-user-id', user.id);
          list.setAttribute('data-user-names', user.fullName);
          list.style.cursor = 'pointer';
          list.style.padding = '8px 0';

          // attach delete user function and pass the user ID
          list.addEventListener('click', () => {
            deleteUser(user.id);
          });

          // append new user to the usersWrapper list
          usersWrapper.appendChild(list);
        }
      });
    } else {
      // if no users, show message
      usersWrapper.innerHTML = 'No Users found in database';
    }
  } catch (error) {
    usersWrapper.innerHTML = 'Something went wrong. Try again';
  } finally {
    loader.style.display = 'none';

    // clear input field
    const input = document.querySelector('#names');
    input.value = '';
  }
};

/**
 * Adds new users to Xano DB users table
 */
const addUser = async () => {
  // get the input field from DOM
  const input = document.querySelector('#names');

  // get value from input field
  const value = input.value || '';

  if (!value) {
    alert('no name found');
    return;
  }

  // add new user
  await fetch(
    'https://x8ki-letl-twmt.n7.xano.io/api:44ariOEP/users_demo_crud',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullName: value }),
    }
  );

  // refresh users table
  await getUsers();
};

/**
 * Removes users from Xano DB users table based on user ID
 */
const deleteUser = async (id = '') => {
  if (!id) return;

  const url = `https://x8ki-letl-twmt.n7.xano.io/api:44ariOEP/users_demo_crud/${id}`;

  // delete user by id
  await fetch(url, {
    method: 'DELETE',
  });

  // refresh users table
  await getUsers();
};

// trigger event listeners
addUserButton.addEventListener('click', addUser);
refresh.addEventListener('click', getUsers);

// initialize users list
getUsers();
