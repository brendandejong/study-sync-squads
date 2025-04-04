
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/UserAvatar';
import { currentUser } from '@/data/mockData';
import { Search, Bell, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mr-6">
            StudySync
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${isActive('/') ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/my-groups" 
              className={`font-medium transition-colors ${isActive('/my-groups') ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
            >
              My Groups
            </Link>
            <Link 
              to="/calendar" 
              className={`font-medium transition-colors ${isActive('/calendar') ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
            >
              Calendar
            </Link>
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
            <UserAvatar user={currentUser} size="sm" showDropdown={true} />
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
            <Link 
              to="/" 
              className={`font-medium ${isActive('/') ? 'text-primary' : 'text-gray-700'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/my-groups" 
              className={`font-medium ${isActive('/my-groups') ? 'text-primary' : 'text-gray-700'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              My Groups
            </Link>
            <Link 
              to="/calendar" 
              className={`font-medium ${isActive('/calendar') ? 'text-primary' : 'text-gray-700'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Calendar
            </Link>
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
