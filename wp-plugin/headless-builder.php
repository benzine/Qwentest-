<?php
/**
 * Plugin Name: Headless Builder Core
 * Plugin URI: https://example.com/headless-builder
 * Description: A production-grade headless website builder with full WordPress integration. Store structured JSON layouts, manage sections, and enable complete customization without code.
 * Version: 1.0.0
 * Author: Headless Builder Team
 * Author URI: https://example.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: headless-builder
 * Domain Path: /languages
 * Requires at least: 6.4
 * Requires PHP: 8.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('HEADLESS_BUILDER_VERSION', '1.0.0');
define('HEADLESS_BUILDER_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('HEADLESS_BUILDER_PLUGIN_URL', plugin_dir_url(__FILE__));
define('HEADLESS_BUILDER_IMAGES_DIR', HEADLESS_BUILDER_PLUGIN_DIR . 'images/');
define('HEADLESS_BUILDER_IMAGES_URL', HEADLESS_BUILDER_PLUGIN_URL . 'images/');

// Include required files
require_once HEADLESS_BUILDER_PLUGIN_DIR . 'includes/class-post-meta-storage.php';
require_once HEADLESS_BUILDER_PLUGIN_DIR . 'includes/class-api-endpoints.php';
require_once HEADLESS_BUILDER_PLUGIN_DIR . 'includes/class-image-handler.php';
require_once HEADLESS_BUILDER_PLUGIN_DIR . 'includes/class-section-templates.php';
require_once HEADLESS_BUILDER_PLUGIN_DIR . 'includes/class-revisions.php';
require_once HEADLESS_BUILDER_PLUGIN_DIR . 'includes/class-user-permissions.php';
require_once HEADLESS_BUILDER_PLUGIN_DIR . 'includes/class-translations.php';

/**
 * Initialize the Headless Builder
 */
function headless_builder_init() {
    // Load text domain
    load_plugin_textdomain('headless-builder', false, dirname(plugin_basename(__FILE__)) . '/languages');
    
    // Initialize classes
    new Headless_Builder_Post_Meta_Storage();
    new Headless_Builder_API_Endpoints();
    new Headless_Builder_Image_Handler();
    new Headless_Builder_Section_Templates();
    new Headless_Builder_Revisions();
    new Headless_Builder_User_Permissions();
    new Headless_Builder_Translations();
    
    // Register custom post type for pages
    register_headless_builder_post_types();
    
    // Add custom image sizes
    add_headless_builder_image_sizes();
}
add_action('plugins_loaded', 'headless_builder_init');

/**
 * Register custom post types
 */
function register_headless_builder_post_types() {
    // Pages post type (extends default WordPress pages)
    $args = array(
        'public' => true,
        'has_archive' => false,
        'rewrite' => false,
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields', 'revisions'),
        'show_in_rest' => true,
        'rest_base' => 'pages',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
    );
    register_post_type('page', $args);
    
    // Global blocks post type
    register_post_type('hb_global_block', array(
        'labels' => array(
            'name' => __('Global Blocks', 'headless-builder'),
            'singular_name' => __('Global Block', 'headless-builder'),
            'add_new' => __('Add New', 'headless-builder'),
            'add_new_item' => __('Add New Global Block', 'headless-builder'),
            'edit_item' => __('Edit Global Block', 'headless-builder'),
            'new_item' => __('New Global Block', 'headless-builder'),
            'view_item' => __('View Global Block', 'headless-builder'),
            'search_items' => __('Search Global Blocks', 'headless-builder'),
            'not_found' => __('No global blocks found', 'headless-builder'),
            'not_found_in_trash' => __('No global blocks found in trash', 'headless-builder'),
        ),
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_icon' => 'dashicons-block-default',
        'capability_type' => 'post',
        'hierarchical' => false,
        'rewrite' => false,
        'supports' => array('title', 'editor', 'custom-fields', 'revisions'),
        'show_in_rest' => true,
        'rest_base' => 'global-blocks',
    ));
    
    // Section templates post type
    register_post_type('hb_section_template', array(
        'labels' => array(
            'name' => __('Section Templates', 'headless-builder'),
            'singular_name' => __('Section Template', 'headless-builder'),
            'add_new' => __('Add New', 'headless-builder'),
            'add_new_item' => __('Add New Section Template', 'headless-builder'),
            'edit_item' => __('Edit Section Template', 'headless-builder'),
            'new_item' => __('New Section Template', 'headless-builder'),
            'view_item' => __('View Section Template', 'headless-builder'),
            'search_items' => __('Search Section Templates', 'headless-builder'),
            'not_found' => __('No section templates found', 'headless-builder'),
            'not_found_in_trash' => __('No section templates found in trash', 'headless-builder'),
        ),
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_icon' => 'dashicons-layout',
        'capability_type' => 'post',
        'hierarchical' => false,
        'rewrite' => false,
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields', 'revisions'),
        'show_in_rest' => true,
        'rest_base' => 'section-templates',
    ));
}

/**
 * Add custom image sizes
 */
function add_headless_builder_image_sizes() {
    add_image_size('hb-hero', 1920, 1080, true);
    add_image_size('hb-section', 1440, 800, true);
    add_image_size('hb-thumbnail', 400, 300, true);
    add_image_size('hb-avatar', 150, 150, true);
    add_image_size('hb-logo', 200, 100, true);
}

/**
 * Enqueue admin scripts and styles
 */
function headless_builder_admin_enqueue_scripts($hook) {
    // Only load on our builder page
    if ($hook !== 'toplevel_page_headless-builder') {
        return;
    }
    
    wp_enqueue_style(
        'headless-builder-admin',
        HEADLESS_BUILDER_PLUGIN_URL . 'assets/css/admin.css',
        array(),
        HEADLESS_BUILDER_VERSION
    );
    
    wp_enqueue_script(
        'headless-builder-admin',
        HEADLESS_BUILDER_PLUGIN_URL . 'assets/js/admin.js',
        array('jquery', 'jquery-ui-sortable'),
        HEADLESS_BUILDER_VERSION,
        true
    );
    
    // Localize script with data
    wp_localize_script('headless-builder-admin', 'headlessBuilderData', array(
        'apiUrl' => rest_url('headless-builder/v1'),
        'nonce' => wp_create_nonce('wp_rest'),
        'imagesUrl' => HEADLESS_BUILDER_IMAGES_URL,
        'pluginUrl' => HEADLESS_BUILDER_PLUGIN_URL,
        'userId' => get_current_user_id(),
        'userRole' => wp_get_current_user()->roles[0] ?? '',
        'canEdit' => current_user_can('edit_pages'),
        'canPublish' => current_user_can('publish_pages'),
        'canManageOptions' => current_user_can('manage_options'),
    ));
}
add_action('admin_enqueue_scripts', 'headless_builder_admin_enqueue_scripts');

/**
 * Add admin menu
 */
function headless_builder_add_admin_menu() {
    add_menu_page(
        __('Headless Builder', 'headless-builder'),
        __('Headless Builder', 'headless-builder'),
        'edit_pages',
        'headless-builder',
        'headless_builder_render_admin_page',
        'dashicons-admin-site',
        3
    );
    
    add_submenu_page(
        'headless-builder',
        __('All Pages', 'headless-builder'),
        __('All Pages', 'headless-builder'),
        'edit_pages',
        'edit.php?post_type=page'
    );
    
    add_submenu_page(
        'headless-builder',
        __('Global Blocks', 'headless-builder'),
        __('Global Blocks', 'headless-builder'),
        'edit_pages',
        'edit.php?post_type=hb_global_block'
    );
    
    add_submenu_page(
        'headless-builder',
        __('Section Templates', 'headless-builder'),
        __('Section Templates', 'headless-builder'),
        'edit_pages',
        'edit.php?post_type=hb_section_template'
    );
    
    add_submenu_page(
        'headless-builder',
        __('Settings', 'headless-builder'),
        __('Settings', 'headless-builder'),
        'manage_options',
        'headless-builder-settings',
        'headless_builder_render_settings_page'
    );
}
add_action('admin_menu', 'headless_builder_add_admin_menu');

/**
 * Render admin page
 */
function headless_builder_render_admin_page() {
    include HEADLESS_BUILDER_PLUGIN_DIR . 'templates/admin-page.php';
}

/**
 * Render settings page
 */
function headless_builder_render_settings_page() {
    include HEADLESS_BUILDER_PLUGIN_DIR . 'templates/settings-page.php';
}

/**
 * Register REST API routes
 */
function headless_builder_register_rest_routes() {
    register_rest_route('headless-builder/v1', '/pages/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => array('Headless_Builder_API_Endpoints', 'get_page'),
        'permission_callback' => array('Headless_Builder_API_Endpoints', 'check_permissions'),
    ));
    
    register_rest_route('headless-builder/v1', '/pages/(?P<id>\d+)', array(
        'methods' => 'POST',
        'callback' => array('Headless_Builder_API_Endpoints', 'update_page'),
        'permission_callback' => array('Headless_Builder_API_Endpoints', 'check_edit_permissions'),
    ));
    
    register_rest_route('headless-builder/v1', '/sections', array(
        'methods' => 'POST',
        'callback' => array('Headless_Builder_API_Endpoints', 'create_section'),
        'permission_callback' => array('Headless_Builder_API_Endpoints', 'check_edit_permissions'),
    ));
    
    register_rest_route('headless-builder/v1', '/sections/(?P<id>\d+)', array(
        'methods' => 'PUT',
        'callback' => array('Headless_Builder_API_Endpoints', 'update_section'),
        'permission_callback' => array('Headless_Builder_API_Endpoints', 'check_edit_permissions'),
    ));
    
    register_rest_route('headless-builder/v1', '/sections/(?P<id>\d+)', array(
        'methods' => 'DELETE',
        'callback' => array('Headless_Builder_API_Endpoints', 'delete_section'),
        'permission_callback' => array('Headless_Builder_API_Endpoints', 'check_edit_permissions'),
    ));
    
    register_rest_route('headless-builder/v1', '/images/upload', array(
        'methods' => 'POST',
        'callback' => array('Headless_Builder_API_Endpoints', 'upload_image'),
        'permission_callback' => array('Headless_Builder_API_Endpoints', 'check_upload_permissions'),
    ));
    
    register_rest_route('headless-builder/v1', '/global-blocks', array(
        'methods' => 'GET',
        'callback' => array('Headless_Builder_API_Endpoints', 'get_global_blocks'),
        'permission_callback' => '__return_true',
    ));
    
    register_rest_route('headless-builder/v1', '/section-templates', array(
        'methods' => 'GET',
        'callback' => array('Headless_Builder_API_Endpoints', 'get_section_templates'),
        'permission_callback' => '__return_true',
    ));
    
    register_rest_route('headless-builder/v1', '/translations', array(
        'methods' => 'GET',
        'callback' => array('Headless_Builder_API_Endpoints', 'get_translations'),
        'permission_callback' => '__return_true',
    ));
}
add_action('rest_api_init', 'headless_builder_register_rest_routes');

/**
 * Flush rewrite rules on activation
 */
function headless_builder_activate() {
    register_headless_builder_post_types();
    flush_rewrite_rules();
    
    // Create images directory if it doesn't exist
    if (!file_exists(HEADLESS_BUILDER_IMAGES_DIR)) {
        wp_mkdir_p(HEADLESS_BUILDER_IMAGES_DIR);
    }
}
register_activation_hook(__FILE__, 'headless_builder_activate');

/**
 * Flush rewrite rules on deactivation
 */
function headless_builder_deactivate() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'headless_builder_deactivate');
