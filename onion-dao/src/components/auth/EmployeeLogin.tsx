import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AuthForm.css';

interface EmployeeLoginProps {
  isSignUp: boolean;
  onBack: () => void;
  onToggleMode?: () => void;
}

const EmployeeLogin: React.FC<EmployeeLoginProps> = ({ isSignUp, onBack, onToggleMode }) => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    employeeName: '',
    corporationId: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Form submitted:', { isSignUp, email: formData.email });
      
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        if (!formData.employeeName.trim()) {
          throw new Error('Employee name is required');
        }
        
        if (!formData.corporationId.trim()) {
          throw new Error('Corporation ID is required');
        }
        
        console.log('Attempting sign up...');
        const profile = await signUp(formData.email, formData.password, 'employee', {
          employeeName: formData.employeeName,
          corporationId: formData.corporationId
        });
        console.log('Sign up successful, profile:', profile);
        
        // Redirect to dashboard after successful signup
        console.log('Navigating to dashboard...');
        navigate('/dashboard');
      } else {
        console.log('Attempting sign in...');
        await signIn(formData.email, formData.password);
        console.log('Sign in successful');
        
        // Add a small delay to allow profile to be created/loaded
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirect to dashboard after successful signin
        console.log('Navigating to dashboard...');
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      
      // Handle specific Firebase errors
      let errorMessage = err.message;
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <button className="back-btn" onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
            </svg>
            Back
          </button>
          <div className="auth-logo">
            <div className="logo-icon">👤</div>
            <span className="auth-title">Employee {isSignUp ? 'Sign Up' : 'Sign In'}</span>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <div className="form-group">
                <label htmlFor="employeeName">Full Name</label>
                <input
                  type="text"
                  id="employeeName"
                  value={formData.employeeName}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="corporationId">Corporation ID</label>
                <input
                  type="text"
                  id="corporationId"
                  value={formData.corporationId}
                  onChange={(e) => setFormData({ ...formData, corporationId: e.target.value })}
                  required
                  placeholder="Enter your corporation ID"
                />
                <small className="form-help">Ask your employer for the Corporation ID</small>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                placeholder="Confirm your password"
                minLength={6}
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Processing...' : isSignUp ? 'Create Employee Account' : 'Sign In to Employee Portal'}
          </button>
        </form>

        <div className="auth-toggle">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button type="button" className="toggle-btn" onClick={onToggleMode}>
                Sign In Instead
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button type="button" className="toggle-btn" onClick={onToggleMode}>
                Create Account
              </button>
            </p>
          )}
        </div>

        <div className="auth-features">
          <h4>Employee Features:</h4>
          <ul>
            <li>Receive private payroll payments</li>
            <li>View transaction history</li>
            <li>Secure wallet management</li>
            <li>Real-time payment notifications</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin; 