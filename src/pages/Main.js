import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'
import like from '../assets/like.svg'
import dislike from '../assets/dislike.svg'
import itsamatch from '../assets/itsamatch.png'
import './Main.css'
import api from '../services/api'
export default function Main({ match }) {

	const [users, setUsers] = useState([])
	const [matchDev, setMatchDev] = useState(null)

	useEffect(() => {
		(async function loadUsers() {
			const response = await api.get('/dev', {
				headers: { user: match.params.id }
			})
			setUsers(response.data)
		})()
	}, [match.params.id])

	useEffect(()=> {
		const socket = io('http://localhost:3333', {
			query: { user: match.params.id }
		})
		socket.on('match', dev => {
			setMatchDev(dev)
		})
	},[match.params.id])

	async function handleLike(id) {
		await api.post(`/dev/${id}/like`, null, {
			headers: {
				user: match.params.id
			}
		})
		setUsers(users.filter(u => u._id !== id))
	}
	async function handleDislike(id) {
		await api.post(`/dev/${id}/dislike`, null, {
			headers: {
				user: match.params.id
			}
		})
		setUsers(users.filter(u => u._id !== id))
	}

	return (
		<div className="main-container">
			<Link to='/'>
				<img src={logo} alt="tindev" />
			</Link>
			{users.length > 0 ? (
			<ul>
				{users.map(user => (
					<li key={user._id}>
						<img src={user.avatar} alt={user.name}/>
						<footer>
							<strong>{user.name}</strong>
							<p>{user.bio}</p>
						</footer>
						<div className="buttons">
							<button type="button" onClick={() => handleDislike(user._id)}>
								<img src={dislike} alt="dislike"/>
							</button>
							<button type="button" onClick={() => handleLike(user._id)}>
								<img src={like} alt="like"/>
							</button>
						</div>
					</li>
				))}
			</ul>
				) : (<div className="empty">Acabou :(</div>)
			}
			{matchDev && (
				<div className="matchContainer">
					<img src={itsamatch} alt=""/>
					<img className="avatar" src={matchDev.avatar} alt=""/>
					<strong>{matchDev.name}</strong>
					<p>{matchDev.bio}</p>
					<button type="button" onClick={()=> setMatchDev(null)}>Fechar</button>
				</div>
			)}
		</div>
	)
}
