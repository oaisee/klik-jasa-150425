
import { useState, useEffect } from 'react';

export const useEmailStorage = () => {
  const [previousEmails, setPreviousEmails] = useState<string[]>([]);
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);

  useEffect(() => {
    const fetchPreviousEmails = () => {
      try {
        const storedEmails = localStorage.getItem('previousEmails');
        if (storedEmails) {
          setPreviousEmails(JSON.parse(storedEmails));
        }
      } catch (error) {
        console.error('Error fetching previous emails:', error);
      }
    };
    
    fetchPreviousEmails();
  }, []);

  const saveEmailToStorage = (email: string) => {
    try {
      let emails = [...previousEmails];
      emails = emails.filter(e => e !== email);
      emails.unshift(email);
      if (emails.length > 5) {
        emails = emails.slice(0, 5);
      }
      localStorage.setItem('previousEmails', JSON.stringify(emails));
      setPreviousEmails(emails);
    } catch (error) {
      console.error('Error saving email to storage:', error);
    }
  };

  return {
    previousEmails,
    showEmailSuggestions,
    setShowEmailSuggestions,
    saveEmailToStorage
  };
};
