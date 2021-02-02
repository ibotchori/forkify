import { elements } from "./base";
//Clear shopping list from UI
export const clearShoppingList = () => {
  elements.shopping.innerHTML = "";
};

export const renderItem = (item) => {
  const markup = `
        <li class="shopping__item" data-itemid=${item.id}>
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
  //Insert item to html
  elements.shopping.insertAdjacentHTML("beforeend", markup);
};

//Delete item from UI
export const deleteItem = (id) => {
  //Get item from html
  const item = document.querySelector(`[data-itemid="${id}"]`);
  //Delete
  item.parentElement.removeChild(item);
};
