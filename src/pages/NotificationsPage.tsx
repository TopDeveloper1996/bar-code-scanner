import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const notifications = [
  {
    id: 1,
    title: 'Low Storage',
    message: 'Internal Storage: 92 % used\nSwift Little Pixel Cloud: 20 % used',
    time: '9:02 am',
    date: 'Today',
    icon: '🔴',
    action: 'Learn more'
  },
  {
    id: 2,
    title: 'New version available!',
    message: 'Version 1.0.2 is now available on the PlayStore',
    time: '4:40 pm',
    date: 'Today',
    icon: '📱',
    action: 'Update App'
  },
  {
    id: 3,
    title: '1 more free scan...',
    message: 'Enjoy the perks of unlimited scans and more! Upgrade to Premium now.',
    time: '9:28 pm',
    date: 'Yesterday',
    icon: '⚠️',
    action: 'Upgrade'
  },
  {
    id: 4,
    title: 'Hi Christie! Welcome to',
    message: 'swiftlittlepixel',
    time: '10:57 am',
    date: '11/03/2024',
    icon: '👋',
  }
];

const NotificationsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 px-5 md:px-8 py-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/" className="text-blue-500">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-semibold">Notifications</h1>
        </div>

        <div className="space-y-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:space-y-0">
          {Object.entries(
            notifications.reduce((acc, notification) => {
              acc[notification.date] = [...(acc[notification.date] || []), notification];
              return acc;
            }, {} as Record<string, typeof notifications>)
          ).map(([date, items]) => (
            <div key={date}>
              <h2 className="text-gray-500 mb-4">{date}</h2>
              <div className="space-y-4">
                {items.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NotificationCard: React.FC<{ notification: typeof notifications[0] }> = ({ notification }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{notification.icon}</span>
          <div>
            <h3 className="font-medium">{notification.title}</h3>
            <p className="text-sm text-gray-600 whitespace-pre-line">{notification.message}</p>
          </div>
        </div>
        <span className="text-xs text-gray-400">{notification.time}</span>
      </div>
      {notification.action && (
        <button className="ml-auto block text-blue-500 text-sm">
          {notification.action}
        </button>
      )}
    </div>
  );
};

export default NotificationsPage;

