//Patern for Likes class
export default class Likes {
  constructor() {
    this.likes = [];
  }
  //Push like object to likes Array
  addLike(id, title, author, img) {
    const like = { id, title, author, img };
    this.likes.push(like);
    //Sync data to local storage
    this.parsisData();

    return like;
  }
  //Delete element from likes Array
  deleteLike(id) {
    //Find index of element
    const index = this.likes.findIndex((el) => el.id === id);
    //Sync data to local storage
    this.parsisData();
    //Delete element
    this.likes.splice(index, 1);
  }
  //Method to find element in favourite (true or false)
  isLiked(id) {
    return this.likes.findIndex((el) => el.id === id) !== -1;
  }
  //Get length of likes array
  getNumberLikes() {
    return this.likes.length;
  }

  //Set likes array to Local Storage
  parsisData() {
    localStorage.setItem("likes", JSON.stringify(this.likes));
  }
  //Get likes from storage
  readStorage() {
    const storage = JSON.parse(localStorage.getItem("likes"));
    //Copy storage to likes array
    if (storage) this.likes = storage;
  }
}
