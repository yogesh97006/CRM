import { useNavigate } from 'react-router-dom'
import React from 'react'
import NFI from '../Static/NFI.svg';

function NotFound() {
    const navigate=useNavigate();

    const goBack=()=>{
        navigate(-1)
    }

  return (
    <div className='bg-light vh-100 d-flex justify-content-center text-align-center text-center m-5'>
       <div >
         <h1>Not Found!</h1>
         <img src={NFI} alt='notfound' />
         <p className='lead fw-bolder m-1'>Oops.... The Page You Are Looking For Does Not Exist</p>  
         <button onClick={goBack} className='btn btn-primary m-1 ' >Go Back</button> 
      </div>
    </div>
  )
}

export default NotFound