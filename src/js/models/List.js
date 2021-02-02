//Import Uniq ID
import uniqid from "uniqid";

//Patern for List class
export default class List {
  constructor() {
    this.items = [];
  }
  //Create item object and add to items array
  addItems(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient,
    };
    this.items.push(item);

    return item;
  }
  //Delete item from items array
  deleteItem(id) {
    const index = this.items.findIndex((el) => el.id === id);
    this.items.splice(index, 1);
  }
  //Update ingredient's count on shopping list
  updateCount(id, newCount) {
    this.items.find((el) => el.id === id).count = newCount;
  }
}
