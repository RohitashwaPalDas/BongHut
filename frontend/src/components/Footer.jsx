import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
            <img src={assets.logo} alt="" className='mb-5 w-40'/>
            <p className="w-full md:w-2/3 text-gray-600">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo harum unde cupiditate et officiis nesciunt sunt praesentium ullam voluptates id tempora magni rem provident blanditiis iste voluptas possimus culpa laboriosam exercitationem, modi soluta, nostrum corporis at esse. Ipsa, animi ab?
            </p>
        </div>

        <div>
            <p className="text-xl mb-5 font-medium">COMPANY</p>
            <ul className="flex flex-col gap-1 text-gray-600">
                <li>Home</li>
                <li>About Us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>

        <div>
            <p className="text-xl mb-5 font-medium">GET IN TOUCH</p>
            <ul className="flex flex-col gap-1 text-gray-600">
                <li>+91-1234567890</li>
                <li>contact@bonghut.com</li>
            </ul>
        </div>
      </div>

      <div>
        <p className='w-full h-[1px] bg-gray-400'></p>
        <p className="py-5 text-sm text-center">Copyright 2025@bonghut.com - All Rights Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
