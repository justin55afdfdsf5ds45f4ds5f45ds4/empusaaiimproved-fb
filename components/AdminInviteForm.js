// components/AdminInviteForm.js
// COPY-PASTE THIS ENTIRE FILE

import React, { useState } from 'react';
import { httpsCallable } from "firebase/functions";
import { functions } from '../lib/firebase'; // Imports from the file we just created

function AdminInviteForm() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInvite = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        const sendInvitation = httpsCallable(functions, 'sendInvitation');
        try {
            const result = await sendInvitation({ email });
            setMessage(result.data.message);
            setEmail('');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Send New Invitation</h2>
            <form onSubmit={handleInvite}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter user's email" required />
                <button type="submit" disabled={isLoading}>{isLoading ? 'Sending...' : 'Send Invite'}</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
export default AdminInviteForm;
