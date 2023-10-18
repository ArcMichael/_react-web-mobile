import React, { Component } from "react";
import CategorySortBodyContent from "./CategorySortBodyContent";

class CategorySortBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: [
        { name: "综合排序", id: 1 },
        { name: "按新品排序", id: 3 },
        { name: "按人气排序", id: 4 },
      ],
    };
  }

  render() {
    let { sort, products, categorysort } = this.props;
    let Cla = "category_sortclass";
    if (sort) {
      Cla = "category_sortclass cur";
    }
    let sorts = this.state.sort.map((el, index) => {
      return (
        <CategorySortBodyContent
          key={index}
          obj={el}
          _index={index}
          sort={sort}
          products={products}
          categorysort={categorysort}
        />
      );
    });
    return <div className={Cla}>{sorts}</div>;
  }
}

export default CategorySortBody;
