import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type MessageType = 'success' | 'error' | 'warning' | 'info';

interface Message {
  id: string;
  type: MessageType;
  title: string;
  description?: string;
  duration?: number;
}

let messageId = 0;
const listeners: ((messages: Message[]) => void)[] = [];
let messages: Message[] = [];

function notifyListeners() {
  listeners.forEach(listener => listener([...messages]));
}

export function showMessage(type: MessageType, title: string, description?: string, duration = 4000) {
  const id = `msg-${++messageId}`;
  const message: Message = { id, type, title, description, duration };
  
  messages.push(message);
  notifyListeners();

  if (duration > 0) {
    setTimeout(() => {
      hideMessage(id);
    }, duration);
  }

  return id;
}

export function hideMessage(id: string) {
  messages = messages.filter(msg => msg.id !== id);
  notifyListeners();
}

export function useMessages() {
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);

  useEffect(() => {
    const listener = (msgs: Message[]) => setCurrentMessages(msgs);
    listeners.push(listener);
    
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return { messages: currentMessages, hideMessage };
}

export function MessageContainer() {
  const { messages, hideMessage } = useMessages();

  const getIcon = (type: MessageType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStyles = (type: MessageType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  if (messages.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md w-full">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${getStyles(message.type)} border rounded-lg p-4 shadow-lg animate-slide-down`}
        >
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(message.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800">{message.title}</p>
              {message.description && (
                <p className="text-sm text-gray-600 mt-1">{message.description}</p>
              )}
            </div>
            <button
              onClick={() => hideMessage(message.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export const toast = {
  success: (title: string, description?: string) => showMessage('success', title, description),
  error: (title: string, description?: string) => showMessage('error', title, description, 6000),
  warning: (title: string, description?: string) => showMessage('warning', title, description),
  info: (title: string, description?: string) => showMessage('info', title, description),
};
