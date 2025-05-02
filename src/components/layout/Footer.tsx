import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-muted py-8 mt-auto">
      <div className="container">
        {/* Upper Section with Logo and Navigation Links */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <Link to="/" className="font-bold text-2xl text-primary">
              Kind Hearts
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Inspiring kindness and learning in every child
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <Link to="/#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              About Us
            </Link>
            <Link to="/#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            <Link to="/#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center gap-6 mb-8">
          <Link to="/#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            <i className="fab fa-facebook"></i> Facebook
          </Link>
          <Link to="/#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            <i className="fab fa-twitter"></i> Twitter
          </Link>
          <Link to="/#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            <i className="fab fa-instagram"></i> Instagram
          </Link>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-8 pt-4 border-t border-border text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <span>Made with</span>
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            <span>for young learners</span>
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} Kind Hearts. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
