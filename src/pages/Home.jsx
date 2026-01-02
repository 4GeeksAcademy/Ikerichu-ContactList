import { useEffect } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const validate = async () => {

		await fetch('https://playground.4geeks.com/contact/agendas/ikerichu').then(response => {
			if (!response.ok) {
				fetch('https://playground.4geeks.com/contact/agendas/ikerichu', {
					method: 'POST',
					body: JSON.stringify([]),
					headers: {
						"Content-Type": "application/json"
					}
				})
			}
		})
		await fetch('https://playground.4geeks.com/contact/agendas/ikerichu')
			.then(response => response.json())
			.then(data => {
				dispatch({ type: 'SET_CONTACTS', payload: data.contacts.reverse() })

			})
	}

	useEffect(() => {
		validate();

	}, [])

	const borrarContacto = async (id) => {
		await fetch(`https://playground.4geeks.com/contact/agendas/ikerichu/contacts/${id}`, {
			method: 'DELETE',
			headers: { "Content-Type": "application/json" }
		})
		await fetch('https://playground.4geeks.com/contact/agendas/ikerichu').then(response => response.json())
			.then(data => {
				dispatch({ type: 'SET_CONTACTS', payload: data.contacts.reverse()})
			})
	};

	return (
		<div className="text-center mt-5">
			<h1>Tus Contactos!!</h1>
			{store.contactos.map(contact => (
				<div key={contact.id} className="card mb-3">
					<div className="d-flex justify-content-center flex-row">
						<div className="d-flex align-items-center justify-content-center ms-3">
							<h5 className="card-title">{contact.name}</h5>
						</div>
						<div className="card-body text-start ms-4 justify-content-between d-flex flex-column border-start border-end">

							<p className="card-text">Email: {contact.email}</p>
							<p className="card-text">Phone: {contact.phone}</p>
							<p className="card-text">Address: {contact.address}</p>


						</div>
						<div className="d-flex flex-column justify-content-center g-2 p-3">
							<br />
							<Link to={`/contact/${contact.id}`}>
								<button className="btn btn-primary">View Details</button>
							</Link>
							<br />
							<Link to={`/contact/${contact.id}`}>
								<button className="btn btn-secondary ">Edit</button>
							</Link>
							<br />
							<button className="btn btn-danger" onClick={()=>borrarContacto(contact.id)}>Delete</button>
						</div>
					</div>
				</div>

			))
			}
			<br />
			<Link to="/demo">
				<button className="btn btn-primary">Add Contact</button>
			</Link>
		</div>
	);
}; 