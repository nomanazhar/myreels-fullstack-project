'use client';
import React, { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
// import { NextResponse } from 'next/server'; dont use nextresponse in client components
const RegisterPage: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [emailExists, setEmailExists] = useState<boolean | null>(null);
    const [loading , setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        if (formData.password !== formData.confirmPassword) {
            // Handle password mismatch
            setError("Passwords do not match");
            return;
        }
        if(emailExists){
            setError("Email is already taken");
            return;
        }
        try {
             setLoading(true);
            await axios.post('/api/auth/register', formData);
            router.push('/login');
        } catch (error :any) {
            // Handle registration error
            setError(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
            // return; this is unnecessary your finally block will handle it
        }
    };

    const timerref = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setEmailExists(null);
        if (formData.email && formData.email.length >=5) {
            if (timerref.current) {
                clearTimeout(timerref.current);
            }
            timerref.current = setTimeout(async () => {
                try {
                    // await dbConnect();   never call database from client components
                    const response = await axios.post('/api/check-email', { email: formData.email });
                    setEmailExists(response.data.exists);
                } catch (error) {
                    setEmailExists(false);
                }
            }, 500);
        }
        return () => {
            if (timerref.current) {
                clearTimeout(timerref.current);
            }
        };
    }, [formData.email]);

    return (
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
            />
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
            />
            <div style={{ minHeight: '24px' }} className='text-sm'>
                {emailExists === true && <p style={{ color: 'red' }}>Email is already taken</p>}
                {emailExists === false && <p style={{ color: 'green' }}>Email is available</p>}
            </div>  
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
            />
            <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
            </button>
        </form>
    );
};
export default RegisterPage;