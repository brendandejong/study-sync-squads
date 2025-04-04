
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Calendar, Home, LogOut, User } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/context/AuthContext';
import UserAvatar from './UserAvatar';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center">
              <Book className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">StudySync</span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-indigo-600 flex items-center">
                <Home className="h-4 w-4 mr-1" />
                <span>Study Groups</span>
              </Link>
              <Link to="/my-groups" className="text-gray-700 hover:text-indigo-600 flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>My Groups</span>
              </Link>
              <Link to="/calendar" className="text-gray-700 hover:text-indigo-600 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Calendar</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:block">
                  <UserAvatar 
                    user={currentUser || { id: '', name: 'Guest', email: '' }} 
                    showDropdown={true}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="hidden md:flex"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/signup')}
                >
                  Sign up
                </Button>
              </div>
            )}
            
            <button
              className="md:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100"
              onClick={toggleMobileMenu}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 border-t pt-3">
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-indigo-600 flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                <Home className="h-4 w-4 mr-2" />
                <span>Study Groups</span>
              </Link>
              <Link to="/my-groups" className="text-gray-700 hover:text-indigo-600 flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                <User className="h-4 w-4 mr-2" />
                <span>My Groups</span>
              </Link>
              <Link to="/calendar" className="text-gray-700 hover:text-indigo-600 flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                <Calendar className="h-4 w-4 mr-2" />
                <span>Calendar</span>
              </Link>
              
              {isAuthenticated ? (
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center">
                    <UserAvatar 
                      user={currentUser || { id: '', name: 'Guest', email: '' }}
                      size="sm"
                      showDropdown={false}
                    />
                    <span className="ml-2 text-gray-700">{currentUser?.name}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2 pt-2 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      navigate('/login');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      navigate('/signup');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
