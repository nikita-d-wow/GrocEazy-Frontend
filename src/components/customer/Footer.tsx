export default function Footer() {
  return (
    <footer className="bg-[#F1FAF4] mt-16 pt-12 pb-6 border-t border-gray-200">
      {/* Apply padding to entire footer content */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-bold text-green-600">GROCEAZY</h2>

            <p className="text-gray-600 mt-4 leading-relaxed">
              We deliver fresh groceries and snacks straight to your door.
              Trusted by thousands, we aim to make your shopping experience
              simple and affordable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <a href="#" className="hover:text-green-600">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600">
                  Best Sellers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600">
                  Offers & Deals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Need Help */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Need help?</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <a href="#" className="hover:text-green-600">
                  Delivery Information
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600">
                  Return & Refund Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600">
                  Payment Methods
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600">
                  Track your Order
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <a href="#" className="hover:text-green-600">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-gray-300"></div>

        {/* Bottom Text */}
        <p className="text-center text-gray-600 mt-4">
          Copyright © {new Date().getFullYear()} All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
