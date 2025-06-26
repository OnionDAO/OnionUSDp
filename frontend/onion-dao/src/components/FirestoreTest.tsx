import React, { useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const FirestoreTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Ready to test');
  const [loading, setLoading] = useState(false);

  const testFirestore = async () => {
    setLoading(true);
    setStatus('Testing Firestore connection...');

    try {
      // Test writing to Firestore
      const testDocRef = doc(db, 'test', 'connection-test');
      await setDoc(testDocRef, {
        message: 'Hello Firestore!',
        timestamp: new Date(),
        testId: Math.random().toString(36).substr(2, 9)
      });
      
      setStatus('✅ Write successful! Testing read...');

      // Test reading from Firestore
      const docSnap = await getDoc(testDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStatus(`✅ Firestore connection successful! Data: ${data.message}`);
      } else {
        setStatus('❌ Document was written but could not be read');
      }
    } catch (error: any) {
      console.error('Firestore test error:', error);
      setStatus(`❌ Firestore error: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <div style={{ 
      padding: '2rem', 
      background: 'rgba(255,255,255,0.1)', 
      margin: '2rem', 
      borderRadius: '8px',
      color: 'white'
    }}>
      <h3>🔧 Firestore Connection Test</h3>
      <p>Status: {status}</p>
      <button 
        onClick={testFirestore}
        disabled={loading}
        style={{
          padding: '10px 20px',
          background: loading ? '#666' : '#4A90E2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Firestore Connection'}
      </button>
      
      <div style={{ marginTop: '1rem', fontSize: '0.9em' }}>
        <p><strong>If you see errors:</strong></p>
        <ol>
          <li>Go to Firebase Console → Firestore Database</li>
          <li>Create database in test mode if not exists</li>
          <li>Check that rules allow read/write</li>
          <li>Clear browser cache and try again</li>
        </ol>
      </div>
    </div>
  );
};

export default FirestoreTest; 