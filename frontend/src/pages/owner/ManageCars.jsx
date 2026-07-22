import React, { useEffect, useState, useMemo } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

function ManageCars() {

  const {isOwner, axios, currency} = useAppContext()

  const [cars, setCars] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = car.brand.toLowerCase().includes(searchLower) || car.model.toLowerCase().includes(searchLower)
      const matchesStatus = filterStatus === 'All' ? true : (filterStatus === 'Available' ? car.isAvaliable : !car.isAvaliable)
      return matchesSearch && matchesStatus
    })
  }, [cars, searchQuery, filterStatus])

  const fetchOwnerCars = async () => {
    try {
      const {data} = await axios.get('/api/owner/cars')
      if(data.success) {
        setCars(data.cars)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const toggleAvailability = async (carId) => {
    try {
      const {data} = await axios.post('/api/owner/toggle-car', {carId})
      if(data.success) {
        toast.success(data.message)
        fetchOwnerCars()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteCar = async (carId) => {
    try {
      const confirm = window.confirm('Are you sure you want to delete this car?')
      
      if(!confirm) return null

      const {data} = await axios.post('/api/owner/delete-car', {carId})
      if(data.success) {
        toast.success(data.message)
        fetchOwnerCars()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchOwnerCars()
  },[])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title
        title='Manage Cars'
        subTitle='View all listed cars, update their details, or remove them from the booking platform.'
      />

      <div className='flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 max-w-3xl'>
        <div className='flex items-center bg-white border border-borderColor rounded-full px-4 py-2 w-full sm:max-w-xs shadow-sm focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all'>
          <img src={assets.search_icon} alt='' className='w-4 h-4 opacity-50 mr-2'/>
          <input 
            type='text' 
            placeholder='Search cars...' 
            className='outline-none text-sm w-full bg-transparent'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className='bg-white border border-borderColor rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm w-full sm:w-auto text-gray-600 cursor-pointer'
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value='All'>All Statuses</option>
          <option value='Available'>Available</option>
          <option value='Unavailable'>Unavailable</option>
        </select>
      </div>

      <div className='max-w-3xl w-full rounded-xl overflow-hidden border border-borderColor mt-6 bg-white shadow-sm hover:shadow-md transition-shadow'>
        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Category</th>
              <th className='p-3 font-medium'>Price</th>
              <th className='p-3 font-medium max-md:hidden'>Status</th>
              <th className='p-3 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              filteredCars.length > 0 ? filteredCars.map((car, index)=> (
                <tr key={index} className='border-t border-borderColor hover:bg-gray-50 transition-colors'>
                  <td className='p-3 flex items-center gap-3'>
                    <img src={car.image} alt='' className='h-12 w-12 aspect-square rounded-md object-cover'/>
                    <div className='max-md:hidden'>
                      <p className='font-medium'>{car.brand} {car.model}</p>
                      <p className='text-xs text-gray-500'>{car.seating_capacity} {car.transmission}</p>
                    </div>
                  </td>
                  <td className='p-3 max-md:hidden'>{car.category}</td>
                  <td className='p-3'>{currency}{car.pricePerDay}/day</td>
                  <td className='p-3 max-md:hidden'>
                    <span className={`px-3 py-1 rounded-full text-xs ${car.isAvaliable ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                      {car.isAvaliable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td  className='flex items-center p-3'>
                    <img 
                      onClick={() => toggleAvailability(car._id)}
                      src={car.isAvaliable ? assets.eye_close_icon : assets.eye_icon}  
                      alt='' 
                      className='cursor-pointer'
                    />
                    <img
                      onClick={() => deleteCar(car._id)} 
                      src={assets.delete_icon}  
                      alt='' 
                      className='cursor-pointer'
                    />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No cars found matching your search or filter.
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default ManageCars