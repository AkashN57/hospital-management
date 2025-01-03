import React from 'react';

const ChatPopup = () => {
    const handleOpenChat = () => {
        window.open('http://localhost:5175/', '_blank');
    };

    return (
        <div className="fixed bottom-4 right-4">
            <button 
                onClick={handleOpenChat} 
                className="bg-green-500 text-white px-4 py-2 rounded-full"
            >
                Open Customer Care App
            </button>
        </div>
    );
};

export default ChatPopup;
