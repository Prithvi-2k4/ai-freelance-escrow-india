import { io } from 'socket.io-client';
import React, { useEffect, useState } from 'react';
const socket = io(process.env.REACT_APP_API.replace('/api','')); // backend base without /api

export default function Chat({ room, user }){
  const [msgs,setMsgs] = useState([]);
  useEffect(()=>{
    socket.emit('join', room);
    socket.on('message', m => setMsgs(prev=>[...prev,m]));
    return ()=> socket.off('message');
  },[room]);

  const send = (text) => {
    const msg = { sender: user.name, text, time: Date.now() };
    socket.emit('message', room, msg);
  };

  return (/* UI: list msgs + form to send */);
}
