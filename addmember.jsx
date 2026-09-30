import React, { useState } from 'react';
import { UserPlus, Copy, Check } from 'lucide-react';

const AddMember = () => {
    const [email, setEmail] = useState('');
    const [copied, setCopied] = useState(false);

    const handleInvite = async (e) => {
        e.preventDefault();
        // CALL YOUR FASTAPI BACKEND HERE
        console.log("Sending invite to:", email);
    };

    return (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <UserPlus size={18} className="text-blue-500" /> Invite Friends
            </h3>
            <form onSubmit={handleInvite} className="flex gap-2">
                <input
                    type="email"
                    placeholder="friend@example.com"
                    className="bg-slate-800 text-white p-2 rounded-lg w-full outline-none border border-slate-700"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Invite</button>
            </form>

            <div className="mt-4 p-3 bg-slate-950 rounded-lg flex justify-between items-center text-slate-400 text-sm">
                <span>tradestart.ai/join/xyz123</span>
                <button onClick={() => setCopied(true)} className="hover:text-white">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
            </div>
        </div>
    );
};