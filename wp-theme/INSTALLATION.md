# Apex Consulting WordPress Theme

## Installation

### Method 1: Upload via WordPress Admin
1. Download the theme ZIP file
2. Log in to your WordPress admin panel
3. Navigate to **Appearance > Themes**
4. Click **Add New** > **Upload Theme**
5. Choose the ZIP file and click **Install Now**
6. After installation, click **Activate**

### Method 2: Manual Installation via FTP
1. Unzip the theme folder
2. Upload the `apex-consulting` folder to `/wp-content/themes/`
3. Log in to WordPress admin
4. Navigate to **Appearance > Themes**
5. Find "Apex Consulting" and click **Activate**

## Quick Start Guide

### Step 1: Configure Studio Backoffice
After activation, configure your theme settings:
1. Go to **Studio** in the WordPress admin menu
2. Fill in your content for each section:
   - **General**: Site tagline and copyright text
   - **Hero Section**: Main headline, subheadline, CTA button
   - **Services**: Add/edit/remove service cards
   - **Team**: Add team members with photos
   - **Contact Info**: Email, phone, address
   - **Styling**: Primary and accent colors
3. Click **Save Changes**

### Step 2: Set Up Navigation Menus
1. Go to **Appearance > Menus**
2. Create a new menu or use an existing one
3. Assign menu locations:
   - **Primary Menu**: Main navigation
   - **Footer Menu**: Footer links
   - **Mobile Menu**: Mobile navigation
4. Add custom links for smooth scroll sections:
   - `#about` - About section
   - `#services` - Services section
   - `#process` - Process section
   - `#case-studies` - Case Studies section
   - `#insights` - Insights/Blog section
   - `#team` - Team section
   - `#contact` - Contact section
5. Save the menu

### Step 3: Add Content
1. **Logo**: Go to **Appearance > Customize > Site Identity** to upload your logo
2. **Blog Posts**: Add posts under **Posts > Add New** for the Insights section
3. **Pages**: Create additional pages as needed

### Step 4: Frontend Editing (Admin Only)
When logged in as an administrator:
1. Visit your homepage
2. Look for the **"Edit Mode"** button in the bottom-right corner
3. Click it to enable frontend editing
4. Click any text element to edit it inline
5. Save changes directly from the frontend panel

## Features

### Animations & Effects
- **Lenis Smooth Scrolling**: Buttery-smooth scroll experience
- **GSAP ScrollTrigger**: Scroll-based animations
- **Three.js Particle Field**: Interactive hero background
- **Custom Cursor**: Elegant cursor with blend modes
- **Letterbox Effects**: Cinematic top/bottom bars
- **Film Grain Overlay**: Subtle texture overlay

### Sections
1. **Hero**: Full-screen with animated particles
2. **About**: Company story with magnetic words
3. **Services**: Grid with geometric shapes
4. **Process**: Timeline with progress indicator
5. **Case Studies**: Client success metrics
6. **Insights**: Blog posts with filters
7. **Team**: Constellation layout
8. **Contact**: AJAX form with validation
9. **Footer**: Journey map navigation

### Studio Backoffice
The theme includes a complete backoffice system:
- **Admin-only access**: Only visible to administrators
- **Tabbed interface**: Easy navigation between sections
- **AJAX saving**: Real-time save without page reload
- **Repeater fields**: Add unlimited services and team members
- **Frontend edit mode**: Click-to-edit on the live site
- **Color customization**: Change brand colors instantly

## Customization

### Via Studio Backoffice
Access at **Studio** menu in admin:
- Hero title and subtitle
- Services (add/remove/reorder)
- Team members (add/remove/reorder)
- Contact information
- Copyright text
- Primary and accent colors

### Via WordPress Customizer
Access at **Appearance > Customize**:
- Site identity (logo, title, tagline)
- Colors (additional color options)
- Background image
- Widgets (sidebar and footer areas)

### Via Child Theme
For advanced customization:
1. Create a child theme
2. Override template files in `index.php`, `header.php`, `footer.php`
3. Add custom CSS in `style.css`
4. Add custom JavaScript in `assets/js/`

## Template Files

```
apex-consulting/
├── style.css              # Main stylesheet + theme header
├── functions.php          # Theme functions and setup
├── index.php              # Main template (homepage)
├── header.php             # Site header
├── footer.php             # Site footer
├── readme.txt             # Theme documentation
├── assets/
│   ├── css/
│   │   └── style.css      # Compiled styles
│   ├── js/
│   │   └── scripts.js     # Main JavaScript
│   └── images/            # Theme images
├── inc/
│   ├── class-studio-backoffice.php  # Backoffice system
│   ├── class-walker-nav-menu.php    # Custom nav walker
│   ├── ajax-handlers.php            # AJAX form handlers
│   ├── template-tags.php            # Custom template tags
│   ├── template-functions.php       # Helper functions
│   └── studio/
│       ├── assets/
│       │   ├── css/
│       │   │   ├── admin.css        # Backoffice admin styles
│       │   │   └── frontend.css     # Frontend edit styles
│       │   └── js/
│       │       ├── admin.js         # Backoffice admin JS
│       │       └── frontend.js      # Frontend edit JS
└── template-parts/        # Reusable template parts
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest macOS + iOS)
- Edge (latest)
- Mobile Chrome (Android)
- Mobile Safari (iOS)

## Performance Optimization

The theme is optimized for performance:
- **Lazy loading**: Images load on demand
- **Async scripts**: Non-blocking JavaScript
- **Font optimization**: `font-display: swap`
- **Minimal dependencies**: Only essential libraries
- **CDN-hosted libraries**: GSAP, Three.js, Lenis

## Accessibility

The theme follows WCAG 2.1 AA guidelines:
- Semantic HTML structure
- Proper heading hierarchy (H1 → H2 → H3)
- Keyboard navigation support
- Focus indicators on interactive elements
- ARIA labels where needed
- Color contrast compliance
- Screen reader compatibility

## SEO Features

- Semantic HTML5 structure
- Proper meta tags
- Open Graph support
- Schema.org ready
- Clean URL structure
- Fast loading times
- Mobile-responsive design

## Troubleshooting

### Animations not working
- Ensure JavaScript is enabled
- Check browser console for errors
- Verify GSAP and Three.js are loading (check Network tab)

### Contact form not sending
- Verify SMTP is configured on your server
- Check spam folder for test emails
- Ensure AJAX is enabled on your host

### Studio Backoffice not visible
- You must be logged in as an administrator
- Check user capabilities in WordPress
- Clear browser cache and try again

### Smooth scrolling not working
- Ensure Lenis script is loaded
- Check for JavaScript conflicts
- Disable other smooth scroll plugins

## Support

For support inquiries:
- Documentation: See this README file
- WordPress.org forums: [Link to forum]
- Email: support@apexconsulting.com

## License

This theme is licensed under the GNU General Public License v2 or later.
http://www.gnu.org/licenses/gpl-2.0.html

## Credits

- **Google Fonts**: Playfair Display and Inter
- **GSAP**: By GreenSock (https://greensock.com/gsap/)
- **ScrollTrigger**: GSAP plugin
- **Lenis**: By Studio Freight (https://github.com/studio-freight/lenis)
- **Three.js**: JavaScript 3D library (https://threejs.org/)

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Author**: Apex Consulting
