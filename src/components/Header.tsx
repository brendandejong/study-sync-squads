
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/UserAvatar';
import { currentUser } from '@/data/mockData';
import { Search, Bell, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mr-6">
            StudySync
          </h1>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-primary">Dashboard</a>
            <a href="#" className="text-gray-700 hover:text-primary">My Groups</a>
            <a href="#" className="text-gray-700 hover:text-primary">Calendar</a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Bell className="h-5 w-5 text-gray-500" />
          </Button>
          
          <div className="flex items-center">
            <UserAvatar user={currentUser} size="sm" />
          </div>
          
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <nav className="container mx-auto px-4 py-3 flex flex-col space-y-4">
            <a href="#" className="text-gray-700 hover:text-primary">Dashboard</a>
            <a href="#" className="text-gray-700 hover:text-primary">My Groups</a>
            <a href="#" className="text-gray-700 hover:text-primary">Calendar</a>
            <div className="flex items-center">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5 text-gray-500" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
