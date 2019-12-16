import React, { useState } from 'react';
import logo from '../assets/logo.svg'
import './Login.css'
import api from '../services/api'
export default function Login({history}) {
	const [username, setUsername] = useState('')
	async function handleSubmit(e) {
		e.preventDefault()
		const response = await api.post('/dev', {
			username,
		})
		const { _id } = response.data
		history.push(`/dev/${_id}`)
	}
	return (
		<div className="login-container">
			<form onSubmit={handleSubmit}>
				<img src={logo} alt="tindev" />
				<input
					placeholder="digite seu usuário do github"
					type="text"
					value={username}
					onChange={e => setUsername(e.target.value)}
				/>
				<button type="submit">Enviar</button>
			</form>
		</div>
	);
}
