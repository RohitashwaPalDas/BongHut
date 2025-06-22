import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewletterBox from '../components/NewletterBox'

const Contact = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1="CONTACT" text2="US"/>
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img src={assets.contact_img} alt="" className="w-full md:max-w-[480px]"/>
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Our Store</p>
          <p className="text-gray-500">54709 WIllims Station <br /> Suite 350, Washington, USA</p>
          <p className="text-gray-500">Tel: (+91) 1234567890 <br /> Email: admin@bonghut.com</p>
          <p className="font-semibold text-gray-600 text-xl">Carrers at BongHut</p>
          <p className="text-gray-500">Learn more about our team and job openings.</p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-100 ">Explore Jobs</button>
        </div>
      </div>
      <NewletterBox/>
    </div>
  )
}

export default Contact
