import axios from "axios";

//Patern for Recipe class
export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipe() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      alert(error);
    }
  }
  //Calculate coocking time for recipe
  calcTime() {
    const numIng = this.ingredients.length;
    const period = Math.ceil(numIng / 3);
    this.time = period * 15;
  }
  //Calculate serving size
  calcServing() {
    this.servings = 4;
  }

  //Parse ingredients
  parseIngedients() {
    const newIngredients = this.ingredients.map((el) => {
      const unitsLong = [
        "tablespoons",
        "tablespoon",
        "ounces",
        "ounce",
        "teaspoons",
        "teaspoon",
        "cups",
      ];
      const unitsShort = ["tbsp", "tbsp", "oz", "oz", "tsp", "tsp", "cup"];
      const units = [...unitsShort, "kg", "g", "pound"];
      /* 1. Uniform unit */
      //Lowercase all ingredients
      let ingredient = el.toLowerCase();
      //Replace ingredints from unitesLong to unitesShort
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });
      /* 2. Remove parentheses */
      ingredient = ingredient.replace(/ *\(([^)]*)\) */g, " ");
      /* 3. Parse ingredients into count, unit and indredinet */
      //Convert ingredient to array
      const arrIng = ingredient.replace("-", " ").split(" ");
      //Find uniteShorts unit's index number in arrIng
      const unitIndex = arrIng.findIndex((el2) => units.includes(el2));

      let objIng;
      if (unitIndex > -1) {
        /*There is a Unit & Count*/
        //Get Counts from arrIng
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          //When have one count (for example: 2)
          count = eval(arrCount[0]);
        } else {
          //When have 2 count (for example:2 2/1)
          count = parseFloat(eval(arrCount.join("+")).toFixed(1));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" "),
        };
      } else if (parseInt(arrIng[0], 10)) {
        //There is NO unit but Count
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" "),
        };
      } else if (unitIndex === -1) {
        //There is no Unit
        objIng = {
          count: 1,
          unit: "",
          ingredient,
        };
      }

      return objIng;
    });
    this.ingredients = newIngredients;
  }
  //Update Serving & Ingredinet's count
  updateServings(type) {
    //Serving
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;
    //Ingredients
    this.ingredients.forEach((ing) => {
      ing.count *= newServings / this.servings;
    });
    //Update serving
    this.servings = newServings;
  }
}
