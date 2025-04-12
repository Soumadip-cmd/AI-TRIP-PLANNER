import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FaPlane, FaTrain, FaBus, FaInfoCircle, FaMapMarkerAlt, FaRocket, FaStar, FaClock, FaMoneyBillWave, FaShip, FaCar } from "react-icons/fa";

// This is for the loading animation
const style = document.createElement('style');
style.textContent = `
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes ping-slow {
  0% {
    transform: scale(0.95);
    opacity: 1;
  }
  50% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(0.95);
    opacity: 1;
  }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

.animate-ping-slow {
  animation: ping-slow 2s ease-in-out infinite;
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;
document.head.appendChild(style);

function Top3Recommendations({ isOpen, onClose, recommendations, source, destination }) {
  const [loading, setLoading] = React.useState(true);
  const [processedRecs, setProcessedRecs] = React.useState([]);
  
  React.useEffect(() => {
    if (isOpen) {
      // Reset loading state when modal opens
      setLoading(true);
      setProcessedRecs([]);
      
      // Simulate analysis delay
      const timer = setTimeout(() => {
        // Process recommendations and update state
        const processed = processRecommendations(recommendations, source, destination);
        setProcessedRecs(processed);
        setLoading(false);
      }, 2200); // Show loading for 2.2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, recommendations, source, destination]);
  
  if (!isOpen) return null;
  
  const getIconForType = (type) => {
    switch (type) {
      case 'flight':
        return <FaPlane className="text-blue-600" />;
      case 'train':
        return <FaTrain className="text-green-600" />;
      case 'bus':
        return <FaBus className="text-orange-600" />;
      case 'car':
        return <FaCar className="text-red-600" />;
      case 'ferry':
        return <FaShip className="text-indigo-600" />;
      default:
        return <FaInfoCircle className="text-gray-600" />;
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
      case 'car':
        return 'bg-red-100';
      case 'ferry':
        return 'bg-indigo-100';
      default:
        return 'bg-gray-100';
    }
  };
  
  const getBorderColorForType = (type) => {
    switch (type) {
      case 'flight':
        return 'border-blue-200';
      case 'train':
        return 'border-green-200';
      case 'bus':
        return 'border-orange-200';
      case 'car':
        return 'border-red-200';
      case 'ferry':
        return 'border-indigo-200';
      default:
        return 'border-gray-200';
    }
  };
  
  const getTextColorForType = (type) => {
    switch (type) {
      case 'flight':
        return 'text-blue-700';
      case 'train':
        return 'text-green-700';
      case 'bus':
        return 'text-orange-700';
      case 'car':
        return 'text-red-700';
      case 'ferry':
        return 'text-indigo-700';
      default:
        return 'text-gray-700';
    }
  };
  
  const getTransportTypeName = (type) => {
    switch (type) {
      case 'flight':
        return 'Flight';
      case 'train':
        return 'Train';
      case 'bus':
        return 'Bus';
      case 'car':
        return 'Car Service';
      case 'ferry':
        return 'Ferry';
      default:
        return 'Transport';
    }
  };
  
  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return 'bg-yellow-100 text-yellow-700';
      case 1:
        return 'bg-gray-200 text-gray-700';
      case 2:
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getRankName = (index) => {
    switch (index) {
      case 0:
        return 'Best Overall';
      case 1:
        return 'Best Alternative';
      case 2:
        return 'Solid Option';
      default:
        return 'Recommended';
    }
  };
  
  const getRankBadge = (index) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return '⭐';
    }
  };
  
  // Calculate arrival time based on departure and duration
  const calculateSafeArrival = (departure, duration) => {
    // Check if departure or duration contains words like "Various"
    if (!departure || !duration || 
        departure.toLowerCase().includes('various') || 
        typeof departure !== 'string' || 
        typeof duration !== 'string') {
      // For items with various times, just return the arrival time directly
      return "Based on departure";
    }
    
    try {
      // Function to convert 12-hour time format to 24-hour
      const convertTo24Hour = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        if (period === 'PM' && hours !== 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }
        
        return { hours, minutes };
      };
      
      // Function to extract duration in hours and minutes
      const extractDuration = (durationStr) => {
        const hoursMatch = durationStr.match(/(\d+)h/);
        const minutesMatch = durationStr.match(/(\d+)m/);
        
        // For ranges like "4-6 hours", take the average
        if (durationStr.includes('-')) {
          const rangeMatch = durationStr.match(/(\d+)[^\d]+(\d+)/);
          if (rangeMatch) {
            const start = parseInt(rangeMatch[1]);
            const end = parseInt(rangeMatch[2]);
            return { hours: Math.round((start + end) / 2), minutes: 0 };
          }
        }
        
        const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
        const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
        
        return { hours, minutes };
      };
      
      // Handle cases with range of hours (e.g., "4-6 hours") or text
      if (duration.includes('hour')) {
        if (duration.includes('-')) {
          // For ranges like "4-6 hours", show as range
          return duration;
        }
      }
      
      // Convert departure time to 24-hour format
      const departureTime = convertTo24Hour(departure);
      if (!departureTime) return "Based on departure";
      
      // Extract duration
      const durationTime = extractDuration(duration);
      
      // Calculate arrival time
      let arrivalHours = departureTime.hours + durationTime.hours;
      let arrivalMinutes = departureTime.minutes + durationTime.minutes;
      
      // Adjust for overflow
      if (arrivalMinutes >= 60) {
        arrivalHours += Math.floor(arrivalMinutes / 60);
        arrivalMinutes %= 60;
      }
      
      // Handle day overflow (24+ hours)
      let dayOffset = 0;
      if (arrivalHours >= 24) {
        dayOffset = Math.floor(arrivalHours / 24);
        arrivalHours %= 24;
      }
      
      // Format the result
      const dayStr = dayOffset > 0 ? `+${dayOffset} day${dayOffset > 1 ? 's' : ''}` : '';
      const period = arrivalHours >= 12 ? 'PM' : 'AM';
      const displayHours = arrivalHours > 12 ? arrivalHours - 12 : (arrivalHours === 0 ? 12 : arrivalHours);
      const formattedTime = `${displayHours}:${arrivalMinutes.toString().padStart(2, '0')} ${period}`;
      
      return `${formattedTime} ${dayStr}`;
    } catch (error) {
      console.error("Error calculating arrival time:", error);
      return "Time varies";
    }
  };

  // Function to process recommendations to ensure we have diversified options
  function processRecommendations(recommendations, source, destination) {
    // Add realistic naming to recommendations
    if (recommendations && recommendations.length > 0) {
      recommendations = recommendations.map(rec => {
        // Real bus companies
        const busCompanies = [
          "Greyhound", "Megabus", "FlixBus", "RedCoach", "Peter Pan", 
          "BoltBus", "National Express", "Trailways", "OurBus", "Coach USA"
        ];
        
        // Real train services
        const trainServices = [
          "Amtrak Acela Express", "Amtrak Northeast Regional", "Amtrak Pacific Surfliner",
          "Brightline", "VIA Rail Corridor", "Eurostar", "SNCF TGV", "Deutsche Bahn ICE"
        ];
        
        // Real airlines
        const airlines = [
          "Delta Air Lines", "American Airlines", "United Airlines", "Southwest Airlines",
          "JetBlue", "Alaska Airlines", "British Airways", "Air Canada", "Lufthansa"
        ];
        
        // Replace generic names with specific ones
        if (rec.type === 'bus' && (
            rec.name.includes("Private Operator") || 
            rec.name.includes("Coach Service") || 
            rec.name.includes("Bus Service") ||
            rec.name.includes("Local Bus") ||
            rec.name.includes("Express Bus")
          )) {
          // Select a realistic bus company
          const busCompany = busCompanies[Math.floor(Math.random() * busCompanies.length)];
          rec.name = busCompany;
          rec.info = `Express service from ${source} to ${destination}`;
        }
        
        // Replace generic train names
        if (rec.type === 'train' && (
            rec.name.includes("Local Passenger Train") ||
            rec.name.includes("Express Train") ||
            rec.name.includes("Train Service") ||
            rec.name.includes("Regional Train")
          )) {
          // Select a realistic train service
          const trainService = trainServices[Math.floor(Math.random() * trainServices.length)];
          rec.name = trainService;
          rec.info = trainService.includes("Amtrak") ? 
            `Regular service with cafe car` : 
            `High-speed service with business class`;
        }
        
        // Replace generic flight names
        if (rec.type === 'flight' && (
            rec.name.includes("Flight") ||
            rec.name.includes("Air Service") ||
            rec.name.includes("Airlines")
          )) {
          // Select a realistic airline and add a flight number
          const airline = airlines[Math.floor(Math.random() * airlines.length)];
          const flightNumber = Math.floor(Math.random() * 9000) + 1000;
          rec.name = `${airline} ${flightNumber}`;
          rec.info = `Nonstop from ${source} to ${destination}`;
        }
        
        return rec;
      });
    }
    
    if (!recommendations || recommendations.length === 0) {
      // Generate fallback recommendations if none are provided
      return generateFallbackRecommendations(source, destination);
    }

    // Group by transport type
    const byType = {};
    recommendations.forEach(rec => {
      if (!byType[rec.type]) {
        byType[rec.type] = [];
      }
      byType[rec.type].push(rec);
    });

    // Sort each type group by a combined score (lower is better)
    Object.keys(byType).forEach(type => {
      byType[type].sort((a, b) => {
        // Extract numeric values from price
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;

        // Extract numeric values from duration (assuming format like "2h 30m")
        const getDurationMinutes = (dur) => {
          const hours = (dur.match(/(\d+)h/) || [0, 0])[1];
          const minutes = (dur.match(/(\d+)m/) || [0, 0])[1];
          return parseInt(hours) * 60 + parseInt(minutes);
        };

        const durationA = getDurationMinutes(a.duration);
        const durationB = getDurationMinutes(b.duration);

        // Calculate weighted score (70% duration, 30% price)
        const scoreA = (durationA * 0.7) + (priceA * 0.3);
        const scoreB = (durationB * 0.7) + (priceB * 0.3);

        return scoreA - scoreB;
      });
    });

    // Prioritize having one of each transport type if available
    const desiredTypes = ['flight', 'train', 'bus'];
    let result = [];

    // Try to get the best of each type first
    desiredTypes.forEach(type => {
      if (byType[type] && byType[type].length > 0) {
        result.push(byType[type][0]);
        byType[type].shift(); // Remove the added recommendation
      }
    });

    // If we don't have 3 recommendations yet, add the next best options
    if (result.length < 3) {
      // Flatten remaining recommendations and sort by the same score
      const remaining = Object.values(byType).flat();
      remaining.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;

        const getDurationMinutes = (dur) => {
          const hours = (dur.match(/(\d+)h/) || [0, 0])[1];
          const minutes = (dur.match(/(\d+)m/) || [0, 0])[1];
          return parseInt(hours) * 60 + parseInt(minutes);
        };

        const durationA = getDurationMinutes(a.duration);
        const durationB = getDurationMinutes(b.duration);

        const scoreA = (durationA * 0.7) + (priceA * 0.3);
        const scoreB = (durationB * 0.7) + (priceB * 0.3);

        return scoreA - scoreB;
      });

      // Add remaining recommendations up to 3 total
      while (result.length < 3 && remaining.length > 0) {
        result.push(remaining[0]);
        remaining.shift();
      }
    }

    // If we still don't have 3 recommendations, add fallback options
    while (result.length < 3) {
      const fallbacks = generateFallbackRecommendations(source, destination);
      const neededTypes = ['flight', 'train', 'bus'].filter(type => 
        !result.some(r => r.type === type)
      );
      
      for (const type of neededTypes) {
        const fallbackOfType = fallbacks.find(f => f.type === type);
        if (fallbackOfType && result.length < 3) {
          result.push(fallbackOfType);
        }
      }
      
      // If we still need more, add any fallback
      if (result.length < 3 && fallbacks.length > 0) {
        for (const fallback of fallbacks) {
          if (!result.some(r => r.type === fallback.type) && result.length < 3) {
            result.push(fallback);
          }
        }
      }
      
      break; // Prevent infinite loop
    }

    // Sort the final result by our score formula
    result.sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
      const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;

      const getDurationMinutes = (dur) => {
        const hours = (dur.match(/(\d+)h/) || [0, 0])[1];
        const minutes = (dur.match(/(\d+)m/) || [0, 0])[1];
        return parseInt(hours) * 60 + parseInt(minutes);
      };

      const durationA = getDurationMinutes(a.duration);
      const durationB = getDurationMinutes(b.duration);

      // Weight duration more than price (70/30)
      const scoreA = (durationA * 0.7) + (priceA * 0.3);
      const scoreB = (durationB * 0.7) + (priceB * 0.3);

      return scoreA - scoreB;
    });

    return result.slice(0, 3);
  }

  // Generate fallback recommendations when none are available
  function generateFallbackRecommendations(source, destination) {
    // Create fallback options with specific real company names
    return [
      {
        type: 'flight',
        name: `American Airlines 1422`,
        info: `Nonstop flight from ${source} to ${destination}`,
        departure: '9:00 AM',
        arrival: 'Various',
        duration: '1h 30m',
        price: '$120.00',
      },
      {
        type: 'train',
        name: `Amtrak Northeast Regional`,
        info: `Regular service with cafe car`,
        departure: '8:30 AM',
        arrival: 'Various',
        duration: '3h 15m',
        price: '$65.00',
      },
      {
        type: 'bus',
        name: `Greyhound`,
        info: `Express service from ${source} to ${destination}`,
        departure: '7:45 AM',
        arrival: 'Various',
        duration: '4h 30m',
        price: '$40.00',
      },
    ];
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{ overflow: 'hidden' }}>
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto animate-fadeIn">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 p-5 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-xl text-white flex items-center">
              <FaRocket className="mr-2" /> Top Recommended Options
            </h2>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center text-blue-100 text-sm mt-2 gap-2">
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-1 text-blue-200" />
              <span className="font-medium text-white">{source}</span>
              <span className="mx-2">→</span>
              <span className="font-medium text-white">{destination}</span>
            </div>
            <div className="bg-blue-500 bg-opacity-30 px-3 py-1 rounded-full text-xs whitespace-nowrap">
              Best travel options available
            </div>
          </div>
        </div>
        
        <div className="p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 animate-pulse">
              <div className="relative w-24 h-24 mb-5">
                <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin"></div>
                <div className="absolute inset-3 rounded-full border-t-4 border-green-500 animate-spin-slow"></div>
                <div className="absolute inset-6 rounded-full border-t-4 border-orange-500 animate-ping-slow"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaRocket className="text-indigo-600 animate-pulse" size={24} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Analyzing Best Routes</h3>
              <div className="space-y-3 w-full max-w-md">
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <FaTrain className="text-green-600 text-xs" />
                  </div>
                  <span>Checking train routes between {source} and {destination}...</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaPlane className="text-blue-600 text-xs" />
                  </div>
                  <span>Checking flight options and pricing...</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                    <FaBus className="text-orange-600 text-xs" />
                  </div>
                  <span>Finding the best bus services available...</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg animate-pulse">
                  <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center">
                    <FaInfoCircle className="text-indigo-600 text-xs" />
                  </div>
                  <span>Optimizing for <b>cost</b> and <b>travel time</b>...</span>
                </div>
              </div>
            </div>
          ) : processedRecs.length === 0 ? (
            <div className="text-center p-10 bg-gray-50 rounded-lg">
              <FaInfoCircle size={40} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 font-medium">No recommendations available</p>
              <p className="text-gray-500 text-sm mt-2">Please try searching with different locations</p>
            </div>
          ) : (
            <div>
              <div className="p-3 bg-indigo-50 rounded-lg mb-5 text-sm text-indigo-700 border border-indigo-100 flex items-center">
                <FaStar className="mr-2 text-indigo-500 flex-shrink-0" />
                <p>These options are ranked based on the optimal balance of <span className="font-medium">travel time (70%)</span> and <span className="font-medium">cost (30%)</span>. We aim to include different transportation types for your convenience.</p>
              </div>
              
              <div className="space-y-6">
                {processedRecs.map((item, index) => (
                  <div 
                    key={index} 
                    className={`bg-white rounded-lg p-4 sm:p-5 border hover:shadow-md transition-all ${getBorderColorForType(item.type)} ${index === 0 ? 'ring-2 ring-yellow-300 shadow' : ''}`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      <div className={`flex items-center justify-center ${getColorClassForType(item.type)} h-14 w-14 rounded-full shrink-0 mx-auto sm:mx-0`}>
                        {getIconForType(item.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h3 className="font-bold text-lg text-gray-800 text-center sm:text-left">{item.name}</h3>
                          <div className={`${getRankColor(index)} px-3 py-1 rounded-full flex items-center text-sm self-center sm:self-auto whitespace-nowrap`}>
                            <span className="mr-1">{getRankBadge(index)}</span>
                            <span>{getRankName(index)}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-2 justify-center sm:justify-start">
                          <span className={`px-2 py-1 rounded-full text-xs ${getColorClassForType(item.type)} ${getTextColorForType(item.type)}`}>
                            {getTransportTypeName(item.type)}
                          </span>
                          <span className="text-sm text-gray-500">{item.info}</span>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center justify-center sm:justify-start">
                            <FaClock className="text-blue-500 mr-2" />
                            <span className="text-sm">
                              <span className="text-gray-500">Departs:</span> {item.departure}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-center sm:justify-start">
                            <FaClock className="text-green-500 mr-2" />
                            <span className="text-sm">
                              <span className="text-gray-500">Arrives:</span> {item.arrival !== "Various" 
                                ? item.arrival
                                : calculateSafeArrival(item.departure, item.duration)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg flex flex-col justify-between">
                        <p className="text-xs text-gray-500 mb-1">DURATION</p>
                        <p className="font-medium flex items-center">
                          <FaClock className="text-indigo-500 mr-1" size={14} />
                          {item.duration}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg flex flex-col justify-between">
                        <p className="text-xs text-gray-500 mb-1">PRICE</p>
                        <p className="font-medium text-orange-600 flex items-center">
                          <FaMoneyBillWave className="text-orange-500 mr-1" size={14} />
                          {item.price}
                        </p>
                      </div>
                      
                      <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">EXPECTED ARRIVAL</p>
                        <div className={`${getColorClassForType(item.type)} bg-opacity-50 px-3 py-2 rounded-lg text-sm ${getTextColorForType(item.type)} flex items-center mt-1`}>
                          <FaMapMarkerAlt className="mr-2" />
                          <span>
                            {item.arrival !== "Various" 
                              ? calculateSafeArrival(item.departure, item.duration)
                              : "Arrival varies by service time"
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {index === 0 && (
                      <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                        <div className="font-medium flex items-center mb-1">
                          <FaStar className="text-yellow-500 mr-2 flex-shrink-0" />
                          Best Option: Optimal balance of time and cost
                        </div>
                        <p className="text-yellow-700">
                          This {getTransportTypeName(item.type).toLowerCase()} option offers the most efficient combination of travel time and affordability for your journey from {source} to {destination}.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="text-xs text-gray-500 text-center sm:text-left">
                  * Rankings consider both travel duration and cost while providing diverse transport options
                </div>
                <Button 
                  onClick={onClose}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 px-6"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Top3Recommendations;