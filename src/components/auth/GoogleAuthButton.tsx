import React from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { googleLogin } from '../../redux/actions/authActions';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../../redux/actions/useDispatch';

const GoogleAuthButton: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      dispatch(googleLogin(credentialResponse.credential));
    }
  };

  const handleError = () => {
    toast.error('Google Sign-In failed');
  };

  return (
    <div className="w-full mt-4 flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        width="350"
        shape="rectangular"
        theme="outline"
      />
    </div>
  );
};

export default GoogleAuthButton;
