import React, { useEffect, useState } from 'react';
import { getChats } from '../../utils/URIs';
import axios from "axios";



function Chat() {
  const [message, setMessage] = useState<string>();
  const [phoneModel, setPhoneModel] = useState<string>('');

   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const response = await axios.post(getChats(), { content: phoneModel });
      setMessage(response.data.message);
      setPhoneModel('');
    } catch (error) {
      console.error('Error submitting message:', error);
    }
  }

  return (
 <div className="container">
      <h3 className="mt-4">You forgot the price?</h3>
      <p>Just type the model, and I'll try to find it for you.</p>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter phone model..."
            value={phoneModel}
            onChange={(event) => setPhoneModel(event.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </div>
      </form>
      <div className="mt-4">
        <div className="list-group">
          <div className="list-group-item">{message}</div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
