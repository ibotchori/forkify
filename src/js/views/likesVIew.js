import { elements } from "./base";
import { limitRecipeTitle } from "./searchView";

//Toggle method for like button
export const toggleLikeBtn = (isLiked) => {
  const iconString = isLiked ? "icon-heart" : "icon-heart-outlined";
  document
    .querySelector(".recipe__love use")
    .setAttribute("href", `img/icons.svg#${iconString}`);
};

//Favourite menu
export const toggleLikeMenu = (numLikes) => {
  elements.likesMenu.style.visibility = numLikes > 0 ? "visible" : "hidden";
};

//Render favorite menu list
export const renderLike = (like) => {
  const markup = `
  <li>
    <a class="likes__link" href="#${like.id}">
      <figure class="likes__fig">
          <img src="${like.img}" alt="${like.title}">
      </figure>
      <div class="likes__data">
          <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
          <p class="likes__author">${like.author}</p>
      </div>
    </a>
 </li>`;
  //Add element to UI list
  elements.likesList.insertAdjacentHTML("beforeend", markup);
};

//Delete likes from favorite menu
export const deleteLike = (id) => {
  //Find element in html
  const el = document.querySelector(`.likes__link[href="#${id}"]`)
    .parentElement;
  //Delete element
  if (el) el.parentElement.removeChild(el);
};
