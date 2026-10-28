import React, { useEffect } from 'react';
import { useAppDispatch, setUser, setTokens, UserDto } from '../../redux';
import {
  getItem,
  getObject,
  isLocalStorageAvailable,
  STORAGE_KEYS,
} from '../../utils';

const SessionRestorer: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLocalStorageAvailable()) return;

    const accessToken = getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken = getItem(STORAGE_KEYS.REFRESH_TOKEN);
    const userData = getObject<UserDto>(STORAGE_KEYS.USER_DATA);

    if (accessToken && refreshToken) {
      dispatch(
        setTokens({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
      );

      if (userData) {
        dispatch(setUser(userData));
      }
    }
  }, [dispatch]);

  return null;
};

export default SessionRestorer;
