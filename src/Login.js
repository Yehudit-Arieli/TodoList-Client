import React, { useState } from 'react';
import service from './service';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await service.login(username, password);
            onLogin(); // פונקציה שתגיד לאפליקציה שהתחברנו בהצלחה
        } catch (error) {
            alert("שם משתמש או סיסמה שגויים");
        }
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ccc", width: "300px", margin: "20px auto" }}>
            <h2>התחברות</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="שם משתמש" value={username} onChange={(e) => setUsername(e.target.value)} /><br/><br/>
                <input type="password" placeholder="סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} /><br/><br/>
                <button type="submit">כניסה</button>
            </form>
        </div>
    );
}

export default Login;