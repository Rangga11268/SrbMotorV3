import React from 'react';
import { usePage } from '@inertiajs/react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingWA = () => {
    const { settings } = usePage().props;
    
    // Get phone number from settings or use default
    const phoneNumber = (settings?.contact_phone || '628978638849').replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}`;

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[9999]"
        >
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl transition-all duration-300 group"
                aria-label="Chat on WhatsApp"
            >
                {/* Pulse Animation Effect */}
                <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 group-hover:animate-ping"></span>
                
                {/* WhatsApp Icon */}
                <MessageCircle className="w-8 h-8 relative z-10" />
                
                {/* Tooltip */}
                <div className="absolute right-full mr-4 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block">
                    Chat CS SRB Motor
                    <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-black rotate-45"></div>
                </div>
            </a>
        </motion.div>
    );
};

export default FloatingWA;
