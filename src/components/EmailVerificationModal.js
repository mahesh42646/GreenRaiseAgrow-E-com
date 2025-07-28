'use client';

import { useState, useEffect, useCallback } from 'react';
import { emailVerificationAPI } from '../services/api';

export default function EmailVerificationModal({ 
  isOpen, 
  onClose, 
  email, 
  name, 
  onVerificationSuccess 
}) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (isOpen && email) {
      sendVerificationEmail();
    }
  }, [isOpen, email, sendVerificationEmail]);

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, canResend]);

  const sendVerificationEmail = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await emailVerificationAPI.sendVerificationEmail(email, name);
      setSuccess('Verification email sent successfully!');
      setTimeLeft(600); // 10 minutes
      setCanResend(false);
    } catch (err) {
      console.error('Email verification error:', err);
      if (err.message && err.message.includes('Too many verification requests')) {
        setError('Too many verification requests. Please wait 1 hour before trying again.');
      } else {
        setError(err.message || 'Failed to send verification email. Please check your email address and try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [email, name]);

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const result = await emailVerificationAPI.verifyOTP(email, otp);
      
      if (result.verified) {
        setSuccess('Email verified successfully!');
        setTimeout(() => {
          onVerificationSuccess();
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.message || 'Invalid OTP. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      setLoading(true);
      setError('');
      
      await emailVerificationAPI.resendOTP(email);
      setSuccess('New verification code sent!');
      setTimeLeft(600); // 10 minutes
      setCanResend(false);
      setOtp('');
    } catch (err) {
      console.error('Resend OTP error:', err);
      if (err.message && err.message.includes('Too many verification requests')) {
        setError('Too many verification requests. Please wait 1 hour before trying again.');
      } else {
        setError(err.message || 'Failed to resend verification code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">Verify Your Email</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="text-center mb-4">
              <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-envelope fs-2 text-primary"></i>
              </div>
              <h6 className="mb-2">Check your email</h6>
              <p className="text-muted mb-0">
                We&apos;ve sent a verification code to<br />
                <strong>{email}</strong>
              </p>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="otpInput" className="form-label fw-semibold">
                Enter 6-digit verification code
              </label>
              <input
                type="text"
                className="form-control form-control-lg text-center fw-bold fs-4"
                id="otpInput"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength="6"
                disabled={loading}
                style={{ letterSpacing: '0.5em' }}
              />
            </div>

            <div className="d-grid mb-3">
              <button
                type="button"
                className="btn btn-lg"
                style={{ backgroundColor: '#08A486', color: 'white' }}
                onClick={verifyOTP}
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                ) : (
                  <i className="bi bi-check-circle me-2"></i>
                )}
                Verify Email
              </button>
            </div>

            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-muted mb-2">
                  Resend code in <strong>{formatTime(timeLeft)}</strong>
                </p>
              ) : canResend ? (
                <button
                  type="button"
                  className="btn btn-link text-decoration-none"
                  onClick={resendOTP}
                  disabled={loading}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Resend verification code
                </button>
              ) : null}
            </div>

            <div className="text-center mt-3">
              <small className="text-muted">
                Didn&apos;t receive the email? Check your spam folder or try a different email address.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 