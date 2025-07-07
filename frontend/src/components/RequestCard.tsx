import React from 'react';

interface Request {
  _id: string;
  address: string;
  status?: string;
  description: string;
  requestType: string;
  priority?: 'low' | 'medium' | 'high';
  photos?: string[];
  createdAt: string;
}

interface RequestCardProps {
  request: Request;
  onResolve?: () => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onResolve }) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const safePriority = request.priority || '';
  const safeStatus = request.status || '';
  const safePhotos = request.photos || [];

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{request.address}</h3>
          <p className="text-sm text-gray-600 mt-1">{request.description}</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[safePriority as keyof typeof priorityColors] || 'bg-gray-100 text-gray-800'}`}>
            {safePriority.toUpperCase()}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[safeStatus as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
            {safeStatus.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        <div>
          <span className="font-medium">Type:</span> {request.requestType}
        </div>
        <div>
          <span className="font-medium">Created:</span>{' '}
          {new Date(request.createdAt).toLocaleDateString()}
        </div>
      </div>

      {safePhotos.length > 0 && (
        <div className="mt-4">
          <div className="flex gap-2 overflow-x-auto">
            {safePhotos.map((photo, index) => (
              <img
                key={index}
                src={`/uploads/request_photos/${photo}`}
                alt={`Request ${index + 1}`}
                className="h-20 w-20 object-cover rounded"
              />
            ))}
          </div>
        </div>
      )}

      {onResolve && request.status !== 'completed' && (
        <button
          onClick={onResolve}
          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Mark as Completed
        </button>
      )}
    </div>
  );
};

export default RequestCard; 