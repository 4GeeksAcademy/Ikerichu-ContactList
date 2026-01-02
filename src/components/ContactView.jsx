import { Link, useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useEffect, useState } from "react";

export const Contact = () => {
  const { theId } = useParams();
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (store.contactos && store.contactos.length > 0) {
      const found = store.contactos.find(c => String(c.id) === String(theId));
      if (found) {
        setContact(found);
        setLoading(false);
        return;
      }
    }

    const fetchContact = async () => {
      try {
        const listRes = await fetch('https://playground.4geeks.com/contact/agendas/ikerichu');
        if (!listRes.ok) throw new Error('No se pudo obtener la lista de contactos');
        const listData = await listRes.json();
        if (listData.contacts) {
          const contacts = listData.contacts.reverse();
          dispatch({ type: 'SET_CONTACTS', payload: contacts });
          const found = contacts.find(c => String(c.id) === String(theId));
          if (found) {
            setContact(found);
            return;
          }
        }
        const res = await fetch(`https://playground.4geeks.com/contact/agendas/ikerichu/contacts/${theId}`);
        if (!res.ok) throw new Error('Contacto no encontrado');
        const data = await res.json();
        const contactData = data?.contact ? data.contact : (Array.isArray(data) ? data[0] : data);
        setContact(contactData);
      } catch (err) {
        setError(err.message || 'Error');
      } finally {
        setLoading(false);
      }
    }

    fetchContact();
  }, [theId, store.contactos]);

  const borrarContacto = async () => {
    if (!confirm('¿Estás seguro que quieres eliminar este contacto?')) return;
    try {
      const res = await fetch(`https://playground.4geeks.com/contact/agendas/ikerichu/contacts/${theId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Error al borrar');

      const listRes = await fetch('https://playground.4geeks.com/contact/agendas/ikerichu');
      const data = await listRes.json();
      dispatch({ type: 'SET_CONTACTS', payload: data.contacts.reverse() });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Error al eliminar el contacto');
    }
  }

  if (loading) return <div className="container mt-5">Cargando...</div>;
  if (error) return <div className="container mt-5">Error: {error}</div>;
  if (!contact) return <div className="container mt-5">Contacto no encontrado</div>;

  return (
    <div className="container mt-5">
      <h2>{contact.name}</h2>
      <p><strong>Email:</strong> {contact.email}</p>
      <p><strong>Phone:</strong> {contact.phone}</p>
      <p><strong>Address:</strong> {contact.address}</p>

      <div className="d-flex gap-2">
        <Link to={`/demo/${contact.id}`} className="btn btn-secondary">Edit</Link>
        <button className="btn btn-danger" onClick={borrarContacto}>Delete</button>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Back home</button>
      </div>
    </div>
  );
};