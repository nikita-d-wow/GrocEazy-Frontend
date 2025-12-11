import React from 'react';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { googleLogin } from '../../redux/actions/authActions';

const GoogleAuthButton: React.FC = () => {
    const dispatch = useDispatch<any>();

    const handleSuccess = (credentialResponse: any) => {
        dispatch(googleLogin(credentialResponse.credential));
    };

    const handleError = () => {
        console.error('Google Sign-In failed');
    };

    return (
        <div className="w-full mt-4 flex justify-center">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap
                width="350"
                shape="rectangular"
                theme="outline"
            />
        </div>
    );
};

export default GoogleAuthButton;
