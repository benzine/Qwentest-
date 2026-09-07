<?php
/**
 * Section Templates Class
 * Manages pre-designed section templates
 */

if (!defined('ABSPATH')) {
    exit;
}

class Headless_Builder_Section_Templates {
    
    /**
     * Constructor
     */
    public function __construct() {
        add_action('init', array($this, 'register_default_templates'));
        add_filter('rest_prepare_hb_section_template', array($this, 'add_template_data_to_rest'), 10, 3);
    }
    
    /**
     * Register default templates on plugin activation
     */
    public function register_default_templates() {
        // Check if templates already exist
        $templates_registered = get_option('hb_templates_registered', false);
        
        if ($templates_registered) {
            return;
        }
        
        $default_templates = $this->get_default_templates();
        
        foreach ($default_templates as $template) {
            $post_id = wp_insert_post(array(
                'post_title' => $template['title'],
                'post_type' => 'hb_section_template',
                'post_status' => 'publish',
                'post_excerpt' => $template['description'],
            ));
            
            if ($post_id && !is_wp_error($post_id)) {
                update_post_meta($post_id, '_hb_template_data', $template['data']);
                
                // Set template category
                if (isset($template['category'])) {
                    update_post_meta($post_id, '_hb_template_category', $template['category']);
                }
            }
        }
        
        update_option('hb_templates_registered', true);
    }
    
    /**
     * Get default templates
     */
    private function get_default_templates() {
        return array(
            // Hero Sections
            array(
                'title' => __('Hero - Centered', 'headless-builder'),
                'description' => __('Centered hero with heading, subheading, and CTAs', 'headless-builder'),
                'category' => 'hero',
                'data' => array(
                    'type' => 'hero',
                    'adminLabel' => __('Hero - Centered', 'headless-builder'),
                    'layout' => array(
                        'verticalAlign' => 'center',
                        'horizontalAlign' => 'center',
                        'padding' => array('top' => '120px', 'bottom' => '120px'),
                        'backgroundColor' => '#ffffff',
                    ),
                    'modules' => array(
                        array(
                            'type' => 'heading',
                            'content' => array(
                                'text' => __('Build Something Amazing', 'headless-builder'),
                                'tag' => 'h1',
                            ),
                        ),
                        array(
                            'type' => 'text',
                            'content' => array(
                                'text' => __('Create stunning websites with our powerful headless builder.', 'headless-builder'),
                            ),
                        ),
                        array(
                            'type' => 'button-group',
                            'content' => array(
                                'buttons' => array(
                                    array(
                                        'text' => __('Get Started', 'headless-builder'),
                                        'url' => '#contact',
                                        'style' => 'primary',
                                    ),
                                    array(
                                        'text' => __('Learn More', 'headless-builder'),
                                        'url' => '#about',
                                        'style' => 'outline',
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
            
            // Features Sections
            array(
                'title' => __('Features - Grid', 'headless-builder'),
                'description' => __('Feature grid with icons and descriptions', 'headless-builder'),
                'category' => 'features',
                'data' => array(
                    'type' => 'features',
                    'adminLabel' => __('Features - Grid', 'headless-builder'),
                    'layout' => array(
                        'columns' => 3,
                        'padding' => array('top' => '80px', 'bottom' => '80px'),
                        'backgroundColor' => '#f8f9fa',
                    ),
                    'modules' => array(
                        array(
                            'type' => 'heading',
                            'content' => array(
                                'text' => __('Why Choose Us', 'headless-builder'),
                                'tag' => 'h2',
                            ),
                        ),
                        array(
                            'type' => 'feature-grid',
                            'content' => array(
                                'items' => array(
                                    array(
                                        'icon' => 'zap',
                                        'title' => __('Lightning Fast', 'headless-builder'),
                                        'description' => __('Optimized for speed and performance.', 'headless-builder'),
                                    ),
                                    array(
                                        'icon' => 'shield',
                                        'title' => __('Secure', 'headless-builder'),
                                        'description' => __('Built with security best practices.', 'headless-builder'),
                                    ),
                                    array(
                                        'icon' => 'settings',
                                        'title' => __('Customizable', 'headless-builder'),
                                        'description' => __('Every pixel is customizable.', 'headless-builder'),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
            
            // Testimonials
            array(
                'title' => __('Testimonials - Carousel', 'headless-builder'),
                'description' => __('Client testimonials in carousel format', 'headless-builder'),
                'category' => 'testimonials',
                'data' => array(
                    'type' => 'testimonials',
                    'adminLabel' => __('Testimonials - Carousel', 'headless-builder'),
                    'layout' => array(
                        'padding' => array('top' => '80px', 'bottom' => '80px'),
                        'backgroundColor' => '#ffffff',
                    ),
                    'modules' => array(
                        array(
                            'type' => 'heading',
                            'content' => array(
                                'text' => __('What Our Clients Say', 'headless-builder'),
                                'tag' => 'h2',
                            ),
                        ),
                        array(
                            'type' => 'testimonial-carousel',
                            'content' => array(
                                'items' => array(
                                    array(
                                        'quote' => __('This builder transformed how we create websites. Incredible!', 'headless-builder'),
                                        'name' => __('Sarah Johnson', 'headless-builder'),
                                        'role' => __('CEO, TechCorp', 'headless-builder'),
                                        'avatar' => '',
                                        'rating' => 5,
                                    ),
                                    array(
                                        'quote' => __('The best investment we made for our digital presence.', 'headless-builder'),
                                        'name' => __('Michael Chen', 'headless-builder'),
                                        'role' => __('Marketing Director', 'headless-builder'),
                                        'avatar' => '',
                                        'rating' => 5,
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
            
            // Pricing
            array(
                'title' => __('Pricing - 3 Columns', 'headless-builder'),
                'description' => __('Three-column pricing table with featured plan', 'headless-builder'),
                'category' => 'pricing',
                'data' => array(
                    'type' => 'pricing',
                    'adminLabel' => __('Pricing - 3 Columns', 'headless-builder'),
                    'layout' => array(
                        'columns' => 3,
                        'padding' => array('top' => '80px', 'bottom' => '80px'),
                        'backgroundColor' => '#ffffff',
                    ),
                    'modules' => array(
                        array(
                            'type' => 'heading',
                            'content' => array(
                                'text' => __('Simple, Transparent Pricing', 'headless-builder'),
                                'tag' => 'h2',
                            ),
                        ),
                        array(
                            'type' => 'pricing-table',
                            'content' => array(
                                'plans' => array(
                                    array(
                                        'name' => __('Starter', 'headless-builder'),
                                        'price' => '$29',
                                        'period' => '/month',
                                        'features' => array(
                                            __('5 Pages', 'headless-builder'),
                                            __('Basic Analytics', 'headless-builder'),
                                            __('Email Support', 'headless-builder'),
                                        ),
                                        'cta' => __('Get Started', 'headless-builder'),
                                        'featured' => false,
                                    ),
                                    array(
                                        'name' => __('Professional', 'headless-builder'),
                                        'price' => '$79',
                                        'period' => '/month',
                                        'features' => array(
                                            __('Unlimited Pages', 'headless-builder'),
                                            __('Advanced Analytics', 'headless-builder'),
                                            __('Priority Support', 'headless-builder'),
                                            __('Custom Domain', 'headless-builder'),
                                        ),
                                        'cta' => __('Get Started', 'headless-builder'),
                                        'featured' => true,
                                    ),
                                    array(
                                        'name' => __('Enterprise', 'headless-builder'),
                                        'price' => '$199',
                                        'period' => '/month',
                                        'features' => array(
                                            __('Everything in Pro', 'headless-builder'),
                                            __('Dedicated Support', 'headless-builder'),
                                            __('Custom Integrations', 'headless-builder'),
                                            __('SLA Guarantee', 'headless-builder'),
                                        ),
                                        'cta' => __('Contact Sales', 'headless-builder'),
                                        'featured' => false,
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
            
            // Contact
            array(
                'title' => __('Contact - Split', 'headless-builder'),
                'description' => __('Contact form with contact info sidebar', 'headless-builder'),
                'category' => 'contact',
                'data' => array(
                    'type' => 'contact',
                    'adminLabel' => __('Contact - Split', 'headless-builder'),
                    'layout' => array(
                        'columns' => 2,
                        'padding' => array('top' => '80px', 'bottom' => '80px'),
                        'backgroundColor' => '#f8f9fa',
                    ),
                    'modules' => array(
                        array(
                            'type' => 'contact-info',
                            'content' => array(
                                'heading' => __('Get in Touch', 'headless-builder'),
                                'email' => 'hello@example.com',
                                'phone' => '+1 (555) 123-4567',
                                'address' => __('123 Main St, City, Country', 'headless-builder'),
                            ),
                        ),
                        array(
                            'type' => 'contact-form',
                            'content' => array(
                                'fields' => array(
                                    array('type' => 'text', 'label' => __('Name', 'headless-builder'), 'required' => true),
                                    array('type' => 'email', 'label' => __('Email', 'headless-builder'), 'required' => true),
                                    array('type' => 'textarea', 'label' => __('Message', 'headless-builder'), 'required' => true),
                                ),
                                'submitText' => __('Send Message', 'headless-builder'),
                            ),
                        ),
                    ),
                ),
            ),
            
            // CTA
            array(
                'title' => __('CTA - Banner', 'headless-builder'),
                'description' => __('Call-to-action banner with button', 'headless-builder'),
                'category' => 'cta',
                'data' => array(
                    'type' => 'cta',
                    'adminLabel' => __('CTA - Banner', 'headless-builder'),
                    'layout' => array(
                        'verticalAlign' => 'center',
                        'padding' => array('top' => '60px', 'bottom' => '60px'),
                        'backgroundColor' => '#0066cc',
                        'textColor' => '#ffffff',
                    ),
                    'modules' => array(
                        array(
                            'type' => 'heading',
                            'content' => array(
                                'text' => __('Ready to Get Started?', 'headless-builder'),
                                'tag' => 'h2',
                            ),
                        ),
                        array(
                            'type' => 'text',
                            'content' => array(
                                'text' => __('Join thousands of satisfied customers today.', 'headless-builder'),
                            ),
                        ),
                        array(
                            'type' => 'button',
                            'content' => array(
                                'text' => __('Start Free Trial', 'headless-builder'),
                                'url' => '#signup',
                                'style' => 'white',
                            ),
                        ),
                    ),
                ),
            ),
        );
    }
    
    /**
     * Add template data to REST response
     */
    public function add_template_data_to_rest($response, $post, $request) {
        $template_data = get_post_meta($post->ID, '_hb_template_data', true);
        $category = get_post_meta($post->ID, '_hb_template_category', true);
        
        $data = $response->get_data();
        $data['templateData'] = $template_data ?: array();
        $data['category'] = $category ?: 'general';
        $response->set_data($data);
        
        return $response;
    }
}
