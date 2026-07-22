import React, { useEffect, useState, useMemo } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

function ManageBookings() {

  const { currency, axios } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const searchLower = searchQuery.toLowerCase()
      const brandLower = booking.car?.brand?.toLowerCase() || ''
      const modelLower = booking.car?.model?.toLowerCase() || ''
      const matchesSearch = brandLower.includes(searchLower) || modelLower.includes(searchLower)
      const matchesStatus = filterStatus === 'All' ? true : booking.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [bookings, searchQuery, filterStatus])

  const fetchOwnerBookings = async () => {
     try {
      const { data } = await axios.get('/api/bookings/owner')
      data.success ? setBookings(data.bookings) : toast.error(data.message)
     } catch (error) {
      toast.error(error.message)
     }
  }

  const changeBookingStatus = async (bookingId, status) => {
     try {
      const { data } = await axios.put('/api/bookings/change-status', {bookingId, status})
      if(data.success){
        toast.success(data.message)
        fetchOwnerBookings()
      } else {
        toast.error(data.message)
      }
     } catch (error) {
      toast.error(error.message)
     }
  }

  useEffect(() => {
    fetchOwnerBookings()
  },[])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title
        title='Manage Bookings'
        subTitle='Track all customer bookings, approve or cancel requests, and manage booking statuses.'
      />

      <div className='flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 max-w-3xl'>
        <div className='flex items-center bg-white border border-borderColor rounded-full px-4 py-2 w-full sm:max-w-xs shadow-sm focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all'>
          <img src={assets.search_icon} alt='' className='w-4 h-4 opacity-50 mr-2'/>
          <input 
            type='text' 
            placeholder='Search bookings by car...' 
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
          <option value='pending'>Pending</option>
          <option value='confirmed'>Confirmed</option>
          <option value='cancelled'>Cancelled</option>
        </select>
      </div>

      <div className='max-w-3xl w-full rounded-xl overflow-hidden border border-borderColor mt-6 bg-white shadow-sm hover:shadow-md transition-shadow'>
        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Date Range</th>
              <th className='p-3 font-medium'>Total</th>
              <th className='p-3 font-medium max-md:hidden'>Payment</th>
              <th className='p-3 font-medium'>Actions</th>
            </tr>
            </thead>
            <tbody>
              {
                filteredBookings.length > 0 ? filteredBookings.map((booking, index)=> (
                  <tr key={index} className='border-t border-borderColor text-gray-500 hover:bg-gray-50 transition-colors'>
                    <td className='p-3 flex items-center gap-3'>
                      <img 
                        src={booking.car?.image || assets.upload_icon}
                        alt=''
                        className='h-12 w-12 aspect-square rounded-md object-cover
                      '/>
                      <p className='font-medium max-md:hidden'>{booking.car?.brand} {booking.car?.model}</p>
                    </td>
                    <td className='p-3 max-md:hidden'>
                      {booking.pickupDate?.split('T')[0] || 'N/A'} to {booking.returnDate?.split('T')[0] || 'N/A'}
                    </td>
                    <td className='p-3'>{currency}{booking.price}</td>
                    <td className='p-3 max-md:hidden'>
                      <span className='bg-gray-100 px-3 py-1 rounded-full text-xs'>Offline</span>
                    </td>
                    <td className='p-3'>
                      {
                        booking.status === 'pending' ? (
                          <select onChange={e=> changeBookingStatus(booking._id,e.target.value)} value={booking.status} className='px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none focus:ring-1 focus:ring-primary/50'>
                            <option value='pending'>Pending</option>
                            <option value='cancelled'>Cancelled</option>
                            <option value='confirmed'>Confirmed</option>
                          </select>
                        ): (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>{booking.status}</span>
                        )
                      }
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      No bookings found matching your search or filter.
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

export default ManageBookings