import axios from "axios";

//Patern for Search class
export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResult() {
    try {
      const result = await axios(
        `https://forkify-api.herokuapp.com/api/search?q=${this.query}`
      );

      this.result = result.data.recipes;
    } catch (error) {
      alert(error);
    }
  }
}
