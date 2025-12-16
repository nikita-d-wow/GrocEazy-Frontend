import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-green-50/50 mt-16 border-t border-green-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="text-3xl transition-transform group-hover:scale-110">
                🥬
              </div>
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center">
                Groc<span className="text-green-600">Eazy</span>
              </h2>
            </Link>

            <p className="text-gray-600 leading-relaxed max-w-sm">
              Fresh groceries delivered to your doorstep in minutes. We partner
              with local farmers to bring you the best quality organics and
              daily essentials.
            </p>

            <div className="flex gap-4 pt-2">
              <a
                href="#"
                className="p-2 bg-white rounded-full text-gray-500 hover:text-green-600 hover:shadow-md transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-white rounded-full text-gray-500 hover:text-blue-500 hover:shadow-md transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-white rounded-full text-gray-500 hover:text-blue-600 hover:shadow-md transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-white rounded-full text-gray-500 hover:text-red-600 hover:shadow-md transition-all"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-green-600 hover:translate-x-1 block transition-all w-fit"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-600 hover:text-green-600 hover:translate-x-1 block transition-all w-fit"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-gray-600 hover:text-green-600 hover:translate-x-1 block transition-all w-fit"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-gray-600 hover:text-green-600 hover:translate-x-1 block transition-all w-fit"
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
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
                <Link to="/contact" className="hover:text-green-600">
                  support@groceazy.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-green-200/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} GrocEazy. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-green-600">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-green-600">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
