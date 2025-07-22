// components/contact/BusinessHoursCard.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { formatDistanceStrict, addDays, setHours, setMinutes } from "date-fns";

function getBusinessStatus() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();

  const openHour = 8;
  const closeHour = 18;

  if (day === 0) {
    const nextOpen = setHours(setMinutes(addDays(now, 1), openHour);
    const timeUntilOpen = formatDistanceStrict(now, nextOpen);
    return {
      open: false,
      message: `We're currently closed. Opens in ${timeUntilOpen}`,
    };
  }

  if (hour < openHour || (hour === openHour && minute < 0)) {
    const todayOpen = setHours(setMinutes(now, 0), openHour);
    const timeUntilOpen = formatDistanceStrict(now, todayOpen);
    return {
      open: false,
      message: `We're currently closed. Opens in ${timeUntilOpen}`,
    };
  }

  if (hour >= closeHour) {
    let nextDay = day === 6 ? addDays(now, 2) : addDays(now, 1);
    const nextOpen = setHours(setMinutes(nextDay, 0), openHour);
    const timeUntilOpen = formatDistanceStrict(now, nextOpen);
    return {
      open: false,
      message: `We're currently closed. Opens in ${timeUntilOpen}`,
    };
  }

  const closingTime = setHours(setMinutes(now, 0), closeHour);
  const timeUntilClose = formatDistanceStrict(now, closingTime);
  return {
    open: true,
    message: `We're open! Closes in ${timeUntilClose}`,
  };
}

export default function BusinessHoursCard() {
  const [status, setStatus] = useState(getBusinessStatus());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [progress, setProgress] = useState(0);
  const [hovering, setHovering] = useState(false);

  // Days of the week with current day highlight
  const days = [
    { name: "Sun", active: false },
    { name: "Mon", active: false },
    { name: "Tue", active: false },
    { name: "Wed", active: false },
    { name: "Thu", active: false },
    { name: "Fri", active: false },
    { name: "Sat", active: false },
  ];
  days[currentTime.getDay()].active = true;

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getBusinessStatus());
      setCurrentTime(new Date());
    }, 60000);

    // Calculate progress
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    const totalMinutes = (hour - 8) * 60 + minute;
    const progressValue = Math.min(100, Math.max(0, (totalMinutes / 600) * 100));
    setProgress(progressValue);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full max-w-lg bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-xl p-4 sm:p-6 mx-auto relative overflow-hidden"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Animated background elements */}
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{
          background: hovering 
            ? "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.03) 0%, rgba(0,0,0,0) 70%)" 
            : "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.02) 0%, rgba(0,0,0,0) 70%)"
        }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5" />
      <div className="absolute bottom-0 right-0 w-32 h-32 translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-500/5" />
      
      <div className="relative z-10">
        {/* Header with animated clock icon */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <motion.div 
            className="p-3 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl shadow-md relative"
            animate={{ 
              rotate: [0, 1, -1, 0],
              scale: hovering ? 1.05 : 1
            }}
            transition={{ 
              rotate: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              },
              scale: { duration: 0.3 }
            }}
          >
            <FiClock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            {/* Clock hands */}
            <motion.div 
              className="absolute top-1/2 left-1/2 w-0.5 h-2.5 bg-white origin-top -translate-x-1/2 -translate-y-1/2"
              animate={{ rotate: [0, 360] }}
              transition={{
                rotate: {
                  repeat: Infinity,
                  duration: 12,
                  ease: "linear"
                }
              }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/2 w-0.5 h-1.5 bg-white origin-top -translate-x-1/2 -translate-y-1/2"
              animate={{ rotate: [0, 360] }}
              transition={{
                rotate: {
                  repeat: Infinity,
                  duration: 60,
                  ease: "linear"
                }
              }}
            />
          </motion.div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Business Hours</h2>
            <p className="text-xs sm:text-sm text-gray-500">Current operational status</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Current Time */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-3 sm:p-4 rounded-xl border border-indigo-100">
            <div className="text-xs text-indigo-600 font-medium mb-1">CURRENT TIME</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-800">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>

          {/* Days of Week - Responsive layout */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 rounded-xl border border-gray-200">
            <div className="text-xs text-gray-600 font-medium mb-2">WEEK SCHEDULE</div>
            
            <div className="flex justify-between">
              {days.map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm ${
                    day.active 
                      ? "bg-indigo-500 text-white shadow-sm" 
                      : "text-gray-400 bg-gray-100"
                  }`}>
                    {day.name.charAt(0)}
                  </div>
                  <div className={`text-[10px] mt-1 ${
                    day.active ? "font-bold text-indigo-600" : "text-gray-400"
                  }`}>
                    {index === 0 || index === 6 ? day.name : day.name.substring(0,1)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hours Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 sm:p-4 rounded-xl border border-blue-100">
            <div className="text-xs text-blue-600 font-medium mb-2">OPERATING HOURS</div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs sm:text-sm text-gray-600">Mon - Sat</span>
              <span className="text-xs sm:text-sm font-medium">8 AM - 6 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-gray-600">Sunday</span>
              <span className="text-xs sm:text-sm font-medium text-red-500">Closed</span>
            </div>
          </div>
        </div>

        {/* Visual Timeline */}
        <div className="mt-4 sm:mt-6 mb-4 sm:mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>8 AM</span>
            <span className="text-gray-800 font-medium">Business Hours</span>
            <span>6 PM</span>
          </div>
          <div className="h-2.5 sm:h-3 bg-gray-200 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 flex">
              <div className="w-1/3 bg-blue-100"></div>
              <div className="w-1/3 bg-blue-200"></div>
              <div className="w-1/3 bg-blue-300"></div>
            </div>
            {status.open && (
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 absolute top-0 left-0"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            )}
            <div className="absolute top-0 h-3 sm:h-4 w-0.5 bg-gray-800 left-1/3 -ml-px"></div>
            <div className="absolute top-0 h-3 sm:h-4 w-0.5 bg-gray-800 left-2/3 -ml-px"></div>
            
            {status.open && (
              <motion.div 
                className="absolute top-0 h-4 w-1.5 bg-white border-2 border-gray-800 rounded-full -mt-1"
                style={{ left: `${progress}%` }}
                initial={{ left: "0%" }}
                animate={{ left: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <div className="absolute top-4 left-1/2 -translate-x-1/2 mt-1 text-xs font-medium text-gray-700 bg-white px-2 py-0.5 rounded shadow whitespace-nowrap">
                  Now
                </div>
              </motion.div>
            )}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Morning</span>
            <span>Afternoon</span>
            <span>Evening</span>
          </div>
        </div>

        {/* Status Indicator */}
        <AnimatePresence mode="wait">
          <motion.div
            key={status.message}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-xl ${
              status.open
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                : "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
            }`}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${
                status.open ? "bg-green-100" : "bg-amber-100"
              }`}>
                {status.open ? (
                  <FiCheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <FiAlertCircle className="w-5 h-5 text-amber-600" />
                )}
              </div>
              <div className="ml-3">
                <div className={`text-sm font-semibold ${
                  status.open ? "text-green-700" : "text-amber-700"
                }`}>
                  {status.open ? "We're Open!" : "Currently Closed"}
                </div>
                <div className="text-xs sm:text-sm text-gray-700 mt-1">
                  {status.message}
                </div>
              </div>
            </div>
            
            {/* Progress info */}
            {status.open && (
              <div className="mt-3 flex items-center">
                <div className="text-xs text-gray-500">Workday progress:</div>
                <div className="ml-2 w-20 sm:w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full ${status.open ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-300'}`}
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <div className="ml-2 text-xs font-medium text-gray-700">
                  {Math.round(progress)}%
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
          <div>Updated just now</div>
          <div className="flex items-center">
            <motion.div 
              className="w-2 h-2 rounded-full bg-green-500 mr-1"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            <span>Live status</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}