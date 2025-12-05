import React, {useEffect, useState, useRef} from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

const SOCKET_URL = (process.env.REACT_APP_API || 'http://localhost:5000').replace('/api','');
const socket = io(SOCKET_URL);

export default function Chat(){
  const { roomId } = useParams();
  const [msgs,setMsgs] = useState([]);
  const [text,setText] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const bottomRef = useRef();

  useEffect(()=>{
    if(!roomId) return;
    socket.emit('join', roomId);
    socket.on('message', m => setMsgs(prev => [...prev, m]));

    // optionally load historical messages via API:
    (async ()=>{
      try {
        const res = await fetch(`${process.env.REACT_APP_API}/chat/${roomId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setMsgs(data || []);
      } catch(e){ console.warn(e); }
    })();

    return () => {
      socket.emit('leave', roomId);
      socket.off('message');
    };
  }, [roomId]);

  useEffect(()=> bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [msgs]);

  const send = () => {
    if(!text.trim()) return;
    const msg = { senderId: user?._id || null, senderName: user?.name || 'You', text, time: Date.now() };
    socket.emit('message', roomId, msg);
    setText('');
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Chat</h2>
      <div className="bg-white p-4 rounded shadow h-96 overflow-auto">
        {msgs.map((m,i)=> (
          <div key={i} className={`mb-2 ${m.senderId === user?._id ? 'text-right' : 'text-left'}`}>
            <div className="text-sm text-gray-600">{m.senderName}</div>
            <div className="inline-block bg-gray-100 p-2 rounded">{m.text}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="mt-3 flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 border p-2 rounded" placeholder="Message..." />
        <button onClick={send} className="bg-brand-500 text-white px-4 py-2 rounded">Send</button>
      </div>
    </div>
  );
}
