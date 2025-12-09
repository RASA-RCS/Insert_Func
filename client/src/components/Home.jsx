import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
            {/* Apply 'flex' and 'justify-between' to the parent div */}
            <div className='text-sm p-4 m-1 rounded flex justify-between bg-red-300'>

                {/* Home button on the left */}
                <button
                    className="font-medium  cursor-pointer bg-blue-400 rounded p-3 text-lg"
                >
                    Home
                </button>
                {/* Register button for MultiPle form on the right */}
                <button
                    className="font-medium  cursor-pointer bg-blue-400 rounded p-3 text-lg"
                    onClick={() => navigate("/multifrom")}
                >
                    Multi_From
                </button>
                {/* Registation form for the multiStep */}
                <button
                    className="font-medium  cursor-pointer bg-blue-400 rounded p-3 text-lg"
                    onClick={() => navigate("/multistep")}
                >
                    Multi_Step
                </button>



                {/* Register button on the right */}
                <button
                    className="font-medium  cursor-pointer bg-blue-400 rounded p-3 text-lg"
                    onClick={() => navigate("/register")}
                >
                    Register
                </button>


            </div>
        </>
    );
}