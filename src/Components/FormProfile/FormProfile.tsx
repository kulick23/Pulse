import React, { useState } from 'react';
import './FormProfile.scss';
import SliderBar from '../SliderBar/SliderBar';
import CompanyProfile from '../CompanyProfile/CompanyProfile';
import OrdersList from '../OrdersList/OrdersList';
import Support from '../Support/Support';
import CreateOrderModal from '../../popUps/CreateOrderModal/CreateOrderModal';
import DirectionsPopup from '../../popUps/DirectionsPopup/DirectionsPopup';
import { useGetCurrentUserQuery } from '../../redux/auth/api';
import { useSendRequestMutation } from '../../redux/order/api';

export const FormProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'company' | 'orders' | 'support'>(
    'company'
  );
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);

  const { data: currentUser, isLoading: userLoading } =
    useGetCurrentUserQuery();
  const [sendRequest, { isLoading: reqLoading }] = useSendRequestMutation();

  const openRequestModal = () => setIsRequestModalOpen(true);
  const closeRequestModal = () => setIsRequestModalOpen(false);
  const openDirections = () => setIsDirectionsOpen(true);
  const closeDirections = () => setIsDirectionsOpen(false);

  const handleSendRequest = async (formData: FormData) => {
    if (userLoading || !currentUser) return;
    try {
      await sendRequest(formData).unwrap();
      closeRequestModal();
    } catch (e) {
      console.error('Ошибка отправки запроса:', e);
    }
  };

  return (
    <div className="form-profile">
      <SliderBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCreateOrder={openRequestModal}
      />

      <div className="form-profile__content">
        {activeTab === 'company' && <CompanyProfile />}
        {activeTab === 'orders' && <OrdersList />}
        {activeTab === 'support' && <Support />}
      </div>

      <CreateOrderModal
        isOpen={isRequestModalOpen}
        onClose={closeRequestModal}
        onSendRequest={handleSendRequest}
        isLoading={reqLoading}
        onOpenDirections={openDirections}
      />
      <DirectionsPopup isOpen={isDirectionsOpen} onClose={closeDirections} />
    </div>
  );
};

export default FormProfile;
