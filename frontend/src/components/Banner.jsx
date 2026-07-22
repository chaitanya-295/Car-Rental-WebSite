import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'

function Banner() {
  return (
    <motion.div
      initial={{y: 50 , opacity:0}}
      whileInView={{y: 0, opacity: 1}}
      transition={{ duration: 0.6 }} 
      className='flex flex-col md:flex-row md:items-start items-center justify-between px-8 min-md:pl-14 pt-10 bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-xl max-w-6xl mx-3 md:mx-auto rounded-3xl overflow-hidden'
    >
        <div className='text-white'>
            <h2 className='text-3xl font-medium'>Do you Own a Luxury Car?</h2>
            <p className='mt-2'>Monetize your vehicle effortlessly by listing it on CarRental.</p>
            <p className='max-w-130'>We take care of insurance, driver verification and secure payments - so you can earn passive income, stress-free.</p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='px-8 py-3 bg-white hover:bg-slate-50 transition-all duration-300 text-primary font-medium rounded-full shadow-lg hover:shadow-xl text-sm mt-6 cursor-pointer'
            >
                List your car
            </motion.button>
        </div>

        <motion.img
          initial={{x: 50 , opacity:0}}
          whileInView={{x: 0, opacity: 1}}
          transition={{ duration: 0.6, delay: 0.4 }} 
          src={assets.banner_car_image} alt='car' className='max-h-45 mt-10'
        />
    </motion.div>
  )
}

export default Banner