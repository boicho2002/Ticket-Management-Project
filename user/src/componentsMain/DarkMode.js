import { useState, useEffect } from 'react';
export function useDarkMode() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [icon, setIcon] = useState('🔆');
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode');
        
        setIsDarkMode(savedDarkMode === 'true');
        
    }, []);
    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        if (isDarkMode) {
            setIcon('🌙');
        }
        else {
            setIcon('🔆')
        }
        localStorage.setItem('darkMode', newDarkMode.toString());
       
    };
    return [isDarkMode, toggleDarkMode, icon];
}
