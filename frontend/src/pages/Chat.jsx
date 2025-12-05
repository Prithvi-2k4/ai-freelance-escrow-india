import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function Chat({ jobId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    api.get(`/jobs/${jobId}/messages`).then(r => setMessages(r.data || [])).catch(()=>{});
  }, [jobId]);

  const send = async e => {
    e.preventDefault();
    try {
      const r = await api.post(`/jobs/${jobId}/messages`, { text });
      setMessages(prev => [...prev, r.data]);
      setText('');
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <div className="h-64 overflow-auto border p-2 mb-2">
        {messages.map(m => <div key={m._id} className="mb-2"><strong>{m.senderName}</strong>: {m.text}</div>)}
      </div>
      <form onSubmit={send} className="flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 border p-2" />
        <button className="bg-blue-600 text-white px-3 rounded">Send</button>
      </form>
    </div>
  );
}
