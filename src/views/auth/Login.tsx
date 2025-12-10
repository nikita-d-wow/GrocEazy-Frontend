// src/views/auth/Login.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/actions/authActions';
import type { RootState } from '../../redux/rootReducer';
import { useNavigate } from 'react-router-dom';

type FormState = {
  email: string;
  password: string;
};

const EmailField: React.FC<{
  value: string;
  onChange: (v: string) => void;
  error?: string;
}> = ({ value, onChange, error }) => (
  <div
    className="min-h-screen flex items-center justify-center bg-gray-50 p-6"
    style={{ outline: '6px solid magenta' }}
  >
    <label className="block text-sm font-medium mb-1">Email</label>
    <input
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full p-3 border rounded ${error ? 'border-red-500' : 'border-gray-200'}`}
      placeholder="you@example.com"
      aria-label="email"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const PasswordField: React.FC<{
  value: string;
  onChange: (v: string) => void;
  error?: string;
}> = ({ value, onChange, error }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Password</label>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-3 border rounded ${error ? 'border-red-500' : 'border-gray-200'}`}
          placeholder="Enter your password"
          aria-label="password"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-2 text-sm text-gray-500"
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

const Login: React.FC = () => {
  // useDispatch<any>() keeps typing simple and avoids pulling redux-thunk types
  // console.log("Login component mounted"); // debug - remove later

  const dispatch = useDispatch<any>();

  const navigate = useNavigate();
  const auth = useSelector((s: RootState) => s.auth);

  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const [formError, setFormError] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const validate = (): boolean => {
    const errs: typeof formError = {};

    if (!form.email) {
      errs.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = 'Enter a valid email';
    }

    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }

    setFormError(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setFormError({});

    if (!validate()) {
      return;
    }

    dispatch(login({ email: form.email, password: form.password }) as any);
  };

  React.useEffect(() => {
    if (!auth.loading && auth.accessToken && auth.user) {
      if (auth.user.role === 'admin') {
        navigate('/admin');
      } else if (auth.user.role === 'manager') {
        navigate('/manager');
      } else {
        navigate('/');
      }
    } else if (!auth.loading && auth.error) {
      setFormError((s) => ({
        ...s,
        general: auth.error || 'Login failed',
      }));
    }
  }, [auth, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Login to your account
        </h1>

        {formError.general && (
          <div className="mb-4 text-red-600 text-sm">{formError.general}</div>
        )}

        <form onSubmit={onSubmit} noValidate>
          <EmailField
            value={form.email}
            onChange={(v) => setForm((s) => ({ ...s, email: v }))}
            error={formError.email}
          />
          <PasswordField
            value={form.password}
            onChange={(v) => setForm((s) => ({ ...s, password: v }))}
            error={formError.password}
          />

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
            disabled={auth.loading}
          >
            {auth.loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          <span>Don't have an account? </span>
          <a href="/register" className="text-green-600">
            Create one
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
