import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import MsgBox from './components/MsgBox';
import MarkupFormatter from './components/markup';

function App() {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const scrollToBottom = () => {
    chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  // Function to submit question to the server
  const askQuestion = async () => {
    if (!question) return;

    setLoading(true);
    setConversation([...conversation, { role: 'user', content: question }]);
    let response;
    try {
      response = await axios.post(`${backendUrl}/chat`, { prompt: question });
    } catch (error) {
      response = { data: { response: "Something went wrong" } };
    }
    setConversation([...conversation, { role: 'user', content: question }, { role: 'bot', content: response.data.response }]);
    setQuestion('');
    setLoading(false);
    setTimeout(scrollToBottom, 100);
  };

  return (
    <div className="container">
      <h1>Chat with me</h1>

      {/* Chat container */}
      <div className="chat-container">
        {conversation.map((msg, index) => (
          <div key={index}>
          {
            index === conversation.length - 1 ? 
            <div ref={chatEndRef}></div> : null
          }
          <MsgBox key={index} role = {msg.role} content={msg.content} />
          </div>
        ))}
      </div>

      {/* Input section */}
      <textarea
        className="textarea"
        rows="4"
        placeholder="Ask a question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <br />
      <button className="button" onClick={askQuestion} disabled={loading}>
        {loading ? 'Loading...' : 'Ask'}
      </button>
    </div>
  );
}

export default App;
