import { React, useState } from 'react';

export interface CompanyData {
  companyName: string;
  inn: string;
  manager: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  activity: string;
  note: string;
}

export const initialCompanyData: CompanyData = {
  companyName: '',
  inn: '',
  manager: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  activity: '',
  note: '',
};

type ChangeHandler<E, K extends keyof CompanyData> = (
  field: K
) => (e: React.ChangeEvent<E>) => void;

export const useCompanyProfile = () => {
  const [companyData, setCompanyData] =
    useState<CompanyData>(initialCompanyData);

  const handleInputChange: ChangeHandler<HTMLInputElement, keyof CompanyData> =
    (field) => (e) => {
      setCompanyData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleTextAreaChange: ChangeHandler<
    HTMLTextAreaElement,
    keyof CompanyData
  > = (field) => (e) => {
    setCompanyData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Сохранено:', companyData);
    // TODO: тут отправка на сервер
  };

  return { companyData, handleInputChange, handleTextAreaChange, handleSubmit };
};
