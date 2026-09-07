<?php
/**
 * Post Meta Storage Class
 * Handles structured JSON storage for page layouts and sections
 */

if (!defined('ABSPATH')) {
    exit;
}

class Headless_Builder_Post_Meta_Storage {
    
    /**
     * Meta key for storing page layout data
     */
    const META_KEY = '_hb_page_layout';
    
    /**
     * Meta key for storing global settings
     */
    const SETTINGS_META_KEY = '_hb_global_settings';
    
    /**
     * Constructor
     */
    public function __construct() {
        add_action('init', array($this, 'register_meta'));
        add_filter('rest_prepare_page', array($this, 'add_layout_to_rest_response'), 10, 3);
    }
    
    /**
     * Register meta fields for REST API
     */
    public function register_meta() {
        register_post_meta('page', self::META_KEY, array(
            'show_in_rest' => array(
                'schema' => array(
                    'type' => 'object',
                    'description' => __('Page layout data stored as JSON', 'headless-builder'),
                ),
            ),
            'single' => true,
            'type' => 'object',
            'default' => array(
                'sections' => array(),
                'header' => array(),
                'footer' => array(),
            ),
        ));
        
        register_post_meta('page', self::SETTINGS_META_KEY, array(
            'show_in_rest' => array(
                'schema' => array(
                    'type' => 'object',
                    'description' => __('Page-specific settings', 'headless-builder'),
                ),
            ),
            'single' => true,
            'type' => 'object',
            'default' => array(),
        ));
        
        // Register meta for global blocks
        register_post_meta('hb_global_block', '_hb_block_data', array(
            'show_in_rest' => true,
            'single' => true,
            'type' => 'object',
        ));
        
        // Register meta for section templates
        register_post_meta('hb_section_template', '_hb_template_data', array(
            'show_in_rest' => true,
            'single' => true,
            'type' => 'object',
        ));
    }
    
    /**
     * Add layout data to REST API response
     */
    public function add_layout_to_rest_response($response, $post, $request) {
        if ($post->post_type !== 'page') {
            return $response;
        }
        
        $layout = get_post_meta($post->ID, self::META_KEY, true);
        
        if (empty($layout)) {
            $layout = array(
                'sections' => array(),
                'header' => $this->get_default_header(),
                'footer' => $this->get_default_footer(),
                'settings' => array(),
            );
        }
        
        $data = $response->get_data();
        $data['hb_layout'] = $layout;
        $response->set_data($data);
        
        return $response;
    }
    
    /**
     * Get page layout
     */
    public static function get_page_layout($post_id) {
        $layout = get_post_meta($post_id, self::META_KEY, true);
        
        if (empty($layout)) {
            return array(
                'sections' => array(),
                'header' => self::get_default_header(),
                'footer' => self::get_default_footer(),
                'settings' => array(),
            );
        }
        
        return $layout;
    }
    
    /**
     * Save page layout
     */
    public static function save_page_layout($post_id, $layout) {
        // Sanitize layout data
        $sanitized_layout = self::sanitize_layout($layout);
        
        // Add revision before saving
        self::add_revision($post_id, $sanitized_layout);
        
        return update_post_meta($post_id, self::META_KEY, $sanitized_layout);
    }
    
    /**
     * Sanitize layout data
     */
    private static function sanitize_layout($layout) {
        $sanitized = array(
            'sections' => array(),
            'header' => array(),
            'footer' => array(),
            'settings' => array(),
        );
        
        if (isset($layout['sections']) && is_array($layout['sections'])) {
            foreach ($layout['sections'] as $section) {
                $sanitized['sections'][] = self::sanitize_section($section);
            }
        }
        
        if (isset($layout['header'])) {
            $sanitized['header'] = self::sanitize_header_footer($layout['header']);
        } else {
            $sanitized['header'] = self::get_default_header();
        }
        
        if (isset($layout['footer'])) {
            $sanitized['footer'] = self::sanitize_header_footer($layout['footer']);
        } else {
            $sanitized['footer'] = self::get_default_footer();
        }
        
        if (isset($layout['settings'])) {
            $sanitized['settings'] = self::sanitize_settings($layout['settings']);
        }
        
        return $sanitized;
    }
    
    /**
     * Sanitize section data
     */
    private static function sanitize_section($section) {
        $sanitized = array(
            'id' => isset($section['id']) ? sanitize_text_field($section['id']) : uniqid('sec_'),
            'type' => isset($section['type']) ? sanitize_text_field($section['type']) : 'blank',
            'adminLabel' => isset($section['adminLabel']) ? sanitize_text_field($section['adminLabel']) : '',
            'isVisible' => isset($section['isVisible']) ? (bool) $section['isVisible'] : true,
            'deviceVisibility' => isset($section['deviceVisibility']) ? 
                array_map('sanitize_text_field', (array) $section['deviceVisibility']) : ['desktop', 'tablet', 'mobile'],
            'layout' => isset($section['layout']) ? self::sanitize_layout_settings($section['layout']) : array(),
            'modules' => array(),
        );
        
        if (isset($section['modules']) && is_array($section['modules'])) {
            foreach ($section['modules'] as $module) {
                $sanitized['modules'][] = self::sanitize_module($module);
            }
        }
        
        return $sanitized;
    }
    
    /**
     * Sanitize module data
     */
    private static function sanitize_module($module) {
        $sanitized = array(
            'id' => isset($module['id']) ? sanitize_text_field($module['id']) : uniqid('mod_'),
            'type' => isset($module['type']) ? sanitize_text_field($module['type']) : 'text',
            'content' => array(),
            'styles' => array(),
        );
        
        if (isset($module['content']) && is_array($module['content'])) {
            foreach ($module['content'] as $key => $value) {
                if (is_array($value)) {
                    $sanitized['content'][$key] = array_map('sanitize_text_field', $value);
                } else {
                    // Allow HTML in content fields with wp_kses
                    $sanitized['content'][$key] = wp_kses_post($value);
                }
            }
        }
        
        if (isset($module['styles'])) {
            $sanitized['styles'] = self::sanitize_styles($module['styles']);
        }
        
        return $sanitized;
    }
    
    /**
     * Sanitize layout settings
     */
    private static function sanitize_layout_settings($layout) {
        $allowed_keys = array(
            'width', 'height', 'columns', 'verticalAlign', 'horizontalAlign',
            'padding', 'margin', 'border', 'borderRadius', 'boxShadow',
            'backgroundColor', 'backgroundGradient', 'backgroundImage', 'backgroundVideo',
            'overlayColor', 'overlayGradient', 'shapeDividerTop', 'shapeDividerBottom',
            'animation', 'customClass', 'customId', 'zIndex',
        );
        
        $sanitized = array();
        foreach ($allowed_keys as $key) {
            if (isset($layout[$key])) {
                if (is_array($layout[$key])) {
                    $sanitized[$key] = array_map('sanitize_text_field', $layout[$key]);
                } else {
                    $sanitized[$key] = sanitize_text_field($layout[$key]);
                }
            }
        }
        
        return $sanitized;
    }
    
    /**
     * Sanitize styles
     */
    private static function sanitize_styles($styles) {
        $allowed_keys = array(
            'colors', 'spacing', 'typography', 'borders', 'shadows',
            'hover', 'transitions', 'animations',
        );
        
        $sanitized = array();
        foreach ($allowed_keys as $key) {
            if (isset($styles[$key])) {
                if (is_array($styles[$key])) {
                    $sanitized[$key] = array_map('sanitize_text_field', $styles[$key]);
                } else {
                    $sanitized[$key] = sanitize_text_field($styles[$key]);
                }
            }
        }
        
        return $sanitized;
    }
    
    /**
     * Sanitize header/footer data
     */
    private static function sanitize_header_footer($data) {
        if (!is_array($data)) {
            return array();
        }
        
        $sanitized = array(
            'layout' => isset($data['layout']) ? sanitize_text_field($data['layout']) : 'default',
            'elements' => array(),
            'styles' => array(),
        );
        
        if (isset($data['elements']) && is_array($data['elements'])) {
            foreach ($data['elements'] as $element) {
                if (is_array($element)) {
                    $sanitized['elements'][] = array_map('sanitize_text_field', $element);
                }
            }
        }
        
        if (isset($data['styles'])) {
            $sanitized['styles'] = self::sanitize_styles($data['styles']);
        }
        
        return $sanitized;
    }
    
    /**
     * Sanitize global settings
     */
    private static function sanitize_settings($settings) {
        $allowed_keys = array(
            'siteIdentity', 'typography', 'colorPalette', 'spacing',
            'borders', 'shadows', 'breakpoints', 'container',
            'customCSS', 'customJS', 'pageTransitions',
        );
        
        $sanitized = array();
        foreach ($allowed_keys as $key) {
            if (isset($settings[$key])) {
                if (is_array($settings[$key])) {
                    $sanitized[$key] = array_map('sanitize_text_field', $settings[$key]);
                } else {
                    $sanitized[$key] = sanitize_text_field($settings[$key]);
                }
            }
        }
        
        return $sanitized;
    }
    
    /**
     * Add revision before saving
     */
    private static function add_revision($post_id, $layout) {
        // Implementation handled by Headless_Builder_Revisions class
        do_action('hb_before_save_layout', $post_id, $layout);
    }
    
    /**
     * Get default header structure
     */
    public static function get_default_header() {
        return array(
            'layout' => 'default',
            'elements' => array(
                array(
                    'type' => 'logo',
                    'position' => 'left',
                    'content' => array(),
                ),
                array(
                    'type' => 'navigation',
                    'position' => 'center',
                    'content' => array(
                        'menuId' => 0,
                    ),
                ),
                array(
                    'type' => 'button',
                    'position' => 'right',
                    'content' => array(
                        'text' => __('Get Started', 'headless-builder'),
                        'url' => '#contact',
                    ),
                ),
            ),
            'styles' => array(),
        );
    }
    
    /**
     * Get default footer structure
     */
    public static function get_default_footer() {
        return array(
            'layout' => 'default',
            'rows' => array(
                array(
                    'columns' => 3,
                    'elements' => array(
                        array(
                            'type' => 'logo',
                            'content' => array(),
                        ),
                        array(
                            'type' => 'navigation',
                            'content' => array(
                                'menuId' => 0,
                            ),
                        ),
                        array(
                            'type' => 'social',
                            'content' => array(),
                        ),
                    ),
                ),
                array(
                    'columns' => 1,
                    'elements' => array(
                        array(
                            'type' => 'copyright',
                            'content' => array(
                                'text' => sprintf(
                                    __('© %s All rights reserved.', 'headless-builder'),
                                    '[year]'
                                ),
                            ),
                        ),
                    ),
                ),
            ),
            'styles' => array(),
        );
    }
}
