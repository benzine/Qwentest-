<?php
/**
 * Apex Consulting Theme Functions
 *
 * @package Apex_Consulting
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Define theme constants
 */
define('APEX_THEME_VERSION', '1.0.0');
define('APEX_THEME_DIR', get_template_directory());
define('APEX_THEME_URI', get_template_directory_uri());

/**
 * Theme Setup
 */
function apex_setup() {
    // Add default posts feed to RSS head
    add_feed_link();
    
    // Add default posts feed to RSS head
    add_theme_support('automatic-feed-links');
    
    // Add title tag support
    add_theme_support('title-tag');
    
    // Add post thumbnails support
    add_theme_support('post-thumbnails');
    
    // Add custom logo support
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
    ));
    
    // Add custom background support
    add_theme_support('custom-background');
    
    // Add HTML5 support
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ));
    
    // Add customize selective refresh
    add_theme_support('customize-selective-refresh-widgets');
    
    // Register navigation menus
    register_nav_menus(array(
        'primary'   => __('Primary Menu', 'apex'),
        'footer'    => __('Footer Menu', 'apex'),
        'mobile'    => __('Mobile Menu', 'apex'),
    ));
    
    // Set content width
    if (!isset($content_width)) {
        $content_width = 1280;
    }
}
add_action('after_setup_theme', 'apex_setup');

/**
 * Enqueue scripts and styles
 */
function apex_scripts() {
    // Google Fonts
    wp_enqueue_style(
        'apex-google-fonts',
        'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap',
        array(),
        null
    );
    
    // Main stylesheet
    wp_enqueue_style(
        'apex-style',
        get_stylesheet_uri(),
        array('apex-google-fonts'),
        APEX_THEME_VERSION
    );
    
    // GSAP for animations
    wp_enqueue_script(
        'gsap',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
        array(),
        '3.12.2',
        true
    );
    
    wp_enqueue_script(
        'gsap-scrolltrigger',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
        array('gsap'),
        '3.12.2',
        true
    );
    
    // Lenis for smooth scrolling
    wp_enqueue_script(
        'lenis',
        'https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js',
        array(),
        '1.0.29',
        true
    );
    
    // Three.js for 3D effects (hero section)
    wp_enqueue_script(
        'three',
        'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
        array(),
        'r128',
        true
    );
    
    // Main theme JavaScript
    wp_enqueue_script(
        'apex-scripts',
        APEX_THEME_URI . '/assets/js/scripts.js',
        array('gsap', 'gsap-scrolltrigger', 'lenis', 'three'),
        APEX_THEME_VERSION,
        true
    );
    
    // Localize script with AJAX URL
    wp_localize_script('apex-scripts', 'apexAjax', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce'   => wp_create_nonce('apex-nonce'),
    ));
    
    // Comment reply script
    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
}
add_action('wp_enqueue_scripts', 'apex_scripts');

/**
 * Register widget areas
 */
function apex_widgets_init() {
    register_sidebar(array(
        'name'          => __('Sidebar', 'apex'),
        'id'            => 'sidebar-1',
        'description'   => __('Add widgets here.', 'apex'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ));
    
    register_sidebar(array(
        'name'          => __('Footer', 'apex'),
        'id'            => 'footer-1',
        'description'   => __('Footer widget area.', 'apex'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));
}
add_action('widgets_init', 'apex_widgets_init');

/**
 * Customizer additions
 */
function apex_customize_register($wp_customize) {
    // Hero Section
    $wp_customize->add_section('apex_hero', array(
        'title'    => __('Hero Section', 'apex'),
        'priority' => 30,
    ));
    
    $wp_customize->add_setting('hero_title', array(
        'default'           => 'APEX CONSULTING',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('hero_title', array(
        'label'   => __('Hero Title', 'apex'),
        'section' => 'apex_hero',
        'type'    => 'text',
    ));
    
    $wp_customize->add_setting('hero_tagline', array(
        'default'           => 'Transforming Complexity Into Clarity',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('hero_tagline', array(
        'label'   => __('Hero Tagline', 'apex'),
        'section' => 'apex_hero',
        'type'    => 'text',
    ));
    
    // Contact Info
    $wp_customize->add_section('apex_contact', array(
        'title'    => __('Contact Information', 'apex'),
        'priority' => 35,
    ));
    
    $wp_customize->add_setting('contact_email', array(
        'default'           => 'hello@apexconsulting.com',
        'sanitize_callback' => 'sanitize_email',
    ));
    
    $wp_customize->add_control('contact_email', array(
        'label'   => __('Email', 'apex'),
        'section' => 'apex_contact',
        'type'    => 'email',
    ));
    
    $wp_customize->add_setting('contact_phone', array(
        'default'           => '+1 (555) 123-4567',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('contact_phone', array(
        'label'   => __('Phone', 'apex'),
        'section' => 'apex_contact',
        'type'    => 'text',
    ));
    
    $wp_customize->add_setting('contact_locations', array(
        'default'           => 'New York • London • Singapore',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('contact_locations', array(
        'label'   => __('Locations', 'apex'),
        'section' => 'apex_contact',
        'type'    => 'text',
    ));
}
add_action('customize_register', 'apex_customize_register');

/**
 * Custom excerpt length
 */
function apex_excerpt_length($length) {
    return 25;
}
add_filter('excerpt_length', 'apex_excerpt_length');

/**
 * Custom excerpt more
 */
function apex_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'apex_excerpt_more');

/**
 * Add body classes
 */
function apex_body_classes($classes) {
    // Add class if singular
    if (is_singular()) {
        $classes[] = 'singular';
    }
    
    // Add class if has sidebar
    if (is_active_sidebar('sidebar-1')) {
        $classes[] = 'has-sidebar';
    }
    
    return $classes;
}
add_filter('body_class', 'apex_body_classes');

/**
 * Preload fonts for better performance
 */
function apex_resource_hints($urls, $relation_type) {
    if ('preconnect' === $relation_type) {
        $urls[] = array(
            'href' => 'https://fonts.googleapis.com',
        );
        $urls[] = array(
            'href' => 'https://fonts.gstatic.com',
            'crossorigin' => 'anonymous',
        );
    }
    
    return $urls;
}
add_filter('wp_resource_hints', 'apex_resource_hints', 10, 2);

/**
 * Include custom template tags
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Include custom template functions
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Include custom walker for navigation
 */
require get_template_directory() . '/inc/class-walker-nav-menu.php';

/**
 * Include AJAX handlers for contact form
 */
require get_template_directory() . '/inc/ajax-handlers.php';
