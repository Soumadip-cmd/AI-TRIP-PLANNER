// Top3Recommendations.jsx
import React from 'react';
import { FaPlane, FaTrain, FaBus, FaStar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { Button } from './ui/button';

const Top3Recommendations = ({ recommendations, onClose }) => {
  const getIconForType = (type) => {
    switch (type) {
      case 'flight':
        return <FaPlane className="text-blue-600" />;
      case 'train':
        return <FaTrain className="text-green-600" />;
      case 'bus':
        return <FaBus className="text-orange-600" />;
      default:
        return null;
    }
  };

  const getColorClassForType = (type) => {
    switch (type) {
      case 'flight':
        return 'bg-blue-100';
      case 'train':
        return 'bg-green-100';
      case 'bus':
        return 'bg-orange-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-xl text-white flex items-center">
              <FaStar className="mr-2" /> Top 3 Recommended Options
            </h2>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full"
            >
              ✕
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-1">Based on duration, price, and comfort</p>
        </div>
        
        <div className="p-5 max-h-[calc(90vh-120px)] overflow-y-auto">
          {recommendations.map((item, index) => (
            <div key={index} className="mb-6 bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-all">
              <div className="flex items-center mb-3">
                <div className={`${getColorClassForType(item.type)} p-3 rounded-full mr-3`}>
                  {getIconForType(item.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.info}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800">{item.price}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <FaClock className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Departure</span>
                  </div>
                  <p className="font-medium">{item.departure}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <FaClock className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Arrival</span>
                  </div>
                  <p className="font-medium">{item.arrival}</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-blue-600 mr-2" />
                  <span className="text-sm text-blue-600">Duration: {item.duration}</span>
                </div>
                <span className="text-sm font-medium text-blue-600">
                  {index === 0 && "Best Option Overall"}
                  {index === 1 && "Good Alternative"}
                  {index === 2 && "Third Best Choice"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Top3Recommendations;
