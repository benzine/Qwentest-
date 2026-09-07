/*
 * Template Functions for Apex Consulting Theme
 *
 * @package Apex_Consulting
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Get theme assets URL
 */
if (!function_exists('apex_asset_url')) {
    function apex_asset_url($path = '') {
        return get_template_directory_uri() . '/assets/' . ltrim($path, '/');
    }
}

/**
 * Get Studio setting (from backoffice)
 */
if (!function_exists('apex_get_studio_setting')) {
    function apex_get_studio_setting($key, $default = '') {
        $settings = get_option('theme_studio_settings', array());
        
        if (isset($settings[$key]) && !empty($settings[$key])) {
            return $settings[$key];
        }
        
        // Fallback to theme_mod for backwards compatibility
        return get_theme_mod($key, $default);
    }
}

/**
 * Get services from Studio settings
 */
if (!function_exists('apex_get_services')) {
    function apex_get_services() {
        $settings = get_option('theme_studio_settings', array());
        
        if (!empty($settings['services']) && is_array($settings['services'])) {
            return $settings['services'];
        }
        
        // Default services
        return array(
            array('title' => 'Strategy', 'description' => 'Data-driven insights and roadmaps.', 'icon' => 'dashicons-lightbulb'),
            array('title' => 'Design', 'description' => 'Pixel-perfect UI/UX experiences.', 'icon' => 'dashicons-art'),
            array('title' => 'Development', 'description' => 'Robust, scalable solutions.', 'icon' => 'dashicons-code-standards'),
            array('title' => 'Analytics', 'description' => 'Performance optimization.', 'icon' => 'dashicons-chart-line'),
        );
    }
}

/**
 * Get team members from Studio settings
 */
if (!function_exists('apex_get_studio_team')) {
    function apex_get_studio_team() {
        $settings = get_option('theme_studio_settings', array());
        
        if (!empty($settings['team']) && is_array($settings['team'])) {
            return $settings['team'];
        }
        
        // Return default team structure
        return array();
    }
}

/**
 * Get section navigation items
 */
if (!function_exists('apex_get_section_nav')) {
    function apex_get_section_nav() {
        return array(
            'hero' => 'Hero',
            'about' => 'About',
            'services' => 'Services',
            'process' => 'Process',
            'case-studies' => 'Case Studies',
            'insights' => 'Insights',
            'team' => 'Team',
            'contact' => 'Contact',
        );
    }
}

/**
 * Display breadcrumbs (for inner pages)
 */
if (!function_exists('apex_breadcrumbs')) {
    function apex_breadcrumbs() {
        if (is_front_page()) {
            return;
        }
        
        echo '<nav class="breadcrumbs" aria-label="Breadcrumb">';
        echo '<a href="' . esc_url(home_url('/')) . '">Home</a>';
        
        if (is_category() || is_single()) {
            echo ' <span class="separator">/</span> ';
            the_category(' / ');
            
            if (is_single()) {
                echo ' <span class="separator">/</span> ';
                the_title();
            }
        } elseif (is_page()) {
            echo ' <span class="separator">/</span> ';
            the_title();
        } elseif (is_search()) {
            echo ' <span class="separator">/</span> ';
            printf('Search Results for "%s"', get_search_query());
        } elseif (is_404()) {
            echo ' <span class="separator">/</span> ';
            echo '404 Not Found';
        }
        
        echo '</nav>';
    }
}

/**
 * Get process steps data
 */
if (!function_exists('apex_get_process_steps')) {
    function apex_get_process_steps() {
        return array(
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
    }
}

/**
 * Get team members data
 */
if (!function_exists('apex_get_team_members')) {
    function apex_get_team_members() {
        return array(
            'leadership' => array(
                array('name' => 'Alexandra Chen', 'role' => 'CEO & Founder', 'star' => '★'),
                array('name' => 'Marcus Williams', 'role' => 'Managing Partner', 'star' => '★'),
            ),
            'heads' => array(
                array('name' => 'Sarah Mitchell', 'role' => 'Head of Strategy', 'star' => '☆'),
                array('name' => 'David Park', 'role' => 'Head of Technology', 'star' => '☆'),
                array('name' => 'Emma Rodriguez', 'role' => 'Head of Operations', 'star' => '☆'),
            ),
            'members' => array(
                array('name' => 'James Thompson', 'role' => 'Senior Consultant', 'star' => '☆'),
                array('name' => 'Lisa Wang', 'role' => 'Senior Consultant', 'star' => '☆'),
                array('name' => 'Michael Brown', 'role' => 'Consultant', 'star' => '·'),
            ),
        );
    }
}

/**
 * Get insights/posts with custom fields
 */
if (!function_exists('apex_get_insights')) {
    function apex_get_insights($number = 4) {
        $args = array(
            'post_type' => 'post',
            'posts_per_page' => $number,
            'orderby' => 'date',
            'order' => 'DESC',
        );
        
        $query = new WP_Query($args);
        $insights = array();
        
        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                
                $categories = get_the_category();
                $category = !empty($categories) ? $categories[0]->name : 'Uncategorized';
                
                $insights[] = array(
                    'title' => get_the_title(),
                    'category' => $category,
                    'date' => get_the_date('F Y'),
                    'excerpt' => get_the_excerpt(),
                    'readTime' => apex_reading_time(),
                    'permalink' => get_permalink(),
                );
            }
            wp_reset_postdata();
        }
        
        return $insights;
    }
}
