import React, { useContext } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import Title from './Title'

const CartTotal = () => {
    const {currency, delivery_fee, getCartAmount, isProductBuy, productQuantity, productPrice} = useContext(ShopContext);
    
  return (
    <div className='w-full'>
      <div className="text-2xl">
        {!isProductBuy ? <Title text1="CART" text2="TOTALS"/> : <Title text1="ORDER" text2="TOTALS"/>}
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
            <p>Subtotal</p>
            {isProductBuy ?<p>{currency}{productPrice*productQuantity}.00</p> :<p>{currency}{getCartAmount()}.00</p>}
        </div>
        <hr />
        <div className="flex justify-between">
            <p>Shipping Fee</p>
            <p>{currency}{delivery_fee}.00</p>
        </div>
        <hr />
        <div className="flex justify-between">
            <p>Total</p>
            {isProductBuy ?<p>{currency}{productPrice*productQuantity + delivery_fee}.00</p> :<p>{currency}{getCartAmount() + delivery_fee}.00</p>}
        </div>
      </div>
    </div>
  )
}

export default CartTotal
