import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const links = {
    'LearnPulse': ['About us', 'Careers', 'Blog', 'Press'],
    'Community': ['Students', 'Instructors', 'Affiliate', 'Partners'],
    'Teach on LearnPulse': ['Become an instructor', 'Get the app', 'About us', 'Contact us'],
    'Support': ['Help center', 'Verify certificate', 'Terms of service', 'Privacy policy'],
  };

  return (
    <footer style={{ background: '#1c1d1f', color: '#d1d7dc', borderTop: '1px solid #3d3d3d' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
        
        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', gap: 32, marginBottom: 40 }} className="footer-grid">
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 6, background: '#1a8754', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={18} color="#fff" />
              </div>
              <span style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>
                Learn<span style={{ color: '#34d399' }}>Pulse</span>
              </span>
            </Link>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: '#9ca3af', maxWidth: 220, marginBottom: 20 }}>
              A modern LMS built for students, instructors, and administrators. Learn smarter, faster.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 34, height: 34, borderRadius: 4,
                  border: '1px solid #3d3d3d', background: '#2d2d2d',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af'
                }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {heading}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map(item => (
                  <li key={item}>
                    <a href="#" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}
                      onMouseEnter={e => e.target.style.color = '#34d399'}
                      onMouseLeave={e => e.target.style.color = '#9ca3af'}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #3d3d3d', paddingTop: 24, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <p style={{ fontSize: 12, color: '#6b7280' }}>
            © {new Date().getFullYear()} LearnPulse, Inc. All rights reserved.
          </p>
          <p style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4 }}>
            Built with <Heart size={12} color="#ef4444" fill="#ef4444" /> using MERN Stack
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
