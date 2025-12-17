import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/rootReducer';
import { customerNav, adminNav, managerNav } from '../../utils/navitems';

const Footer = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role || 'customer';

  // SAME LOGIC AS HEADER
  const navItems =
    role === 'admin' ? adminNav : role === 'manager' ? managerNav : customerNav;

  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 mt-20">
      {/* CONTENT CONTAINER */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* BRAND */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">GrocEazy</h2>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              Fresh groceries delivered to your doorstep. Shop smart. Shop easy.
            </p>
          </div>

          {/* QUICK LINKS (ROLE BASED) */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-gray-600 hover:text-primary transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Support
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link to="/contact" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Legal
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link to="/privacy" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="w-full border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} GrocEazy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
