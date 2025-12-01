import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
            {/* Apply 'flex' and 'justify-between' to the parent div */}
            <div className='text-sm p-2 flex justify-between'> 
                
                {/* Home button on the left */}
                <button
                    className="font-medium  cursor-pointer "
                >
                    Home
                </button>
                
                {/* Register button on the right */}
                <button
                    className="font-medium underline cursor-pointer"
                    onClick={() => navigate("/register")}
                >
                    Register
                </button>
            </div>
        </>
    );
}