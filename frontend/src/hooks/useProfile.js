import { useState, useEffect, useCallback } from 'react';
import {
  getProfile,
  updateProfile,
  updatePassword,
  uploadAvatar,
  deleteAvatar,
} from '../api/users.js';

export function useProfile() {
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveProfile = useCallback(async (fields, verifyPassword, reauthToken) => {
    const payload = { ...fields };
    if (verifyPassword) payload.currentPassword = verifyPassword;
    if (reauthToken)    payload.reauthToken      = reauthToken;
    const res = await updateProfile(payload);
    setProfile(prev => ({ ...prev, ...res.user }));
    return res;
  }, []);

  const savePassword = useCallback(async (currentPassword, newPassword) => {
    return updatePassword({ currentPassword, newPassword });
  }, []);

  const changeAvatar = useCallback(async (file) => {
    const res = await uploadAvatar(file);
    setProfile(prev => ({ ...prev, avatar: res.avatar }));
    return res;
  }, []);

  const removeAvatar = useCallback(async () => {
    await deleteAvatar();
    setProfile(prev => ({ ...prev, avatar: null }));
  }, []);

  return { profile, loading, error, saveProfile, savePassword, changeAvatar, removeAvatar, refresh: load };
}
