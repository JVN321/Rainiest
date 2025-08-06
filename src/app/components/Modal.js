export default function Modal({ district, data, isNight, onClose }) {
  const { hasLeaveInfo, likelyLeave, lastUpdated, keywords, fbPost } = data;

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 relative ${
        isNight ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-800'
      }`}>
        {/* Close button */}
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 text-2xl hover:opacity-70 ${
            isNight ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          ×
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className={`text-2xl font-bold mb-4 ${
            isNight ? 'text-slate-100' : 'text-teal-700'
          }`}>
            {district}
          </h2>

          {/* Alert status */}
          <div className={`p-4 rounded-lg mb-4 ${
            likelyLeave 
              ? 'bg-red-100 text-red-800 border border-red-200' 
              : 'bg-green-100 text-green-800 border border-green-200'
          }`}>
            {likelyLeave ? '🚨 Educational Leave Likely' : '✅ No Leave Announced'}
          </div>
        </div>

        {/* Leave information */}
        <div className={`p-4 rounded-lg mb-6 ${
          isNight ? 'bg-slate-700' : 'bg-gray-50'
        }`}>
          <h3 className="font-semibold mb-2">Leave Information</h3>
          {hasLeaveInfo ? (
            <div>
              <p className="mb-2">Keywords found: {keywords?.join(', ') || 'None'}</p>
            </div>
          ) : (
            <p>No leave-related information found</p>
          )}
          {lastUpdated && (
            <p className="text-sm opacity-70 mt-2">
              Last updated: {formatDateTime(lastUpdated)}
            </p>
          )}
        </div>

        {/* Facebook post embed */}
        <div className="mb-4">
          <h3 className="font-semibold mb-4">Latest Facebook Post</h3>
          {fbPost ? (
            <div className="border rounded-lg overflow-hidden">
              <iframe 
                src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(fbPost)}&show_text=true&width=500`}
                width="100%" 
                height="600" 
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling="no" 
                frameBorder="0" 
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
            </div>
          ) : (
            <p className="opacity-70">No recent Facebook posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
