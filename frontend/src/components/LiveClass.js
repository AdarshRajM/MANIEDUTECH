import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, PanTool } from '@mui/icons-material';

const LiveClass = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [handRaised, setHandRaised] = useState(false);
    const hasJoined = useRef(false);

    useEffect(() => {
        // Simulated WebSocket connection setup logic
        if (!hasJoined.current) {
            setMessages([{ sender: 'System', text: 'Connecting to WebSocket server...', time: new Date().toLocaleTimeString() }]);
            setTimeout(() => {
                setMessages(prev => [...prev, { sender: 'System', text: 'Connected! Waiting for host...', time: new Date().toLocaleTimeString() }]);
            }, 1000);
            hasJoined.current = true;
        }
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (messageInput.trim() === '') return;
        
        const newMsg = {
            sender: 'You',
            text: messageInput,
            time: new Date().toLocaleTimeString()
        };
        
        setMessages([...messages, newMsg]);
        setMessageInput('');
        
        // Simulating echo/broadcast from Websocket server
        setTimeout(() => {
            if (messageInput.toLowerCase().includes('hello')) {
                 setMessages(prev => [...prev, { sender: 'Instructor', text: 'Hello! Welcome to the class.', time: new Date().toLocaleTimeString() }]);
            }
        }, 1500);
    };

    const toggleRaiseHand = () => {
        setHandRaised(!handRaised);
        const newMsg = {
             sender: 'System',
             text: !handRaised ? 'You raised your hand.' : 'You lowered your hand.',
             time: new Date().toLocaleTimeString()
        };
        setMessages([...messages, newMsg]);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col lg:flex-row h-full gap-6 max-w-7xl mx-auto"
        >
            {/* Video Stream Area */}
            <div className="flex-1 bg-black rounded-3xl overflow-hidden shadow-2xl relative flex items-center justify-center border-4 border-gray-800">
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div> LIVE
                </div>
                
                {/* Dummy Video Stream / Presentation placeholder */}
                <div className="text-white text-center">
                    <h2 className="text-3xl font-bold mb-4 opacity-70">Waiting for Host...</h2>
                    <p className="text-gray-400">Class: Advanced System Design</p>
                </div>

                {/* Floating controls */}
                <div className="absolute bottom-6 flex space-x-4 bg-gray-900/80 backdrop-blur-md px-6 py-3 rounded-full">
                     <button 
                        onClick={toggleRaiseHand}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition ${handRaised ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        title="Raise Hand"
                     >
                         <PanTool />
                     </button>
                </div>
            </div>

            {/* Live Chat Panel */}
            <div className="w-full lg:w-96 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">Live Chat</h3>
                    <p className="text-xs text-green-500 font-medium">124 Participants</p>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900">
                    {messages.map((msg, i) => (
                        <motion.div 
                            initial={{ opacity: 0, x: msg.sender === 'You' ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={i} 
                            className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}
                        >
                            <span className="text-[10px] text-gray-400 mb-1">{msg.sender} • {msg.time}</span>
                            <div className={`px-4 py-2 rounded-2xl max-w-[85%] ${
                                msg.sender === 'System' 
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 text-xs text-center w-full my-2 italic'
                                : msg.sender === 'You'
                                ? 'bg-blue-500 text-white rounded-tr-sm'
                                : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm shadow-sm'
                            }`}>
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                        <input 
                            type="text" 
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Type a message..." 
                            className="flex-1 bg-gray-100 dark:bg-gray-700 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-gray-100"
                        />
                        <button type="submit" className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition transform active:scale-95 cursor-pointer border-none outline-none">
                            <Send fontSize="small" />
                        </button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default LiveClass;
