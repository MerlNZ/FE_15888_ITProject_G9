//making pop-up page for Kindness Journal in StudentDashboard for easy access

import React from "react";
import KindnessJournalDashboard from "@/components/KindnessJournalDashboard"; // Import the existing component
import { useStudentId } from "@/hooks/useStudentId"; // Import the hook to get studentId

interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

// Assuming useStudentId returns studentId
const KindnessJournalModal: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
    const { studentId } = useStudentId(); // Get the studentId from the hook

    if (!isOpen) return null; // Don't render modal if it's not open

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto relative">
                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="absolute top-3 right-4 text-lg font-bold text-red-600"
                >
                    ✕
                </button>
                
                {/* Render Kindness Journal Dashboard inside the modal */}
                <KindnessJournalDashboard studentId={studentId!} />
            </div>
        </div>
    );
};

export default KindnessJournalModal;
