import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'

function AddCar() {

  const [image, setImage] = useState(null)
  const [car, setCar] =useState(
    {
      brand: '',
      model: '',
      year: 0,
      pricePerDay: 0,
      category: '',
      transmission: '',
      fule_type: '',
      seating_capacity: 0,
      location: '',
      description: '',
    }
  )
  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>
      <Title
        title='Add New Car'
        subTitle='Fill in details to list a new car for booking, including pricing, availability, and car specifications.'
      />

      <from onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'>

        {/* Car Image */}
        <div>
          <label htmlFor='car-image'>
            <img src={image ? URL.createObjectURL(image) : assets.upload_icon} alt='' className='h-14 roounded cursor-pointer'/>
          </label>
        </div>
      </from>
    </div>
  )
}

export default AddCar