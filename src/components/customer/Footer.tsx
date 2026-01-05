import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

import type { RootState } from '../../redux/rootReducer';
import { customerNav, adminNav, managerNav } from '../../utils/navitems';

export default function Footer() {
  const { user } = useSelector((state: RootState) => state.auth);

  const role = user?.role || 'customer';
  const navItems =
    role === 'admin' ? adminNav : role === 'manager' ? managerNav : customerNav;

  return (
    <footer className="bg-green-50/50 mt-16 border-t border-green-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* BRAND */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link
              to={
                role === 'admin'
                  ? '/admin'
                  : role === 'manager'
                    ? '/manager'
                    : '/'
              }
              className="inline-block"
            >
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                Groc<span className="text-green-600">Eazy</span>
              </h2>
            </Link>

            <p className="text-gray-600 leading-relaxed max-w-sm">
              Fresh groceries delivered to your doorstep in minutes. We partner
              with local farmers to bring you the best quality organics and
              daily essentials.
            </p>

            <div className="flex gap-4 pt-2">
              <span className="p-2 bg-white rounded-full text-gray-500 hover:text-green-600 hover:shadow-md transition-all cursor-default">
                <Instagram className="w-5 h-5" />
              </span>
              <span className="p-2 bg-white rounded-full text-gray-500 hover:text-blue-500 hover:shadow-md transition-all cursor-default">
                <Twitter className="w-5 h-5" />
              </span>
              <span className="p-2 bg-white rounded-full text-gray-500 hover:text-blue-600 hover:shadow-md transition-all cursor-default">
                <Facebook className="w-5 h-5" />
              </span>
              <span className="p-2 bg-white rounded-full text-gray-500 hover:text-red-600 hover:shadow-md transition-all cursor-default">
                <Youtube className="w-5 h-5" />
              </span>
            </div>
          </div>

          {/* ✅ QUICK LINKS (DYNAMIC) */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-gray-600 hover:text-green-600 hover:translate-x-1 block transition-all w-fit"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span>
                  123 Green Street,
                  <br />
                  Fresh City, FC 12345
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5 text-green-600 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5 text-green-600 shrink-0" />
                {role === 'customer' ? (
                  <Link to="/contact" className="hover:text-green-600">
                    support@groceazy.com
                  </Link>
                ) : (
                  <span className="text-gray-600">support@groceazy.com</span>
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div
          className={`mt-12 pt-8 border-t border-green-200/50 flex flex-col md:flex-row ${
            role === 'customer' ? 'justify-between' : 'justify-center'
          } items-center gap-4`}
        >
          <p
            className={`text-gray-500 text-sm ${role !== 'customer' ? 'text-center' : ''}`}
          >
            © {new Date().getFullYear()} GrocEazy. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            {role === 'customer' && (
              <>
                <Link to="/privacy-policy" className="hover:text-green-600">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-green-600">
                  Terms of Service
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
