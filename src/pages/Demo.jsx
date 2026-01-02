// Import necessary components from react-router-dom and other parts of the application.
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";  // Custom hook htmlFor accessing the global state.
import { useEffect } from "react";
import { useNavigate } from "module";

export const Demo = () => {
  // Access the global state and dispatch function using the useGlobalReducer hook.
  const { store, dispatch } = useGlobalReducer()

  let navigate = useNavigate();
  const { id } = useParams(); //se obtine el id colocado en el layout

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  function guardarContacto(e) {
    e.preventDefault()
    if (name.trim() == "" || phone.trim() == "" || email.trim() == "" || address.trim() == "") {
      alert("Empty fields")
      return null
    }
    const payload = {
      name: name,
      phone: phone,
      email: email,
      address: address
    };
    if (!id) {
      dispatch({ type: 'CREATE_CONTACT', payload: payload })
    } else {
      dispatch({ type: 'EDIT_CONTACT', payload: { id, ...payload } })
    }
    alert("Se añadio el contacto");
    
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    navigate("/");

  }

    useEffect(() => {
      if (id && store.contactos.length > 0) {
        const currentContact = store.contactos.find(contact => contact.id == id)
        setName(currentContact.name)
        setPhone(currentContact.phone)
        setEmail(currentContact.email)
        setAddress(currentContact.address)
      }
    }, [id, store.contactos])

    return (
      <div className="container">
        <form onSubmit={guardarContacto}>
          <div className="mt-4 row mb-3">
            <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="name" placeholder="Name" onChange={(e) => setName(e.target.value)} value={name}  required />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
            <div className="col-sm-10">
              <input type="email" className="form-control" id="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} required />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="phone" className="col-sm-2 col-form-label">Phone</label>
            <div className="col-sm-10">
              <input type="number" className="form-control" id="phone" placeholder="Phone" onChange={(e) => setPhone(e.target.value)} value={phone} required />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="address" className="col-sm-2 col-form-label">Address</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="address" placeholder="Address" onChange={(e) => setAddress(e.target.value)} value={address} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">{!id ? "Add a New Contact" : `Edit Contact: ${name}`}</button>
        </form>
        <br />

        <Link to="/">
          <button className="btn btn-primary">Back home</button>
        </Link>
      </div>
    );

  }
