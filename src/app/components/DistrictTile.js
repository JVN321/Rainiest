export default function DistrictTile({ district, data, isNight, onClick }) {
  const { hasLeaveInfo, likelyLeave, lastUpdated } = data;
  
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div 
      onClick={onClick}
      className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-xl ${
        isNight 
          ? 'bg-slate-700 hover:bg-slate-600 text-slate-100' 
          : 'bg-white hover:bg-teal-50 text-slate-800'
      }`}
    >
      {/* Status indicator */}
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-lg font-semibold ${
          isNight ? 'text-slate-100' : 'text-teal-700'
        }`}>
          {district}
        </h3>
        <div className={`w-3 h-3 rounded-full ${
          hasLeaveInfo 
            ? 'bg-blue-500' 
            : isNight 
              ? 'bg-yellow-400' 
              : 'bg-green-500'
        }`} />
      </div>

      {/* Status text */}
      <div className="mb-3">
        <p className={`font-medium ${
          hasLeaveInfo ? 'text-blue-600' : 'text-green-600'
        }`}>
          {hasLeaveInfo ? 'Leave Info Available' : 'No Updates'}
        </p>
      </div>

      {/* Leave announcement status */}
      <div className={`mb-4 font-semibold ${
        likelyLeave ? 'text-red-600' : 'text-green-600'
      }`}>
        {likelyLeave ? '🚨 Leave Announced' : 'No Leave'}
      </div>

      {/* Last updated */}
      {lastUpdated && (
        <p className={`text-sm opacity-70`}>
          Last updated: {formatTime(lastUpdated)}
        </p>
      )}
    </div>
  );
}
