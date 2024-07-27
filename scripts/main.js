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
   const [, id] = event.target.id.split('--'); // Looks for the '--' placed before the specific item ID and uses that to split. NOTE this will return a new array of fav btn and the ID number.

   const index = referenceList.findIndex(item => item.id === Number(id)) // Takes the item ID and converts that string into an actual number.
  
   referenceList[index].inCart = !referenceList[index].inCart // Swaps the value of 'inCart' when clicked on.
   cartTotal();
   renderCards(referenceList)
  }
}

// SEARCH
// .filter()
const search = (event) => { //This particular event is set to occur when the user releases a key (keyup).
  const eventLC = event.target.value.toLowerCase(); //Takes the VALUE of the user's search lowercase.
  const searchResult = referenceList.filter(item =>  //Looks for the relevant search categories (author, description, title) and converts them to lowercase to match the search function. It then looks for matching results in each category.
    item.author.toLowerCase().includes(eventLC) || 
    item.description.toLowerCase().includes(eventLC) ||
    item.title.toLowerCase().includes(eventLC)
  )

  renderCards(searchResult);
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
    
    productList().sort((a, b) => a.type.localeCompare(b.type)).forEach(item => { // Sorts the product list into alphabetical order, the localeCompare will make it so we don't have to convert them to lowercase.
      table += tableRow(item);  // Iterates through the prodcutList (see productList below) and renders a new table.
    });

    table += `</tbody></table>`

    renderToDom('#cards', table);
  }
  
}

// CALCULATE CART TOTAL
// .reduce() & .some()
const cartTotal = () => {
  const cart = referenceList.filter(item => item.inCart); // Looks through all the items currently in the cart.
  const total = cart.reduce((firstValue, secondValue) => firstValue + secondValue.price, 0); // This .reduce() will add the firstValue to the current secondValue continuously until there is only one number value left. (Ex. 1 + 2 + 3 + 4 would become 1 + 2 = 3, 3 + 3 = 6, 6 + 4 = 10). In this case, it will total the cost of all the items in the cart. The 0 after secondValue.price is the inital value.
  const free = cart.some(item => item.price <= 0); // .some() will return a true or false value depnding on a condition passed through it. In this case, whether or not the item has a price of 0 or less.
  document.querySelector("#cartTotal").innerHTML = total.toFixed(2);

  if (free) { // Checks if there are any free items in the cart, if so-- display some text underneath the shopping cart.
  document.querySelector('#includes-free').innerHTML = 'INCLUDES FREE ITEMS'  
  } else {
    document.querySelector('#includes-free').innerHTML = ''
  }
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
