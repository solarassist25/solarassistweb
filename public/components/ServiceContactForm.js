// components/ServiceContactForm.js - Simple contact form for service provider
import { useState } from 'react';

export default function ServiceContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  
  const [status, setStatus] = useState(''); // '', 'sending', 'success', 'error'
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setMessage('');

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: ''
        });
      } else {
        setStatus('error');
        setMessage(result.error || 'Something went wrong!');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Contact SolarAssist</h2>
      <p>Get expert solar service consultation</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          name="name"
          placeholder="Your Name *"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ padding: '12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' }}
        />
        
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number *"
          value={formData.phone}
          onChange={handleChange}
          required
          style={{ padding: '12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' }}
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email Address *"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ padding: '12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' }}
        />
        
        <textarea
          name="message"
          placeholder="How can we help you? (e.g., Solar system maintenance, Consultation, Repair services, etc.)"
          value={formData.message}
          onChange={handleChange}
          rows="4"
          required
          style={{ padding: '12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px', fontFamily: 'inherit' }}
        />
        
        <button 
          type="submit" 
          disabled={status === 'sending'}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            backgroundColor: status === 'sending' ? '#ccc' : '#2E8B57',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: status === 'sending' ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {status === 'sending' ? 'Sending...' : 'Get Service Quote'}
        </button>
      </form>

      {message && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          borderRadius: '5px',
          backgroundColor: status === 'success' ? '#d4edda' : '#f8d7da',
          color: status === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${status === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          fontSize: '16px'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}
