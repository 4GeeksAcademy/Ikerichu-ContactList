export const initialStore = () => {
  return {
    contactos: []
  }
}

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'SET_CONTACTS':
      return { ...store, contactos: action.payload }
    case 'CREATE_CONTACT':
      return { ...store, contactos: [action.payload, ...store.contactos] }

    case 'EDIT_CONTACT': {
      const updatedContacts = store.contactos.map(contact =>
        contact.id === action.payload.id ? { ...contact, ...action.payload } : contact
      );
      return { ...store, contactos: updatedContacts }
    }

    default:
      throw Error('Unknown action.');
  }
}
