import { React, useState } from 'react';
import {
  CONTACT_METHODS,
  CONTACT_PLACEHOLDERS,
  ContactMethod,
} from '../Constants/contact';

export const useContactForm = () => {
  const [contactMethod, setContactMethod] = useState<ContactMethod>('email');
  const [fileName, setFileName] = useState(CONTACT_PLACEHOLDERS.name + '.pdf');

  const selectContactMethod = (method: ContactMethod) => {
    setContactMethod(method);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  return {
    CONTACT_METHODS,
    contactMethod,
    selectContactMethod,
    fileName,
    handleFileChange,
  };
};
