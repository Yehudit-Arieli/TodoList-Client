// import axios from 'axios';

// // הגדרת הכתובת של ה-API שלך כברירת מחדל
// axios.defaults.baseURL = "http://localhost:5260";

// // Interceptor לרישום שגיאות (דרישה מהמטלה)
// axios.interceptors.response.use(
//     response => response,
//     error => {
//         console.error('API Error:', error.response ? error.response.data : error.message);
//         return Promise.reject(error);
//     }
// );

// export default {
//     getTasks: async () => {
//         const result = await axios.get('/items');    
//         return result.data;
//     },

//     addTask: async (name) => {
//         // הוספת משימה חדשה ל-API
//         const result = await axios.post('/items', { name, isComplete: false });
//         return result.data;
//     },

//  // בתוך קובץ src/service.js ב-React
// setCompleted: async (id, name, isComplete) => {
//   // אנחנו שולחים גם את ה-name וגם את ה-isComplete החדש
//   const result = await axios.put(`/items/${id}`, { 
//     name: name, 
//     isComplete: isComplete 
//   });
//   return result.data;
// },
//     deleteTask: async (id) => {
//         // מחיקת משימה מה-API
//         const result = await axios.delete(`/items/${id}`);
//         return result.data;
//     }
// };

import axios from 'axios';

// 1. הגדרת ה-BaseURL
const apiUrl = "http://localhost:5260";
axios.defaults.baseURL = apiUrl;

// 2. ה-Interceptor חייב להיות מוגדר כאן, לפני הכל!
axios.interceptors.request.use(config => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        console.log("Interceptor: Found token, adding to header..."); // בדיקה ב-Console
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.log("Interceptor: No token found in localStorage.");
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// 3. הגדרת האובייקט עם הפונקציות
const apiClient = {
    login: async (username, password) => {
        const result = await axios.post('/login', { username, password });
        localStorage.setItem("accessToken", result.data.token);
        return result.data;
    },

    getTasks: async () => {
        const result = await axios.get('/items');    
        return result.data;
    },

    addTask: async (name) => {
        const result = await axios.post('/items', { name, isComplete: false });
        return result.data;
    },

    setCompleted: async (id, name, isComplete) => {
        const result = await axios.put(`/items/${id}`, { name, isComplete });
        return result.data;
    },

    deleteTask: async (id) => {
        const result = await axios.delete(`/items/${id}`);
        return result.data;
    }
};

// 4. ה-export בסוף
export default apiClient;