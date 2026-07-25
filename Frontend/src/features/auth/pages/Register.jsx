import React, { useState } from 'react'
import { useNavigate , Link} from 'react-router';
import"../auth.form.scss";
import { SpinnerCircular, SpinnerDiamond } from 'spinners-react';
import { useAuth } from '../hooks/useauth';

const Register = () => {

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {handleRegister,loading} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({username,email,password});
    navigate('/');
  }

  if(loading){
    return <main className="loading-container"><SpinnerDiamond size={70} color="#1781c3" secondaryColor="#ffffff" speed={100} /></main>;
  }

  return (
    <main>
    <div className="form-container">
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
      
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
          
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text" id="username" name="username" placeholder="Enter your username" />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email" id="email" name="email" placeholder="Enter your email" />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password" id="password" name="password" placeholder="Enter your password" />
        </div>
        <button className="button primary-button" >Register</button>

        
      </form>
        <p> Already have an account? <Link to="/login">Login</Link></p>
    </div>
  </main>
  )
}

export default Register