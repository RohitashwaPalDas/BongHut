import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const RelatedProducts = ({category, subCategory}) => {
    const {products} = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    const fetchRelatedData = ()=>{
        console.log(category);
        console.log(subCategory);
        let productCopy = products.slice();
        productCopy = productCopy.filter((item) => category === item.category);
        productCopy = productCopy.filter((item) => subCategory === item.subCategory);
        console.log(productCopy);
        setRelated(productCopy);
    }

    useEffect((item, index)=>{
        fetchRelatedData();
    },[products]);

  return (
    <div className='my-24'>
      <div className="text-center text-3xl py-2">
        <Title text1="RELATED" text2="PRODUCTS"/>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item, index) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          ))}
      </div>
    </div>
  )
}

export default RelatedProducts
