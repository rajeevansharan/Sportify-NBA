// Feature: User Authentication
// src/hooks/useAuth.ts
import { loadUser, setAuthStatus } from '@/src/redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/src/redux/store';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const authStatus = useAppSelector((state) => state.auth.status);

  // Use local state to track if the initial user load check is complete
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (user === null && authStatus === 'idle') {
        // Only run loadUser if no user is present and status is idle
        dispatch(loadUser()).finally(() => {
            setInitialLoad(false);
            // Ensure status is set to idle/succeeded after check, even if rejected
            dispatch(setAuthStatus(user ? 'succeeded' : 'idle')); 
        });
    } else if (authStatus !== 'loading') {
        setInitialLoad(false);
    }
  }, [dispatch, user, authStatus]);

  // isLoading is true during the initial check or during login/logout
  const isLoading = initialLoad || authStatus === 'loading';

  return { user, isLoading };
};