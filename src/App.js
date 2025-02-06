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

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const setUserName = () => {
    if (username.trim()) {
      setUserSet(true);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat message', message);
      setMessage('');
    }
  };

  return (
    <div>
      {!userSet ? (
        <div>
          <h1>Set your username</h1>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Enter username"
          />
          <button onClick={setUserName}>Set Username</button>
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
          <form onSubmit={sendMessage}>
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
