//Import html elements from base.js
import { elements } from "./base";
//Get search input value from html
export const getInput = () => elements.searchInput.value;
//Clear input in html
export const clearInput = () => (elements.searchInput.value = "");
//Clear search result and nav buttons in html
export const clearResult = () => {
  (elements.searchResList.innerHTML = ""),
    (elements.searchResPages.innerHTML = "");
};

//HighLight Selected search items
export const highLightSelected = (id) => {
  //Get all anchor from search result
  const resArr = Array.from(document.querySelectorAll(".results__link"));
  //Remove highlight from anchor
  resArr.forEach((el) => {
    el.classList.remove("results__link--active");
  });
  //Add highligth to anchor
  document
    .querySelector(`a[href="#${id}"]`)
    .classList.add("results__link--active");
};

//Limit recipe title
export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(" ")}...`;
  }
  return title;
};

//Render information from API
const renderRecipe = (recipe) => {
  const markup = `
 <li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
     </a> 
 </li>`;
  //Push elements in HTML
  elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

//Create buttons for renderButton function
const createButtons = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto="${
  type === "prev" ? page - 1 : page + 1
}">
      <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
      <svg class="search__icon">
          <use href="img/icons.svg#icon-triangle-${
            type === "prev" ? "left" : "right"
          }"></use>
      </svg>
    </button>`;

//Render nav button
const renderButton = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;
  if (page === 1 && pages > 1) {
    //Only button to go to next page
    button = createButtons(page, "next");
  } else if (page < pages) {
    //Both Button
    button = `
    ${createButtons(page, "next")}
    ${createButtons(page, "prev")}`;
  } else if (page === pages && page > 1) {
    //Only button to go prev page
    button = createButtons(page, "prev");
  }
  elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

//Render information from API
export const renderResult = (recipes, page = 1, resPerPage = 10) => {
  //Render result of current page
  const start = (page - 1) * resPerPage; // (3 - 1) * 2 = 10
  const end = page * resPerPage; // 3 * 5 = 15
  recipes.slice(start, end).forEach(renderRecipe);

  //Render pagination buttons
  renderButton(page, recipes.length, resPerPage);
};
