import React, {useState, useEffect} from 'react'
import { Signup, verify } from '../../services/authApi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

export default function RegisterButton({email, password, username}) {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const {setUser} = useAuth();

	const registerHandler = async () => {
		setLoading(true);
		try {
			const response = await Signup({email, password, username});
			navigate('/login');
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}


  return (
    <button onClick={registerHandler} disabled={loading} className="p-2 bg-zinc-900 text-white  ">register</button>
  )
}
