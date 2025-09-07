'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Menu, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { clearAuth } from '@/store/authSlice';
import type { RootState, AppDispatch } from '../store';

export default function Header() {
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const auth = useSelector((state: RootState) => state.auth);
  const cart = useSelector((state: RootState) => state.cart);

  // Calculate cart totals
  const totalItems =
    cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice =
    cart.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  useEffect(() => {
    setIsClient(true);
    // Simulate loading state
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    try {
      // Clear from localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('auth_token');

      // Dispatch logout action to Redux
      dispatch(clearAuth());

      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Navigation links based on auth state
  const navLinks = auth.isAuthenticated
    ? [
        { href: '/vegetables', label: 'Vegetables' },
        { href: '/cart', label: 'Cart' },
        { href: '/checkout', label: 'Checkout' },
      ]
    : [
        { href: '/register', label: 'Register' },
        { href: '/login', label: 'Login' },
      ];

  // Loading/Error state handling
  if (!isClient || isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-green-100 flex items-center justify-center">
                🥬
              </div>
              <span className="text-lg font-semibold">Veggie Shop</span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>

            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 rounded bg-green-100 flex items-center justify-center text-lg">
              🥬
            </div>
            <span className="text-lg font-semibold text-foreground">
              Veggie Shop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side - Auth and Cart */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon with Badge */}
            {auth.isAuthenticated && (
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="sm" className="relative p-2">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </Badge>
                  )}
                  <span className="sr-only">
                    Shopping cart with {totalItems} items, total $
                    {totalPrice.toFixed(2)}
                  </span>
                </Button>
              </Link>
            )}

            {/* Auth Area */}
            {auth.isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {auth.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:inline text-sm">
                      {auth.user?.name || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/register">Register</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden p-2"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle className="text-left">Navigation</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}

                  {auth.isAuthenticated ? (
                    <div className="pt-4 border-t space-y-2">
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        Signed in as {auth.user?.name || 'User'}
                      </div>
                      <Link
                        to="/profile"
                        onClick={closeMobileMenu}
                        className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          closeMobileMenu();
                        }}
                        className="w-full text-left px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="pt-4 border-t space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="w-full justify-start"
                      >
                        <Link to="/register" onClick={closeMobileMenu}>
                          Register
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        asChild
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Link to="/login" onClick={closeMobileMenu}>
                          Login
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
