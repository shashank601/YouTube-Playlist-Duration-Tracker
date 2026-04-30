import React, {useState, useEffect} from 'react'
import { Login, verify } from '../../services/authApi';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../../utils/token';
import { useAuth } from '../../context/authContext';

export default function LoginButton({email, password}) {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const {setUser} = useAuth();

	const loginHandler = async () => {
		setLoading(true);
		try {
			const response = await Login({email, password});
			setToken(response.data.token);
			
			// Get user data after setting token
			const userResponse = await verify();
			setUser(userResponse.data);
			
			navigate('/');
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}


  return (
    <button onClick={loginHandler} disabled={loading} className="p-2 bg-zinc-900 text-white  ">login</button>
  )
}
