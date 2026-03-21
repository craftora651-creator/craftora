import React, { useState } from 'react';
import { testGroqModels, sendMessage } from '../lib/groq-test';

export const GroqTester: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (text: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${text}`]);
  };

  const handleTestModels = async () => {
    setLoading(true);
    setLogs([]);
    
    // Console.log'ları yakalamak için
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      addLog(args.join(' '));
      originalLog.apply(console, args);
    };
    
    console.error = (...args) => {
      addLog(`❌ ${args.join(' ')}`);
      originalError.apply(console, args);
    };
    
    await testGroqModels();
    
    console.log = originalLog;
    console.error = originalError;
    setLoading(false);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    const result = await sendMessage(message);
    setResponse(result || 'Cevap alınamadı');
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🔍 Groq API Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleTestModels}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Test Ediliyor...' : 'Modelleri Test Et'}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>📝 Mesaj Gönder</h3>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Bir mesaj yazın..."
          rows={3}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !message.trim()}
          style={{
            padding: '10px 20px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Gönder
        </button>
      </div>

      {response && (
        <div style={{ 
          marginBottom: '20px',
          padding: '15px',
          background: '#f5f5f5',
          borderRadius: '4px'
        }}>
          <h4>Cevap:</h4>
          <p>{response}</p>
        </div>
      )}

      <div>
        <h3>📋 Test Logları:</h3>
        <pre style={{
          background: '#1e1e1e',
          color: '#d4d4d4',
          padding: '15px',
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '400px'
        }}>
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </pre>
      </div>
    </div>
  );
};