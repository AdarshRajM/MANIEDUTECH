import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, PanTool, Event as EventIcon, Schedule, Person } from '@mui/icons-material';
import axios from 'axios';

const LiveClass = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [handRaised, setHandRaised] = useState(false);
    const [schedule, setSchedule] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeMeeting, setActiveMeeting] = useState(null);

    const fetchSchedule = async () => {
        try {
            // Using section A as default, can be dynamic based on user profile
            const res = await axios.get('/sections/live/A');
            setSchedule(res.data);
        } catch (err) {
            console.error('Failed to fetch schedule, falling back to mock data');
            const mockSchedule = [
                { id: 1, title: 'Advanced React Hooks', scheduledAt: new Date(Date.now() + 1000 * 60 * 5).toISOString(), meetingLink: 'maniedutech-react-hooks' }, // 5 mins from now
                { id: 2, title: 'Spring Boot Microservices', scheduledAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), meetingLink: 'maniedutech-spring-micro' }, // Started 30 mins ago
                { id: 3, title: 'System Design Interview Prep', scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), meetingLink: 'maniedutech-sys-design' }
            ];
            setSchedule(mockSchedule);
        }
    };

    useEffect(() => {
        fetchSchedule();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (messageInput.trim() === '') return;
        
        const newMsg = { sender: localStorage.getItem('username') || 'You', text: messageInput, time: new Date().toLocaleTimeString() };
        setMessages([...messages, newMsg]);
        setMessageInput('');
        
        try {
            await axios.post('/sections/chat', { section: 'A', message: messageInput });
        } catch(e) {}
    };

    const toggleRaiseHand = () => {
        setHandRaised(!handRaised);
        const newMsg = { sender: 'System', text: !handRaised ? 'You raised your hand.' : 'You lowered your hand.', time: new Date().toLocaleTimeString() };
        setMessages([...messages, newMsg]);
    };

    const canJoinClass = (scheduledAt) => {
         const classTime = new Date(scheduledAt).getTime();
         const now = currentTime.getTime();
         // Can join if class started up to 2 hours ago, or starts within 10 minutes
         return (now >= classTime - 10 * 60 * 1000) && (now <= classTime + 2 * 60 * 60 * 1000);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:flex-row h-full gap-6 w-full mx-auto pb-10">
            {/* View Area & Timetable */}
            <div className="flex-1 flex flex-col gap-6 h-full min-h-[80vh]">
                
                {/* Active Meeting Room */}
                <div className="w-full bg-black rounded-3xl overflow-hidden shadow-2xl relative flex items-center justify-center border border-gray-700/50 h-[500px] flex-shrink-0">
                    {!activeMeeting ? (
                        <div className="text-white text-center z-10 flex flex-col items-center">
                            <EventIcon sx={{ fontSize: 60, mb: 2, color: 'royalblue' }} />
                            <h2 className="text-3xl font-bold mb-4 opacity-90">Classroom Waiting Area</h2>
                            <p className="text-gray-400 bg-gray-900/80 px-4 py-2 rounded-full border border-gray-700">Please select an active class from the timetable</p>
                        </div>
                    ) : (
                        <iframe 
                            src={`https://meet.jit.si/${encodeURIComponent(activeMeeting)}`}
                            allow="camera; microphone; fullscreen; display-capture; autoplay"
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            title="Live Class Video"
                        />
                    )}
                    
                    {activeMeeting && (
                        <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse flex items-center">
                            <div className="w-2 h-2 bg-white rounded-full mr-2"></div> LIVE
                        </div>
                    )}
                    
                    {/* Floating controls */}
                    <div className="absolute bottom-6 flex space-x-4 bg-gray-900/60 backdrop-blur-md px-6 py-3 rounded-full border border-gray-700/50 z-20">
                         <button 
                            onClick={toggleRaiseHand}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition ${handRaised ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                            title="Raise Hand"
                         >
                             <PanTool />
                         </button>
                         {activeMeeting && (
                             <button 
                                onClick={() => setActiveMeeting(null)}
                                className="px-6 h-12 rounded-full flex items-center justify-center transition bg-red-600 text-white hover:bg-red-700 font-bold"
                             >
                                 Leave Class
                             </button>
                         )}
                    </div>
                </div>

                {/* Calendar / Timetable */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 flex-1 overflow-auto">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center"><Schedule className="mr-2 text-blue-500" /> Upcoming Schedule</h3>
                        <div className="text-sm font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-xl">
                            {currentTime.toLocaleTimeString()}
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {schedule.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No classes scheduled currently.</p>
                        ) : schedule.map((cls) => {
                            const isLiveNow = canJoinClass(cls.scheduledAt);
                            const tTime = new Date(cls.scheduledAt).getTime();
                            const isPast = tTime + 2 * 60 * 60 * 1000 < currentTime.getTime();
                            return (
                                <div key={cls.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                    isLiveNow ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md' : 
                                    isPast ? 'border-gray-200 dark:border-gray-700 opacity-60' : 'border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10'
                                }`}>
                                    <div>
                                        <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{cls.title}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                                            <EventIcon sx={{fontSize: 16, mr: 0.5}}/> {new Date(cls.scheduledAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        {isPast ? (
                                            <span className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium text-sm">Ended</span>
                                        ) : isLiveNow ? (
                                            <button onClick={() => setActiveMeeting(cls.meetingLink)} className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition shadow-lg shadow-green-500/30 animate-pulse">Join Now</button>
                                        ) : (
                                            <span className="px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-medium text-sm">Starts soon</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Live Chat Panel */}
            <div className="w-full lg:w-96 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl flex flex-col overflow-hidden h-full min-h-[500px] border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">Live Chat</h3>
                    <div className="flex items-center text-xs text-green-600 dark:text-green-400 font-medium bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full"><Person sx={{fontSize: 14, mr: 0.5}}/> 124</div>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.length === 0 && <div className="text-center text-gray-400 text-sm mt-10">Say hello to the class!</div>}
                    {messages.map((msg, i) => (
                        <motion.div 
                            initial={{ opacity: 0, x: msg.sender === (localStorage.getItem('username') || 'You') ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={i} 
                            className={`flex flex-col ${msg.sender === (localStorage.getItem('username') || 'You') ? 'items-end' : 'items-start'}`}
                        >
                            <span className="text-[10px] text-gray-400 mb-1 font-medium">{msg.sender} • {msg.time}</span>
                            <div className={`px-4 py-2 text-sm rounded-2xl max-w-[85%] ${
                                msg.sender === 'System' 
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 text-xs text-center w-full my-2 italic'
                                : msg.sender === (localStorage.getItem('username') || 'You')
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-sm shadow-md'
                                : 'bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-tl-sm shadow-sm'
                            }`}>
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="p-4 bg-white/50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                        <input 
                            type="text" 
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Type a message..." 
                            disabled={!activeMeeting}
                            className="flex-1 bg-gray-100 dark:bg-gray-700 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-gray-100 disabled:opacity-50"
                        />
                        <button type="submit" disabled={!activeMeeting} className="w-12 h-[46px] bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-xl flex items-center justify-center text-white transition shadow-lg shadow-blue-500/30">
                            <Send fontSize="small" />
                        </button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default LiveClass;
