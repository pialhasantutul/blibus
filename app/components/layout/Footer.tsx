import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1B5E37' }} className="text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">Blibus</h3>
            <p className="text-green-200 text-sm mb-3">
              Bangladesh এর সবচেয়ে smart e-commerce platform।
            </p>
            <p className="text-green-200 text-sm">📍 Mirpur-2, Dhaka</p>
            <p className="text-green-200 text-sm">📞 +880 1234-567890</p>
            <p className="text-green-200 text-sm">✉️ support@blibus.com</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">About</h4>
            {['About Us', 'Privacy Policy', 'Cookie Policy', 'Terms & Conditions', 'Why Shop With Us'].map((item) => (
              <p key={item} className="text-green-200 text-sm mb-2 hover:text-white cursor-pointer transition">{item}</p>
            ))}
          </div>

          <div>
            <h4 className="font-bold mb-4">Help</h4>
            {['Payment', 'Shipping', 'Return & Replacement', 'Chat With Us', 'Blibus Support'].map((item) => (
              <p key={item} className="text-green-200 text-sm mb-2 hover:text-white cursor-pointer transition">{item}</p>
            ))}
          </div>

          <div>
            <h4 className="font-bold mb-4">Download App</h4>
            <div className="bg-black text-white text-sm px-4 py-3 rounded-lg mb-3 cursor-pointer hover:bg-gray-800 transition flex items-center gap-2">
              <span>▶</span> Google Play
            </div>
            <div className="bg-black text-white text-sm px-4 py-3 rounded-lg mb-3 cursor-pointer hover:bg-gray-800 transition flex items-center gap-2">
              <span></span> App Store
            </div>
            <div className="flex gap-3 mt-4">
              {['f', 'in', 'tw', 'yt'].map((social) => (
                <div key={social} className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-xs cursor-pointer hover:bg-green-600 transition">
                  {social}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-6 text-center">
          <p className="text-green-200 text-sm mb-2">
            Payment Methods: Cash on Delivery | VISA | Mastercard | bKash | Nagad | Rocket
          </p>
          <p className="text-green-300 text-xs">© 2025 Blibus — All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}