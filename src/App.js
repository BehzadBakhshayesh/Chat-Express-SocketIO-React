import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [userSet, setUserSet] = useState(false);

  useEffect(() => {
    if (userSet) {
      socket.emit('set username', username);
    }

    socket.on('chat message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('chat message');
    };
  }, [userSet, username]);




  return (
    <div>
      {!userSet ? (
        <div>
          <h1>Set your username</h1>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
          <button onClick={() => {
            if (username.trim()) {
              setUserSet(true);
            }
          }}>Set Username</button>
        </div>
      ) : (
        <div>
          <h1>Simple Chat</h1>
          <div>
            <ul>
              {messages.map((msg, index) => (
                <li key={index}>
                  <strong>{msg.username}:</strong> {msg.message}
                </li>
              ))}
            </ul>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (message.trim()) {
              socket.emit('chat message', message);
              setMessage('');
            }
          }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
