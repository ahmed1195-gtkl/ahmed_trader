import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { brokersData } from '../data/brokers';

export const useBrokers = (language = 'en') => {
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For demo purposes, we'll use the static data
  // In production, this would fetch from Firebase
  useEffect(() => {
    const loadBrokers = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use static data for demo
        const brokerList = brokersData[language] || brokersData.en;
        setBrokers(brokerList);
        
        setError(null);
      } catch (err) {
        console.error('Error loading brokers:', err);
        setError('Failed to load brokers');
        
        // Fallback to static data
        const brokerList = brokersData[language] || brokersData.en;
        setBrokers(brokerList);
      } finally {
        setLoading(false);
      }
    };

    loadBrokers();
  }, [language]);

  // Function to add a new broker (for admin use)
  const addBroker = async (brokerData) => {
    try {
      // In production, this would add to Firebase
      const docRef = await addDoc(collection(db, 'brokers'), {
        ...brokerData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Update local state
      setBrokers(prev => [...prev, { id: docRef.id, ...brokerData }]);
      
      return docRef.id;
    } catch (err) {
      console.error('Error adding broker:', err);
      throw err;
    }
  };

  // Function to update a broker (for admin use)
  const updateBroker = async (brokerId, updates) => {
    try {
      // In production, this would update Firebase
      const brokerRef = doc(db, 'brokers', brokerId);
      await updateDoc(brokerRef, {
        ...updates,
        updatedAt: new Date()
      });
      
      // Update local state
      setBrokers(prev => 
        prev.map(broker => 
          broker.id === brokerId 
            ? { ...broker, ...updates }
            : broker
        )
      );
    } catch (err) {
      console.error('Error updating broker:', err);
      throw err;
    }
  };

  // Function to delete a broker (for admin use)
  const deleteBroker = async (brokerId) => {
    try {
      // In production, this would delete from Firebase
      await deleteDoc(doc(db, 'brokers', brokerId));
      
      // Update local state
      setBrokers(prev => prev.filter(broker => broker.id !== brokerId));
    } catch (err) {
      console.error('Error deleting broker:', err);
      throw err;
    }
  };

  return {
    brokers,
    loading,
    error,
    addBroker,
    updateBroker,
    deleteBroker
  };
};

