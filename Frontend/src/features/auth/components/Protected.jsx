import React from 'react'
import { useAuth } from '../hooks/useauth';
import { Navigate } from 'react-router';
import { SpinnerDiamond } from 'spinners-react';

const Protected = ({children}) => {

    const {loading,user} = useAuth();
    if(loading){
        return <main className="loading-container"><SpinnerDiamond size={70} color="#1781c3" secondaryColor="#ffffff" speed={100} /></main>;
    }

    if(!user){
        return <Navigate to= {"/login"} />;
    }

  return children;
}

export default Protected