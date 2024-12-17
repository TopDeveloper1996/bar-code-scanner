import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (!/\d/.test(password)) {
      setError('Password must contain at least one number');
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${config.apiUrl}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleAppleSignup = () => {
    window.location.href = 'http://localhost:5000/api/auth/apple';
  };

  return (
    <div className="flex flex-col min-h-screen bg-white p-4">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="w-16 h-16 bg-blue-100 rounded-xl mb-6" />
        
        <h1 className="text-2xl font-semibold mb-8">Create Account</h1>

        {/* Signup Form */}
        <form onSubmit={handleEmailSignup} className="w-full space-y-4 mb-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-b border-gray-300 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-b border-gray-300 focus:border-blue-500 outline-none"
              required
              minLength={6}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border-b border-gray-300 focus:border-blue-500 outline-none"
              required
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button
            type="submit"
            className="w-full py-3 bg-blue-200 text-blue-800 rounded-full font-medium 
              hover:bg-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign up with Email'}
          </button>
        </form>

        <button
          onClick={() => navigate('/login')}
          className="text-gray-600 mb-8"
        >
          Already have an account? <span className="text-black">Login here!</span>
        </button>

        {/* Social Signup Buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={handleAppleSignup}
            className="w-full py-3 border border-gray-300 rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <svg viewBox="0 0 384 512" className="w-5 h-5">
              <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
            </svg>
            Continue with Apple
          </button>
          
          <button
            onClick={handleGoogleSignup}
            className="w-full py-3 border border-gray-300 rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
