import React, { useState } from 'react'
import { useNavigate , Link} from 'react-router';
import"../auth.form.scss";
import { useAuth } from '../hooks/useauth';
import { SpinnerDiamond } from 'spinners-react';
function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {handleLogin,loading} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({email,password});
    navigate('/');
  }

  if(loading){
    return <main className="loading-container"><SpinnerDiamond size={70} color="#1781c3" secondaryColor="#ffffff" speed={100} /></main>;
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
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
          <button className="button primary-button" type="submit">Login</button>

          
        </form>
          <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </main>
  )
}

export default Login