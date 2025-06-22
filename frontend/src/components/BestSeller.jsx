import React, {useContext, useState, useEffect} from 'react'
import { ShopContext } from '../contexts/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const BestSeller = () => {
    const {products} = useContext(ShopContext);
    const [bestProducts, setBestProducts] = useState([]);
    useEffect(()=>{
        const bestProducts = products.filter((item)=>(item.bestseller));
        setBestProducts(bestProducts.slice(0,5));
    },[products])
  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1="BEST" text2="SELLERS"></Title>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestProducts.map((item, index) => (
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

export default BestSeller
