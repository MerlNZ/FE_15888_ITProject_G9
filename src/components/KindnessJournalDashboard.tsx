import KindnessJournal from './KindnessJournal';
import KindnessJournalCalendar from './KindnessJournalCalendar';

const KindnessJournalDashboard = ({ studentId }: { studentId: string }) => {
  return (
    <div className="w-full">
      {/* Header */}
      {/* <h2 className="text-3xl font-bold text-red-600 mb-4 text-center">📖 Kindness Journal</h2> */}
        <br></br>
      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Write Section */}
        <div className="bg-yellow-50 p-4 rounded-lg shadow-sm border border-yellow-200">
          <KindnessJournal studentId={studentId} />
        </div>

        {/* Right: Calendar View */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <KindnessJournalCalendar studentId={studentId} />
        </div>
      </div>
    </div>
  );
};

export default KindnessJournalDashboard;
