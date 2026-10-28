import React from 'react';
import './CompanyProfile.scss';
import FormInput from '../FormInput/FormInput';
import { t, useCompanyProfile } from '../../Hooks';
import { COMPANY_PLACEHOLDERS } from '../../Constants/companyProfile';

export const CompanyProfile: React.FC = () => {
  const { companyData, handleInputChange, handleTextAreaChange, handleSubmit } =
    useCompanyProfile();

  return (
    <div className="company-profile">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <FormInput
              type="text"
              label={t('profile.companyInfo.companyName')}
              value={companyData.companyName}
              onChange={handleInputChange('companyName')}
              placeholder={t('profile.companyInfo.companyName')}
            />
          </div>

          <div className="form-group">
            <FormInput
              type="inn"
              label={t('profile.companyInfo.inn')}
              value={companyData.inn}
              onChange={handleInputChange('inn')}
              placeholder={COMPANY_PLACEHOLDERS.inn}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <FormInput
              type="text"
              label={t('profile.companyInfo.manager')}
              value={companyData.manager}
              onChange={handleInputChange('manager')}
              placeholder={t('registration.directorPlaceholder')}
            />
          </div>

          <div className="form-group">
            <FormInput
              type="email"
              label={t('profile.companyInfo.email')}
              value={companyData.email}
              onChange={handleInputChange('email')}
              placeholder={COMPANY_PLACEHOLDERS.email}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <FormInput
              type="text"
              label={t('profile.companyInfo.phone')}
              value={companyData.phone}
              onChange={handleInputChange('phone')}
              placeholder={COMPANY_PLACEHOLDERS.phone}
            />
          </div>

          <div className="form-group">
            <FormInput
              type="text"
              label={t('profile.companyInfo.website')}
              value={companyData.website}
              onChange={handleInputChange('website')}
              placeholder={COMPANY_PLACEHOLDERS.website}
            />
          </div>
        </div>

        <div className="form-group full-width">
          <FormInput
            type="text"
            label={t('profile.companyInfo.address')}
            value={companyData.address}
            onChange={handleInputChange('address')}
            placeholder={COMPANY_PLACEHOLDERS.address}
          />
        </div>

        <div className="form-group full-width">
          <label className="Registration__form--title">
            {t('profile.companyInfo.activity')}
          </label>
          <textarea
            name="activity"
            placeholder={t('profile.companyInfo.activityPlaceholder')}
            value={companyData.activity}
            onChange={handleTextAreaChange('activity')}
            className="registration__input"
          />
        </div>

        <div className="form-group full-width">
          <label className="Registration__form--title">
            {t('profile.companyInfo.note')}
          </label>
          <FormInput
            name="note"
            placeholder={t('profile.companyInfo.notePlaceholder')}
            value={companyData.note}
            onChange={handleTextAreaChange('note')}
            className="registration__input"
          />
        </div>

        <button type="submit" className="order-button">
          {t('profile.companyInfo.save')}
        </button>
      </form>
    </div>
  );
};

export default CompanyProfile;
