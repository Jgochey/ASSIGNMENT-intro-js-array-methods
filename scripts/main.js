import { card } from "../components/card.js";
import { tableRow } from "../components/table.js";
import { referenceList } from "../data/reference.js";
import { renderToDom } from "../utils/renderToDom.js";

// Reusable function to get the cards on the DOM
// .forEach()
const renderCards = (array) => {
  let refStuff = "";

    array.forEach( (item) => {
      refStuff += card(item);   
});

  renderToDom("#cards", refStuff);
}

// UPDATE/ADD ITEMS TO CART
// .findIndex() & (.includes() - string method)
const toggleCart = (event) => {
  if (event.target.id.includes("fav-btn")) {
   console.log('Clicked Fav btn')
  }
}

// SEARCH
// .filter()
const search = (event) => {
  const eventLC = event.target.value.toLowerCase();
  console.log(eventLC)
}

// BUTTON FILTER
// .filter() & .reduce() &.sort() - chaining
const buttonFilter = (event) => {
  if(event.target.id.includes('free')) {
    const free = referenceList.filter(item => item.price <= 0);  //Looks through the referenceList and only returns the free items.
    renderCards(free);
  }
  if(event.target.id.includes('cartFilter')) {
    const inTheCart = referenceList.filter(item => item.inCart); //Only returns items that have inCart set to true.
    renderCards(inTheCart);
  }
  if(event.target.id.includes('books')) {
    const bookworm = referenceList.filter(item => item.type.toLowerCase() === 'book'); //The toLowerCase function will convert the selected data to lowercase which allows the === 'book' condition to work. This is important so that no shennanigans will happen because of any stray capital letters in the data.
    renderCards(bookworm);
  }
  if(event.target.id.includes('clearFilter')) {
    renderCards(referenceList); // No need to do anything fancy here. Woohoo!
  }
  if(event.target.id.includes('productList')) {
    let table = `<table class="table table-dark table-striped" style="width: 600px">
    <thead>
      <tr>
        <th scope="col">Title</th>
        <th scope="col">Type</th>
        <th scope="col">Price</th>
      </tr>
    </thead>
    <tbody>
    `;
    
    productList().forEach(item => {
      table += tableRow(item);  // Iterates through the prodcutList (see productList below) and renders a new table.
    });

    table += `</tbody></table>`

    renderToDom('#cards', table);
  }
  
}

// CALCULATE CART TOTAL
// .reduce() & .some()
const cartTotal = () => {
  const total = 0
  document.querySelector("#cartTotal").innerHTML = total.toFixed(2);
}

// RESHAPE DATA TO RENDER TO DOM
// .map()
const productList = () => {
  return referenceList.map(item => ({
    title: item.title,
    price: item.price,
    type: item.type}) ) // .map() will allow us to reassign the object data and return a NEW ARRAY that "fits" whatever we need it to be. In this case, it will take the data from the referenceList and place it in an order that the productList/table can use.

  // return [{ title: "SAMPLE TITLE", price: 45.00, type: "SAMPLE TYPE" }]
}


const startApp = () => {
  // PUT ALL CARDS ON THE DOM
  renderCards(referenceList)

  // PUT CART TOTAL ON DOM
  cartTotal();

  // SELECT THE CARD DIV
  document.querySelector('#cards').addEventListener('click', toggleCart);

  // SELECT THE SEARCH INPUT
  document.querySelector('#searchInput').addEventListener('keyup', search)

  // SELECT BUTTON ROW DIV
  document.querySelector('#btnRow').addEventListener('click', buttonFilter);
}
startApp();
