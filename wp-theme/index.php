<?php
/**
 * The main template file
 *
 * @package Apex_Consulting
 * @since 1.0.0
 */

get_header();
?>

<main id="primary" class="site-main">
    
    <!-- Hero Section -->
    <section id="hero" class="hero-section">
        <!-- Three.js Canvas Container -->
        <div class="hero-canvas" id="hero-canvas"></div>
        
        <!-- Lens Flare Overlay -->
        <div class="lens-flare-overlay">
            <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-yellow-400/20 to-transparent rounded-full blur-3xl"></div>
            <div class="absolute bottom-1/3 right-1/4 w-64 h-64 bg-gradient-radial from-teal-400/15 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <!-- Vignette Effect -->
        <div class="vignette-overlay">
            <div class="absolute inset-0 bg-radial-gradient from-transparent via-brand-navy/50 to-brand-navy"></div>
        </div>
        
        <!-- Main Content -->
        <div class="hero-content">
            <h1 class="hero-title">
                <?php echo esc_html(get_theme_mod('hero_title', 'APEX CONSULTING')); ?>
            </h1>
            
            <p class="hero-tagline">
                <?php echo esc_html(get_theme_mod('hero_tagline', 'Transforming Complexity Into Clarity')); ?>
            </p>
            
            <button class="hero-cta" onclick="document.getElementById('about').scrollIntoView({behavior: 'smooth'})">
                <span>Discover</span>
            </button>
        </div>
        
        <!-- Scroll Indicator -->
        <div class="scroll-indicator">
            <span>Scroll</span>
            <div class="mouse">
                <div class="wheel"></div>
            </div>
        </div>
    </section>
    
    <!-- About Section -->
    <section id="about" class="about-section">
        <div class="about-content">
            <div class="about-text">
                <h2>Our Story</h2>
                <p>
                    <span class="magnetic-word">Founded on the belief that</span>
                    <span class="magnetic-word">every challenge contains</span>
                    <span class="magnetic-word">the seeds of transformation,</span>
                    <span class="magnetic-word">Apex Consulting has</span>
                    <span class="magnetic-word">guided Fortune 500 companies</span>
                    <span class="magnetic-word">through their most critical</span>
                    <span class="magnetic-word">moments of change.</span>
                </p>
                <p>
                    We combine deep industry expertise with innovative methodologies
                    to deliver results that exceed expectations and create lasting impact.
                </p>
            </div>
            
            <div class="about-cards">
                <div class="about-card mission">
                    <h3>Mission</h3>
                    <p>
                        To empower organizations with strategic clarity, operational excellence,
                        and transformative insights that drive sustainable growth.
                    </p>
                </div>
                
                <div class="about-card values">
                    <h3>Values</h3>
                    <ul class="mission">
                        <li>Integrity in every engagement</li>
                        <li>Innovation through collaboration</li>
                        <li>Excellence as a standard</li>
                        <li>Impact that endures</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Services Section -->
    <section id="services" class="services-section">
        <!-- Central Geometric Shape -->
        <div class="services-geometry">
            <svg viewBox="0 0 200 200">
                <polygon points="100,10 190,50 190,150 100,190 10,150 10,50" fill="none" stroke="#d4af37" stroke-width="0.5"/>
                <polygon points="100,30 170,60 170,140 100,170 30,140 30,60" fill="none" stroke="#14b8a6" stroke-width="0.5"/>
                <circle cx="100" cy="100" r="50" fill="none" stroke="#f59e0b" stroke-width="0.5"/>
            </svg>
        </div>
        
        <div class="container">
            <h2 class="section-title">Our Services</h2>
            
            <div class="services-grid">
                <?php
                $services = array(
                    array(
                        'icon' => '🎯',
                        'title' => 'Strategic Planning',
                        'description' => 'Comprehensive roadmap development aligned with your vision and market dynamics.',
                        'benefits' => array('Market Analysis', 'Competitive Intelligence', 'Growth Strategy'),
                    ),
                    array(
                        'icon' => '💻',
                        'title' => 'Digital Transformation',
                        'description' => 'End-to-end digital modernization leveraging cutting-edge technologies.',
                        'benefits' => array('Cloud Migration', 'Process Automation', 'Data Analytics'),
                    ),
                    array(
                        'icon' => '⚡',
                        'title' => 'Operational Excellence',
                        'description' => 'Streamlining operations for maximum efficiency and scalability.',
                        'benefits' => array('Process Optimization', 'Lean Methodologies', 'Quality Management'),
                    ),
                    array(
                        'icon' => '🤝',
                        'title' => 'Mergers & Acquisitions',
                        'description' => 'Strategic guidance through complex M&A transactions and integrations.',
                        'benefits' => array('Due Diligence', 'Valuation Analysis', 'Post-Merger Integration'),
                    ),
                    array(
                        'icon' => '🛡️',
                        'title' => 'Risk Management',
                        'description' => 'Proactive identification and mitigation of business risks.',
                        'benefits' => array('Risk Assessment', 'Compliance Frameworks', 'Crisis Management'),
                    ),
                    array(
                        'icon' => '🌱',
                        'title' => 'Sustainability',
                        'description' => 'Building sustainable practices that drive long-term value.',
                        'benefits' => array('ESG Strategy', 'Carbon Reduction', 'Circular Economy'),
                    ),
                );
                
                foreach ($services as $service) :
                ?>
                <div class="service-card">
                    <div class="service-icon"><?php echo esc_html($service['icon']); ?></div>
                    <h3><?php echo esc_html($service['title']); ?></h3>
                    <p><?php echo esc_html($service['description']); ?></p>
                    <ul class="service-benefits">
                        <?php foreach ($service['benefits'] as $benefit) : ?>
                        <li><?php echo esc_html($benefit); ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    
    <!-- Process Section -->
    <section id="process" class="process-section">
        <!-- Progress Indicator -->
        <div class="process-progress">
            <svg>
                <circle cx="60" cy="60" r="50"></circle>
                <circle cx="60" cy="60" r="50"></circle>
            </svg>
            <span class="process-progress-label">Process</span>
        </div>
        
        <div class="container">
            <h2 class="section-title">Our Methodology</h2>
            <p class="section-subtitle">
                A proven five-phase approach that accelerates transformation and ensures sustainable results.
            </p>
            
            <div class="process-timeline">
                <?php
                $process_steps = array(
                    array(
                        'phase' => 'Discovery',
                        'title' => 'Understanding Your Challenge',
                        'description' => 'Deep dive into your organization, industry, and specific challenges.',
                        'deliverables' => array('Stakeholder Interviews', 'Current State Assessment', 'Opportunity Mapping'),
                        'duration' => '2-3 weeks',
                    ),
                    array(
                        'phase' => 'Analysis',
                        'title' => 'Data-Driven Insights',
                        'description' => 'Rigorous analysis to uncover root causes and hidden opportunities.',
                        'deliverables' => array('Market Analysis', 'Competitive Benchmarking', 'Financial Modeling'),
                        'duration' => '3-4 weeks',
                    ),
                    array(
                        'phase' => 'Strategy',
                        'title' => 'Crafting the Path Forward',
                        'description' => 'Developing actionable strategies tailored to your unique situation.',
                        'deliverables' => array('Strategic Roadmap', 'Implementation Plan', 'Risk Mitigation'),
                        'duration' => '2-3 weeks',
                    ),
                    array(
                        'phase' => 'Execution',
                        'title' => 'Turning Vision into Reality',
                        'description' => 'Hands-on support to ensure successful implementation.',
                        'deliverables' => array('Change Management', 'Process Optimization', 'Performance Tracking'),
                        'duration' => '8-12 weeks',
                    ),
                    array(
                        'phase' => 'Transformation',
                        'title' => 'Sustainable Impact',
                        'description' => 'Embedding capabilities for long-term success.',
                        'deliverables' => array('Capability Building', 'Knowledge Transfer', 'Continuous Improvement'),
                        'duration' => 'Ongoing',
                    ),
                );
                
                foreach ($process_steps as $index => $step) :
                ?>
                <div class="process-step" id="process-step-<?php echo esc_attr($index); ?>">
                    <div class="process-card">
                        <div class="process-header">
                            <div class="process-number"><?php echo esc_html($index + 1); ?></div>
                            <div class="process-phase">
                                <span>Phase <?php echo esc_html($index + 1); ?></span>
                                <h3><?php echo esc_html($step['phase']); ?></h3>
                            </div>
                        </div>
                        
                        <h4><?php echo esc_html($step['title']); ?></h4>
                        <p><?php echo esc_html($step['description']); ?></p>
                        
                        <ul class="process-deliverables">
                            <?php foreach ($step['deliverables'] as $deliverable) : ?>
                            <li><?php echo esc_html($deliverable); ?></li>
                            <?php endforeach; ?>
                        </ul>
                        
                        <div class="process-duration">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span><?php echo esc_html($step['duration']); ?></span>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    
    <!-- Case Studies Section -->
    <section id="case-studies" class="case-studies-section">
        <!-- Gravity Well Effect -->
        <div class="gravity-well"></div>
        
        <div class="container">
            <h2 class="section-title">Results That Speak</h2>
            <p class="section-subtitle">
                Real transformations for industry leaders across the globe.
            </p>
            
            <div class="case-studies-grid">
                <?php
                $case_studies = array(
                    array(
                        'logo' => '🏢',
                        'client' => 'Fortune 100 Tech Company',
                        'challenge' => 'Digital transformation across 40 countries',
                        'solution' => 'Implemented cloud-first strategy with AI-powered automation',
                        'results' => array(
                            array('metric' => '47%', 'label' => 'Cost Reduction'),
                            array('metric' => '3.2x', 'label' => 'Faster Time to Market'),
                            array('metric' => '$2.4B', 'label' => 'Value Created'),
                        ),
                    ),
                    array(
                        'logo' => '🏦',
                        'client' => 'Global Financial Services',
                        'challenge' => 'Regulatory compliance modernization',
                        'solution' => 'Built real-time risk monitoring platform',
                        'results' => array(
                            array('metric' => '99.9%', 'label' => 'Compliance Rate'),
                            array('metric' => '60%', 'label' => 'Faster Reporting'),
                            array('metric' => '$500M', 'label' => 'Risk Mitigated'),
                        ),
                    ),
                    array(
                        'logo' => '🏥',
                        'client' => 'Healthcare Leader',
                        'challenge' => 'Patient experience transformation',
                        'solution' => 'End-to-end digital patient journey redesign',
                        'results' => array(
                            array('metric' => '85%', 'label' => 'Patient Satisfaction'),
                            array('metric' => '40%', 'label' => 'Wait Time Reduction'),
                            array('metric' => '2M+', 'label' => 'Patients Impacted'),
                        ),
                    ),
                    array(
                        'logo' => '🏭',
                        'client' => 'Manufacturing Giant',
                        'challenge' => 'Supply chain resilience',
                        'solution' => 'AI-driven predictive supply network',
                        'results' => array(
                            array('metric' => '95%', 'label' => 'On-Time Delivery'),
                            array('metric' => '30%', 'label' => 'Inventory Optimization'),
                            array('metric' => '$1.1B', 'label' => 'Efficiency Gains'),
                        ),
                    ),
                );
                
                foreach ($case_studies as $study) :
                ?>
                <div class="case-study-card">
                    <div class="case-study-header">
                        <span class="case-study-logo"><?php echo esc_html($study['logo']); ?></span>
                        <h3><?php echo esc_html($study['client']); ?></h3>
                    </div>
                    
                    <div class="case-study-details">
                        <div class="case-study-detail challenge">
                            <span>Challenge</span>
                            <p><?php echo esc_html($study['challenge']); ?></p>
                        </div>
                        <div class="case-study-detail solution">
                            <span>Solution</span>
                            <p><?php echo esc_html($study['solution']); ?></p>
                        </div>
                    </div>
                    
                    <div class="case-study-metrics">
                        <?php foreach ($study['results'] as $result) : ?>
                        <div class="metric-item">
                            <div class="metric-value"><?php echo esc_html($result['metric']); ?></div>
                            <div class="metric-label"><?php echo esc_html($result['label']); ?></div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    
    <!-- Insights Section -->
    <section id="insights" class="insights-section">
        <!-- Neural Network Background -->
        <div class="neural-network">
            <svg>
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#d4af37" stop-opacity="0"/>
                        <stop offset="50%" stop-color="#14b8a6" stop-opacity="0.5"/>
                        <stop offset="100%" stop-color="#d4af37" stop-opacity="0"/>
                    </linearGradient>
                </defs>
                <!-- Connection Lines -->
                <?php for ($i = 0; $i < 10; $i++) : ?>
                <line class="connection-line" 
                      x1="<?php echo rand(0, 100); ?>%" 
                      y1="<?php echo rand(0, 100); ?>%" 
                      x2="<?php echo rand(0, 100); ?>%" 
                      y2="<?php echo rand(0, 100); ?>%" 
                      stroke="url(#lineGradient)" 
                      stroke-width="1" 
                      stroke-dasharray="10 5" 
                      fill="none"/>
                <?php endfor; ?>
                
                <!-- Nodes -->
                <?php for ($i = 0; $i < 20; $i++) : ?>
                <circle cx="<?php echo rand(0, 100); ?>%" cy="<?php echo rand(0, 100); ?>%" r="3" fill="#14b8a6" opacity="0.6"/>
                <?php endfor; ?>
            </svg>
        </div>
        
        <div class="container">
            <h2 class="section-title">Insights & Thinking</h2>
            <p class="section-subtitle">
                Perspectives on the trends shaping business today and tomorrow.
            </p>
            
            <!-- Filter Tabs -->
            <div class="insights-filters">
                <?php $filters = array('All', 'Strategy', 'Operations', 'Technology', 'Sustainability'); ?>
                <?php foreach ($filters as $filter) : ?>
                <button class="filter-btn<?php echo $filter === 'All' ? ' active' : ''; ?>">
                    <?php echo esc_html($filter); ?>
                </button>
                <?php endforeach; ?>
            </div>
            
            <div class="insights-grid">
                <?php
                $insights = array(
                    array(
                        'title' => 'The Future of Digital Transformation',
                        'category' => 'Strategy',
                        'date' => 'December 2024',
                        'excerpt' => 'How AI and automation are reshaping the competitive landscape.',
                        'readTime' => '8 min read',
                    ),
                    array(
                        'title' => 'Building Resilient Supply Chains',
                        'category' => 'Operations',
                        'date' => 'November 2024',
                        'excerpt' => 'Lessons from global disruptions and paths to resilience.',
                        'readTime' => '6 min read',
                    ),
                    array(
                        'title' => 'ESG as a Strategic Advantage',
                        'category' => 'Sustainability',
                        'date' => 'November 2024',
                        'excerpt' => 'Turning environmental commitments into business value.',
                        'readTime' => '7 min read',
                    ),
                    array(
                        'title' => 'The Human Element in Automation',
                        'category' => 'Technology',
                        'date' => 'October 2024',
                        'excerpt' => 'Balancing efficiency with employee experience.',
                        'readTime' => '5 min read',
                    ),
                );
                
                foreach ($insights as $insight) :
                ?>
                <article class="insight-card">
                    <div class="insight-meta">
                        <span class="insight-category"><?php echo esc_html($insight['category']); ?></span>
                        <span class="insight-date"><?php echo esc_html($insight['date']); ?></span>
                    </div>
                    
                    <h3><?php echo esc_html($insight['title']); ?></h3>
                    <p class="insight-excerpt"><?php echo esc_html($insight['excerpt']); ?></p>
                    
                    <div class="insight-footer">
                        <span class="insight-read-time"><?php echo esc_html($insight['readTime']); ?></span>
                        <svg class="insight-arrow" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                    </div>
                </article>
                <?php endforeach; ?>
            </div>
            
            <a href="#" class="view-all-link">
                <span>View All Insights</span>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
            </a>
        </div>
    </section>
    
    <!-- Team Section -->
    <section id="team" class="team-section">
        <!-- Starfield Background -->
        <div class="starfield" id="starfield">
            <?php for ($i = 0; $i < 100; $i++) : ?>
            <div class="starfield-star" style="left: <?php echo rand(0, 100); ?>%; top: <?php echo rand(0, 100); ?>%; animation-delay: <?php echo rand(0, 3000); ?>ms;"></div>
            <?php endfor; ?>
        </div>
        
        <div class="team-departments">
            <h2 class="section-title">Our Constellation</h2>
            <p class="section-subtitle">
                Brilliant minds assembled to illuminate your path forward.
            </p>
            
            <!-- Leadership -->
            <div class="department-section">
                <h3 class="department-title">Leadership</h3>
                <div class="team-grid leadership">
                    <?php
                    $leadership = array(
                        array('name' => 'Alexandra Chen', 'role' => 'CEO & Founder', 'star' => '★'),
                        array('name' => 'Marcus Williams', 'role' => 'Managing Partner', 'star' => '★'),
                    );
                    
                    foreach ($leadership as $member) :
                    ?>
                    <div class="team-card leadership">
                        <div class="team-star"><?php echo esc_html($member['star']); ?></div>
                        <h4 class="team-name"><?php echo esc_html($member['name']); ?></h4>
                        <p class="team-role"><?php echo esc_html($member['role']); ?></p>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
            
            <!-- Department Heads -->
            <div class="department-section">
                <h3 class="department-title">Department Heads</h3>
                <div class="team-grid heads">
                    <?php
                    $heads = array(
                        array('name' => 'Sarah Mitchell', 'role' => 'Head of Strategy', 'star' => '☆'),
                        array('name' => 'David Park', 'role' => 'Head of Technology', 'star' => '☆'),
                        array('name' => 'Emma Rodriguez', 'role' => 'Head of Operations', 'star' => '☆'),
                    );
                    
                    foreach ($heads as $member) :
                    ?>
                    <div class="team-card heads">
                        <div class="team-star"><?php echo esc_html($member['star']); ?></div>
                        <h4 class="team-name"><?php echo esc_html($member['name']); ?></h4>
                        <p class="team-role"><?php echo esc_html($member['role']); ?></p>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
            
            <!-- Extended Team -->
            <div class="department-section">
                <h3 class="department-title">Senior Team</h3>
                <div class="team-grid members">
                    <?php
                    $members = array(
                        array('name' => 'James Thompson', 'role' => 'Senior Consultant', 'star' => '☆'),
                        array('name' => 'Lisa Wang', 'role' => 'Senior Consultant', 'star' => '☆'),
                        array('name' => 'Michael Brown', 'role' => 'Consultant', 'star' => '·'),
                    );
                    
                    foreach ($members as $member) :
                    ?>
                    <div class="team-card members">
                        <div class="team-star"><?php echo esc_html($member['star']); ?></div>
                        <h4 class="team-name"><?php echo esc_html($member['name']); ?></h4>
                        <p class="team-role"><?php echo esc_html($member['role']); ?></p>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
            
            <!-- Careers CTA -->
            <div class="team-cta">
                <a href="#" class="team-cta-btn">
                    <span>Join Our Constellation</span>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                </a>
            </div>
        </div>
    </section>
    
    <!-- Contact Section -->
    <section id="contact" class="contact-section">
        <!-- Convergence Point -->
        <div class="convergence-point">
            <div class="converge-element"></div>
            <?php for ($i = 0; $i < 12; $i++) : ?>
            <div class="converge-element small" style="transform: rotate(<?php echo $i * 30; ?>deg) translateX(100px);"></div>
            <?php endfor; ?>
        </div>
        
        <!-- Energy Burst -->
        <div class="energy-burst"></div>
        
        <div class="contact-form-wrapper">
            <h2 class="section-title">Let's Converge</h2>
            <p class="section-subtitle">
                Everything comes together when we work together.
            </p>
            
            <form class="contact-form" id="contact-form" method="post">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="name" class="form-label">Name</label>
                        <input type="text" id="name" name="name" required class="form-input" placeholder="Your name">
                    </div>
                    
                    <div class="form-group">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" id="email" name="email" required class="form-input" placeholder="your@email.com">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="company" class="form-label">Company</label>
                    <input type="text" id="company" name="company" class="form-input" placeholder="Your company">
                </div>
                
                <div class="form-group">
                    <label for="message" class="form-label">Message</label>
                    <textarea id="message" name="message" rows="5" required class="form-textarea" placeholder="Tell us about your challenge..."></textarea>
                </div>
                
                <button type="submit" class="submit-btn">
                    <span>Send Message</span>
                </button>
            </form>
        </div>
        
        <!-- Direct Contact Info -->
        <div class="contact-info">
            <div class="contact-info-item">
                <div class="contact-info-icon">📧</div>
                <p class="contact-info-text"><?php echo esc_html(get_theme_mod('contact_email', 'hello@apexconsulting.com')); ?></p>
            </div>
            <div class="contact-info-item">
                <div class="contact-info-icon">📞</div>
                <p class="contact-info-text"><?php echo esc_html(get_theme_mod('contact_phone', '+1 (555) 123-4567')); ?></p>
            </div>
            <div class="contact-info-item">
                <div class="contact-info-icon">📍</div>
                <p class="contact-info-text"><?php echo esc_html(get_theme_mod('contact_locations', 'New York • London • Singapore')); ?></p>
            </div>
        </div>
        
        <!-- Social Links -->
        <div class="social-links">
            <a href="#" class="social-link">LinkedIn</a>
            <a href="#" class="social-link">Twitter</a>
            <a href="#" class="social-link">Medium</a>
        </div>
    </section>

</main>

<!-- Current Section Indicator -->
<div class="current-section-indicator">
    <span class="text-xs text-gray-500 uppercase tracking-widest">
        <span id="current-section">Hero</span>
    </span>
</div>

<?php get_footer(); ?>
