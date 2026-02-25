import React from "react";
import { motion } from "framer-motion";
import { SpaceIcon } from "lucide-react";

export default function Loader() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-4 border-gray-200 border-t-indigo-500 mb-4"></div>
            <p className="text-white text-lg font-medium">Loading...</p>
        </div>
    );
}