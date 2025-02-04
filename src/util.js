export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log('API_BASE_URL:', API_BASE_URL);
import { useState, useEffect } from "react"; 
export const useLocalStorage = (key, defaultValue) => { 
    const [value, setValue] = useState(() => { 
        const currentValue = localStorage.getItem(key); 
        if (currentValue) { 
            return JSON.parse(currentValue) 
        } 
        else { 
            return defaultValue; 
        } 
    }); 
    useEffect(() => { 
        localStorage.setItem(key, JSON.stringify(value)); 
    }, [value]); 
    return [value, setValue]; 
};