let log = console.log;
//Import Recipe class from Recipe.js
import Recipe from "./models/Recipe";
//import Search class from Search.js
import Search from "./models/Search";
//Import List class from List.js
import List from "./models/List";
//import Likes class from Likes.js
import Likes from "./models/Likes";
//import elemets from base.js
import { elements, renderLoader, clearLoader } from "./views/base";
//Import all from searchView.js
import * as searchView from "./views/searchView";
//Import all from searchView.js
import * as recipeView from "./views/recipeView";
//Import all from listView.js
import * as listView from "./views/listView";
//Import all from likesView.js
import * as likesView from "./views/likesVIew";

/* Global state of the app */
// -1 Search object
// -2 Current recipe object
// -3 Shopping list object
// -4 Liked ricipes
const state = {};
window.state = state;

/*   Search Controler   */
const controlSearch = async () => {
  //Get query from view
  const query = searchView.getInput();

  if (query) {
    //Create new search object and add to state
    state.search = new Search(query);
    //Prepare UI for result
    searchView.clearInput();
    searchView.clearResult();
    renderLoader(elements.searchResList);
    try {
      //Search for recipes
      await state.search.getResult();
      //Render result on UI
      clearLoader();
      searchView.renderResult(state.search.result);
    } catch (error) {
      alert("Error search");
    }
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault(); //Do not refresh on click
  controlSearch(); //Run search function
});

//Click event for pagination button
elements.searchResPages.addEventListener("click", (e) => {
  const button = e.target.closest(".btn-inline");
  if (button) {
    const goToPage = +button.dataset.goto;
    //Clear result before go to the next page
    searchView.clearResult();
    //Run renderResult function
    searchView.renderResult(state.search.result, goToPage);
  }
});

/*   Recipe  Controller   */
const controlRecipe = async () => {
  //Get ID from url
  const id = window.location.hash.replace("#", "");
  if (id) {
    //Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    //Highlight selected search items
    if (state.search) searchView.highLightSelected(id);
    //Create new recipe object with Recipe class
    state.recipe = new Recipe(id);
    try {
      //Get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngedients();
      //Calculate Serving and Time
      state.recipe.calcTime();
      state.recipe.calcServing();
      //Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      alert("Error recipe");
    }
  }
};

//Hashchange & Load event for current recipe
["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

/* List Controller */
const controllerList = () => {
  //Greate New List
  if (!state.list) state.list = new List();
  //Prepare UI for changes
  listView.clearShoppingList();
  //Add each ingredienst
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItems(el.count, el.unit, el.ingredient);
    //Render Result
    listView.renderItem(item);
  });
};

/* Like Controller */
const controllerLike = () => {
  if (!state.likes) state.likes = new Likes();

  const currentID = state.recipe.id;
  if (!state.likes.isLiked(currentID)) {
    /*Add like to the state*/
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    //Toggle to the Button
    likesView.toggleLikeBtn(true);
    //Add like to UI list
    likesView.renderLike(newLike);
  } else {
    /*Remove like from the state*/
    state.likes.deleteLike(currentID);
    //Toggle to the Button
    likesView.toggleLikeBtn(false);
    //Remove like from UI list
    likesView.deleteLike(currentID);
  }
  //Favorite menu
  likesView.toggleLikeMenu(state.likes.getNumberLikes());
};

//Restore liked recipes on page load
window.addEventListener("load", () => {
  state.likes = new Likes();
  //Restore likes
  state.likes.readStorage();
  //Favorite menu
  likesView.toggleLikeMenu(state.likes.getNumberLikes());
  //Render the existing likes
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

//Handling delete and update list item events
elements.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    /*Delete button is clicked*/
    //Delete from state
    state.list.deleteItem(id);
    //Delete from UI
    listView.deleteItem(id);
  } else if (e.target.matches(".shopping__count-value")) {
    /*Input is clicked*/
    //Get value from UI
    const val = parseFloat(e.target.value);
    //Update count
    state.list.updateCount(id, val);
  }
});

//Handling recipe button click
elements.recipe.addEventListener("click", (e) => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    //Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    //Increase button is clicked
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn__add, .recipe__btn__add *")) {
    //Add To Shopping List button is clicked
    controllerList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    //Like button is clicked
    controllerLike();
  }
});
