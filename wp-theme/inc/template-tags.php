/*
 * Custom Template Tags for Apex Consulting Theme
 *
 * @package Apex_Consulting
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Display fallback menu when no menu is assigned
 */
if (!function_exists('apex_fallback_menu')) {
    function apex_fallback_menu() {
        ?>
        <ul class="nav-menu">
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#process">Process</a></li>
            <li><a href="#case-studies">Case Studies</a></li>
            <li><a href="#insights">Insights</a></li>
            <li><a href="#team">Team</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
        <?php
    }
}

/**
 * Display post thumbnail with responsive sizes
 */
if (!function_exists('apex_post_thumbnail')) {
    function apex_post_thumbnail($size = 'post-thumbnail', $attrs = array()) {
        if (has_post_thumbnail()) {
            the_post_thumbnail($size, $attrs);
        }
    }
}

/**
 * Display reading time for posts
 */
if (!function_exists('apex_reading_time')) {
    function apex_reading_time() {
        $content = get_post_field('post_content');
        $word_count = str_word_count(strip_tags($content));
        $reading_time = ceil($word_count / 200);
        
        return sprintf(
            _n('%d min read', '%d min read', $reading_time, 'apex'),
            $reading_time
        );
    }
}

/**
 * Display social links
 */
if (!function_exists('apex_social_links')) {
    function apex_social_links() {
        $social_links = array(
            'linkedin' => get_theme_mod('social_linkedin', '#'),
            'twitter' => get_theme_mod('social_twitter', '#'),
            'medium' => get_theme_mod('social_medium', '#'),
        );
        
        foreach ($social_links as $platform => $url) {
            if ($url && $url !== '#') {
                printf(
                    '<a href="%s" class="social-link" target="_blank" rel="noopener">%s</a>',
                    esc_url($url),
                    esc_html(ucfirst($platform))
                );
            }
        }
    }
}

/**
 * Get service data
 */
if (!function_exists('apex_get_services')) {
    function apex_get_services() {
        return array(
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
    }
}

/**
 * Get case studies data
 */
if (!function_exists('apex_get_case_studies')) {
    function apex_get_case_studies() {
        return array(
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
    }
}
