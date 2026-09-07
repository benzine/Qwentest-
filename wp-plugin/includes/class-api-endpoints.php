<?php
/**
 * API Endpoints Class
 * Handles all REST API endpoints for the headless builder
 */

if (!defined('ABSPATH')) {
    exit;
}

class Headless_Builder_API_Endpoints {
    
    /**
     * Check if user has permission to access API
     */
    public static function check_permissions($request) {
        return current_user_can('edit_pages');
    }
    
    /**
     * Check if user has permission to edit
     */
    public static function check_edit_permissions($request) {
        return current_user_can('edit_pages');
    }
    
    /**
     * Check if user has permission to upload images
     */
    public static function check_upload_permissions($request) {
        return current_user_can('upload_files');
    }
    
    /**
     * Get page with layout data
     */
    public static function get_page($request) {
        $post_id = $request->get_param('id');
        $post = get_post($post_id);
        
        if (!$post || $post->post_type !== 'page') {
            return new WP_Error('not_found', __('Page not found', 'headless-builder'), array('status' => 404));
        }
        
        if (!current_user_can('read_post', $post_id)) {
            return new WP_Error('forbidden', __('You do not have permission to view this page', 'headless-builder'), array('status' => 403));
        }
        
        $layout = Headless_Builder_Post_Meta_Storage::get_page_layout($post_id);
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'id' => $post->ID,
                'title' => $post->post_title,
                'slug' => $post->post_name,
                'status' => $post->post_status,
                'layout' => $layout,
            ),
        ));
    }
    
    /**
     * Update page layout
     */
    public static function update_page($request) {
        $post_id = $request->get_param('id');
        $post = get_post($post_id);
        
        if (!$post || $post->post_type !== 'page') {
            return new WP_Error('not_found', __('Page not found', 'headless-builder'), array('status' => 404));
        }
        
        if (!current_user_can('edit_post', $post_id)) {
            return new WP_Error('forbidden', __('You do not have permission to edit this page', 'headless-builder'), array('status' => 403));
        }
        
        // Verify nonce
        $nonce = $request->get_header('X-WP-Nonce');
        if (!wp_verify_nonce($nonce, 'wp_rest')) {
            return new WP_Error('invalid_nonce', __('Invalid nonce', 'headless-builder'), array('status' => 401));
        }
        
        $params = $request->get_json_params();
        
        if (isset($params['layout'])) {
            Headless_Builder_Post_Meta_Storage::save_page_layout($post_id, $params['layout']);
        }
        
        if (isset($params['title'])) {
            wp_update_post(array(
                'ID' => $post_id,
                'post_title' => sanitize_text_field($params['title']),
            ));
        }
        
        if (isset($params['status'])) {
            wp_update_post(array(
                'ID' => $post_id,
                'post_status' => sanitize_text_field($params['status']),
            ));
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'message' => __('Page updated successfully', 'headless-builder'),
            'data' => array(
                'id' => $post_id,
                'layout' => Headless_Builder_Post_Meta_Storage::get_page_layout($post_id),
            ),
        ));
    }
    
    /**
     * Create new section
     */
    public static function create_section($request) {
        $params = $request->get_json_params();
        
        if (!isset($params['pageId']) || !isset($params['section'])) {
            return new WP_Error('missing_params', __('Missing required parameters', 'headless-builder'), array('status' => 400));
        }
        
        $page_id = intval($params['pageId']);
        
        if (!current_user_can('edit_post', $page_id)) {
            return new WP_Error('forbidden', __('You do not have permission to edit this page', 'headless-builder'), array('status' => 403));
        }
        
        $layout = Headless_Builder_Post_Meta_Storage::get_page_layout($page_id);
        
        // Add new section
        $new_section = array_merge(array(
            'id' => uniqid('sec_'),
            'type' => 'blank',
            'adminLabel' => '',
            'isVisible' => true,
            'deviceVisibility' => ['desktop', 'tablet', 'mobile'],
            'layout' => array(),
            'modules' => array(),
        ), $params['section']);
        
        $layout['sections'][] = $new_section;
        
        Headless_Builder_Post_Meta_Storage::save_page_layout($page_id, $layout);
        
        return rest_ensure_response(array(
            'success' => true,
            'message' => __('Section created successfully', 'headless-builder'),
            'data' => array(
                'section' => $new_section,
                'layout' => $layout,
            ),
        ));
    }
    
    /**
     * Update section
     */
    public static function update_section($request) {
        $section_id = $request->get_param('id');
        $params = $request->get_json_params();
        
        if (!isset($params['pageId'])) {
            return new WP_Error('missing_params', __('Missing page ID', 'headless-builder'), array('status' => 400));
        }
        
        $page_id = intval($params['pageId']);
        
        if (!current_user_can('edit_post', $page_id)) {
            return new WP_Error('forbidden', __('You do not have permission to edit this page', 'headless-builder'), array('status' => 403));
        }
        
        $layout = Headless_Builder_Post_Meta_Storage::get_page_layout($page_id);
        
        // Find and update section
        $found = false;
        foreach ($layout['sections'] as &$section) {
            if ($section['id'] === $section_id) {
                $section = array_merge($section, $params['section']);
                $found = true;
                break;
            }
        }
        
        if (!$found) {
            return new WP_Error('not_found', __('Section not found', 'headless-builder'), array('status' => 404));
        }
        
        Headless_Builder_Post_Meta_Storage::save_page_layout($page_id, $layout);
        
        return rest_ensure_response(array(
            'success' => true,
            'message' => __('Section updated successfully', 'headless-builder'),
            'data' => array(
                'section' => $section,
                'layout' => $layout,
            ),
        ));
    }
    
    /**
     * Delete section
     */
    public static function delete_section($request) {
        $section_id = $request->get_param('id');
        $params = $request->get_json_params();
        
        if (!isset($params['pageId'])) {
            return new WP_Error('missing_params', __('Missing page ID', 'headless-builder'), array('status' => 400));
        }
        
        $page_id = intval($params['pageId']);
        
        if (!current_user_can('edit_post', $page_id)) {
            return new WP_Error('forbidden', __('You do not have permission to edit this page', 'headless-builder'), array('status' => 403));
        }
        
        $layout = Headless_Builder_Post_Meta_Storage::get_page_layout($page_id);
        
        // Find and remove section
        $found = false;
        $layout['sections'] = array_values(array_filter($layout['sections'], function($section) use ($section_id, &$found) {
            if ($section['id'] === $section_id) {
                $found = true;
                return false;
            }
            return true;
        }));
        
        if (!$found) {
            return new WP_Error('not_found', __('Section not found', 'headless-builder'), array('status' => 404));
        }
        
        Headless_Builder_Post_Meta_Storage::save_page_layout($page_id, $layout);
        
        return rest_ensure_response(array(
            'success' => true,
            'message' => __('Section deleted successfully', 'headless-builder'),
            'data' => array(
                'layout' => $layout,
            ),
        ));
    }
    
    /**
     * Upload image
     */
    public static function upload_image($request) {
        // Verify nonce
        $nonce = $request->get_header('X-WP-Nonce');
        if (!wp_verify_nonce($nonce, 'wp_rest')) {
            return new WP_Error('invalid_nonce', __('Invalid nonce', 'headless-builder'), array('status' => 401));
        }
        
        $files = $request->get_file_params();
        
        if (!isset($files['image'])) {
            return new WP_Error('missing_file', __('No image file provided', 'headless-builder'), array('status' => 400));
        }
        
        $file = $files['image'];
        
        // Validate file type
        $allowed_types = array('image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml');
        if (!in_array($file['type'], $allowed_types)) {
            return new WP_Error('invalid_type', __('Invalid file type. Allowed: jpg, png, gif, webp, svg', 'headless-builder'), array('status' => 400));
        }
        
        // Validate file size (max 5MB)
        $max_size = 5 * 1024 * 1024;
        if ($file['size'] > $max_size) {
            return new WP_Error('file_too_large', __('File size exceeds maximum allowed (5MB)', 'headless-builder'), array('status' => 400));
        }
        
        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid() . '.' . $extension;
        $filepath = HEADLESS_BUILDER_IMAGES_DIR . $filename;
        
        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            return new WP_Error('upload_failed', __('Failed to upload file', 'headless-builder'), array('status' => 500));
        }
        
        // Set proper permissions
        wp_chmod($filepath, 0644);
        
        // Return relative path only
        $relative_path = 'images/' . $filename;
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'url' => $relative_path,
                'absoluteUrl' => HEADLESS_BUILDER_IMAGES_URL . $filename,
                'filename' => $filename,
                'size' => $file['size'],
                'type' => $file['type'],
            ),
        ));
    }
    
    /**
     * Get global blocks
     */
    public static function get_global_blocks($request) {
        $blocks = get_posts(array(
            'post_type' => 'hb_global_block',
            'posts_per_page' => -1,
            'post_status' => 'publish',
        ));
        
        $result = array();
        foreach ($blocks as $block) {
            $block_data = get_post_meta($block->ID, '_hb_block_data', true);
            $result[] = array(
                'id' => $block->ID,
                'title' => $block->post_title,
                'data' => $block_data ?: array(),
            );
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => $result,
        ));
    }
    
    /**
     * Get section templates
     */
    public static function get_section_templates($request) {
        $templates = get_posts(array(
            'post_type' => 'hb_section_template',
            'posts_per_page' => -1,
            'post_status' => 'publish',
        ));
        
        $result = array();
        foreach ($templates as $template) {
            $template_data = get_post_meta($template->ID, '_hb_template_data', true);
            $thumbnail_id = get_post_thumbnail_id($template->ID);
            $thumbnail_url = $thumbnail_id ? wp_get_attachment_url($thumbnail_id) : '';
            
            $result[] = array(
                'id' => $template->ID,
                'title' => $template->post_title,
                'description' => $template->post_excerpt,
                'data' => $template_data ?: array(),
                'thumbnail' => $thumbnail_url ? str_replace(site_url(), '', $thumbnail_url) : '',
            );
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => $result,
        ));
    }
    
    /**
     * Get translations
     */
    public static function get_translations($request) {
        $lang = $request->get_param('lang') ?: 'en';
        
        $translations = array(
            'en' => array(),
            'fr' => array(),
            'es' => array(),
            'de' => array(),
        );
        
        // In production, these would be loaded from translation files or API
        $common_strings = array(
            'Get Started' => array(
                'en' => 'Get Started',
                'fr' => 'Commencer',
                'es' => 'Comenzar',
                'de' => 'Loslegen',
            ),
            'Contact Us' => array(
                'en' => 'Contact Us',
                'fr' => 'Contactez-nous',
                'es' => 'Contáctenos',
                'de' => 'Kontaktieren Sie uns',
            ),
            'Learn More' => array(
                'en' => 'Learn More',
                'fr' => 'En savoir plus',
                'es' => 'Más información',
                'de' => 'Mehr erfahren',
            ),
        );
        
        $result = array();
        foreach ($common_strings as $key => $translations) {
            $result[$key] = $translations[$lang] ?? $translations['en'];
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'language' => $lang,
                'translations' => $result,
            ),
        ));
    }
}
