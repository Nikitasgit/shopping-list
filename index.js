import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  //personal URL:
  databaseURL:
    " https://playground-e8e44-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingList = ref(database, "items");

const list = document.getElementById("shopping-list");
const input = document.getElementById("input-field");
const addBtn = document.getElementById("add-button");

onValue(shoppingList, function (snapshot) {
  if (snapshot.exists()) {
    let shoppingListArray = Object.entries(snapshot.val());
    clearShoppingListEl();
    for (let i = 0; i < shoppingListArray.length; i++) {
      let currentItem = shoppingListArray[i];

      appendItemToShoppingListEl(currentItem);
    }
  } else {
    clearShoppingListEl();
    list.innerHTML = "No items here...yet";
  }
});

addBtn.addEventListener("click", () => {
  let inputValue = input.value;
  clearInputFieldEl();
  if (inputValue.length < 3) {
    alert("Please, enter at least 3 characters.");
    return false;
  } else {
    appendItemToShoppingListEl(inputValue);
  }

  push(shoppingList, inputValue);
});

function clearInputFieldEl() {
  input.value = "";
}
function clearShoppingListEl() {
  list.innerHTML = "";
}
function appendItemToShoppingListEl(item) {
  let itemID = item[0];
  let itemValue = item[1];
  let newEl = document.createElement("li");
  newEl.textContent = itemValue;

  newEl.addEventListener("dblclick", () => {
    let exactLocationOfItemInDB = ref(database, `items/${itemID}`);
    remove(exactLocationOfItemInDB);
  });
  list.append(newEl);
}

input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addBtn.click();
  }
});
