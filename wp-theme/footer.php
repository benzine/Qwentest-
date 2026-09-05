    <!-- Footer Section -->
    <footer id="footer" class="footer-section">
        <div class="footer-content">
            <!-- Journey Map -->
            <div class="footer-journey">
                <p>Your Journey</p>
                <div class="journey-dots">
                    <?php
                    $sections = array(
                        'hero' => 'Hero',
                        'about' => 'About',
                        'services' => 'Services',
                        'process' => 'Process',
                        'case-studies' => 'Case Studies',
                        'insights' => 'Insights',
                        'team' => 'Team',
                        'contact' => 'Contact',
                    );
                    
                    foreach ($sections as $id => $label) :
                    ?>
                    <button class="journey-dot" onclick="document.getElementById('<?php echo esc_attr($id); ?>').scrollIntoView({behavior: 'smooth'})">
                        <div class="dot-circle"></div>
                        <span class="dot-label"><?php echo esc_html($label); ?></span>
                    </button>
                    <?php endforeach; ?>
                </div>
            </div>
            
            <!-- Links Grid -->
            <div class="footer-links">
                <div class="footer-link-group">
                    <h4>Services</h4>
                    <ul>
                        <li><a href="#">Strategic Planning</a></li>
                        <li><a href="#">Digital Transformation</a></li>
                        <li><a href="#">Operational Excellence</a></li>
                        <li><a href="#">M&A</a></li>
                    </ul>
                </div>
                
                <div class="footer-link-group">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Our Team</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Press</a></li>
                    </ul>
                </div>
                
                <div class="footer-link-group">
                    <h4>Resources</h4>
                    <ul>
                        <li><a href="#">Insights</a></li>
                        <li><a href="#">Case Studies</a></li>
                        <li><a href="#">Events</a></li>
                        <li><a href="#">Webinars</a></li>
                    </ul>
                </div>
                
                <div class="footer-link-group">
                    <h4>Legal</h4>
                    <ul>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Cookie Policy</a></li>
                        <li><a href="#">Accessibility</a></li>
                    </ul>
                </div>
            </div>
            
            <!-- Bottom Bar -->
            <div class="footer-bottom">
                <div class="footer-bottom-content">
                    <p class="copyright">
                        &copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All rights reserved.
                    </p>
                    
                    <div class="footer-legal">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Cookies</a>
                    </div>
                    
                    <div class="footer-credit">
                        <span>Crafted with</span>
                        <svg class="footer-heart" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                        </svg>
                        <span>for visionaries</span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
