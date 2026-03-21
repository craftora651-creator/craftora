import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../lib/groq-test';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const CrafotraGPT: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        text: 'Merhaba! 😊 Nasılsın bugün?',
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendMessage(input);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response || 'Üzgünüm, bir hata oluştu.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.log(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '❌ Bir hata oluştu. Lütfen tekrar deneyin.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Inline styles
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100vh',
      backgroundColor: '#212121',
      color: '#ececec',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    header: {
      padding: '12px 20px',
      borderBottom: '1px solid #3e3e3e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '14px'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    headerTitle: {
      fontWeight: 500,
      color: '#ececec'
    },
    headerBadge: {
      color: '#a0a0a0',
      fontSize: '13px'
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      color: '#a0a0a0',
      fontSize: '13px'
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '24px 16px'
    },
    messagesInner: {
      maxWidth: '800px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '24px'
    },
    messageWrapper: (isUser: boolean) => ({
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start'
    }),
    messageContent: (isUser: boolean) => ({
      display: 'flex',
      gap: '12px',
      maxWidth: '70%',
      flexDirection: isUser ? 'row-reverse' as const : 'row' as const
    }),
    avatar: (isUser: boolean) => ({
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isUser ? '#2b5278' : '#4a4a4a',
      color: '#fff',
      fontSize: '14px',
      flexShrink: 0
    }),
    bubble: (isUser: boolean) => ({
      backgroundColor: isUser ? '#2b5278' : '#2a2a2a',
      padding: '12px 16px',
      borderRadius: '18px',
      borderTopLeftRadius: isUser ? '18px' : '4px',
      borderTopRightRadius: isUser ? '4px' : '18px',
      fontSize: '15px',
      lineHeight: '1.5',
      color: '#ececec',
      wordBreak: 'break-word' as const
    }),
    timestamp: {
      fontSize: '11px',
      color: '#6b6b6b',
      marginTop: '4px',
      textAlign: 'right' as const
    },
    loadingWrapper: {
      display: 'flex',
      justifyContent: 'flex-start'
    },
    loadingContent: {
      display: 'flex',
      gap: '12px'
    },
    loadingAvatar: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#4a4a4a',
      color: '#fff',
      fontSize: '14px',
      flexShrink: 0
    },
    loadingBubble: {
      backgroundColor: '#2a2a2a',
      padding: '12px 16px',
      borderRadius: '18px',
      borderTopLeftRadius: '4px',
      fontSize: '15px',
      display: 'flex',
      gap: '4px'
    },
    loadingDot: {
      width: '6px',
      height: '6px',
      backgroundColor: '#ececec',
      borderRadius: '50%',
      opacity: 0.5,
      animation: 'bounce 1.4s infinite ease-in-out'
    },
    inputContainer: {
      borderTop: '1px solid #3e3e3e',
      padding: '20px'
    },
    inputWrapper: {
      maxWidth: '800px',
      margin: '0 auto',
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      backgroundColor: '#2a2a2a',
      borderRadius: '24px',
      padding: '4px 4px 4px 20px'
    },
    input: {
      flex: 1,
      backgroundColor: 'transparent',
      border: 'none',
      padding: '12px 0',
      fontSize: '15px',
      color: '#ececec',
      outline: 'none'
    },
    sendButton: (disabled: boolean) => ({
      backgroundColor: disabled ? '#3a3a3a' : '#2b5278',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: disabled ? 'default' : 'pointer',
      color: disabled ? '#6b6b6b' : '#fff',
      transition: 'background-color 0.2s'
    }),
    footerNote: {
      maxWidth: '800px',
      margin: '8px auto 0',
      fontSize: '12px',
      color: '#6b6b6b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    footerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    footerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.headerTitle}>Crafotra AI</span>
          <span style={styles.headerBadge}>3.5</span>
        </div>
        <div style={styles.headerRight}>
          <span>GELİŞTİRİCİ MODÜL</span>
          <span style={{ opacity: 0.5 }}>+</span>
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messagesContainer}>
        <div style={styles.messagesInner}>
          {messages.map((message) => (
            <div key={message.id} style={styles.messageWrapper(message.sender === 'user')}>
              <div style={styles.messageContent(message.sender === 'user')}>
                <div style={styles.avatar(message.sender === 'user')}>
                  {message.sender === 'user' ? '👤' : '🤖'}
                </div>
                <div>
                  <div style={styles.bubble(message.sender === 'user')}>
                    {message.text}
                  </div>
                  <div style={styles.timestamp}>
                    {message.timestamp.toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div style={styles.loadingWrapper}>
              <div style={styles.loadingContent}>
                <div style={styles.loadingAvatar}>🤖</div>
                <div style={styles.loadingBubble}>
                  <span style={styles.loadingDot}></span>
                  <span style={{...styles.loadingDot, animationDelay: '0.2s'}}></span>
                  <span style={{...styles.loadingDot, animationDelay: '0.4s'}}></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div style={styles.inputContainer}>
        <div style={styles.inputWrapper}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Herhangi bir şey sor..."
            disabled={loading}
            style={styles.input}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            style={styles.sendButton(loading || !input.trim())}
          >
            <Send size={18} />
          </button>
        </div>
        
        {/* Footer */}
        <div style={styles.footerNote}>
          <div style={styles.footerLeft}>
            <span>ChatGPT hata yapabilir. Önemli bilgileri kontrol edin.</span>
          </div>
          <div style={styles.footerRight}>
            <span>Bellek Kapalı</span>
            <span>Paylaş</span>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CrafotraGPT;