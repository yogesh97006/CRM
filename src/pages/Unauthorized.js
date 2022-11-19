
import { useNavigate } from 'react-router-dom'
import React from 'react'
import unauth from '../Static/unauth.svg';

function Unauthorized() {
    const navigate=useNavigate();

    const goBack=()=>{
        navigate(-1)
    }

  return (
    <div className='bg-light vh-100 d-flex justify-content-center text-align-center text-center m-5'>
       <div >
         <h1 className='justify-content-center text-align-center text-center'>Unauthorized!</h1>
         <img src={unauth} alt='Unauthorized'  />
         <p className='lead fw-bolder m-1'>You Do Not Have Access To The Requested Page.</p>  
         <button onClick={goBack} className='m-4 text-white  rounded-2' style={{backgroundColor:'#F50057'}} >Go Back</button> 
      </div>
    </div>
  )
}

export default Unauthorized

