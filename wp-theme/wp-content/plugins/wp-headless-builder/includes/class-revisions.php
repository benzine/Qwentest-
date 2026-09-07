<?php
/**
 * Revisions Class
 * Handles layout revision history
 */

if (!defined('ABSPATH')) {
    exit;
}

class Headless_Builder_Revisions {
    
    /**
     * Constructor
     */
    public function __construct() {
        add_action('hb_before_save_layout', array($this, 'save_revision'), 10, 2);
        add_action('init', array($this, 'register_revision_post_type'));
    }
    
    /**
     * Register revision post type
     */
    public function register_revision_post_type() {
        register_post_type('hb_revision', array(
            'labels' => array(
                'name' => __('Layout Revisions', 'headless-builder'),
                'singular_name' => __('Layout Revision', 'headless-builder'),
            ),
            'public' => false,
            'show_ui' => false,
            'show_in_rest' => true,
            'supports' => array('title', 'custom-fields'),
        ));
    }
    
    /**
     * Save revision before layout update
     */
    public function save_revision($post_id, $layout) {
        $revision_limit = apply_filters('hb_revision_limit', 10);
        
        // Create revision post
        $revision_id = wp_insert_post(array(
            'post_type' => 'hb_revision',
            'post_parent' => $post_id,
            'post_title' => sprintf(__('Revision %s', 'headless-builder'), current_time('mysql')),
            'post_status' => 'inherit',
        ));
        
        if ($revision_id && !is_wp_error($revision_id)) {
            update_post_meta($revision_id, '_hb_revision_layout', $layout);
            update_post_meta($revision_id, '_hb_revision_timestamp', time());
            update_post_meta($revision_id, '_hb_revision_user', get_current_user_id());
            
            // Clean old revisions
            $this->cleanup_old_revisions($post_id, $revision_limit);
        }
    }
    
    /**
     * Clean up old revisions beyond limit
     */
    private function cleanup_old_revisions($post_id, $limit) {
        $revisions = get_posts(array(
            'post_type' => 'hb_revision',
            'post_parent' => $post_id,
            'posts_per_page' => -1,
            'orderby' => 'date',
            'order' => 'DESC',
        ));
        
        if (count($revisions) > $limit) {
            $to_delete = array_slice($revisions, $limit);
            foreach ($to_delete as $revision) {
                wp_delete_post($revision->ID, true);
            }
        }
    }
    
    /**
     * Get all revisions for a page
     */
    public static function get_revisions($post_id) {
        $revisions = get_posts(array(
            'post_type' => 'hb_revision',
            'post_parent' => $post_id,
            'posts_per_page' => -1,
            'orderby' => 'date',
            'order' => 'DESC',
        ));
        
        $result = array();
        foreach ($revisions as $revision) {
            $result[] = array(
                'id' => $revision->ID,
                'timestamp' => get_post_meta($revision->ID, '_hb_revision_timestamp', true),
                'user' => get_post_meta($revision->ID, '_hb_revision_user', true),
                'userName' => get_userdata(get_post_meta($revision->ID, '_hb_revision_user', true))->display_name ?? '',
            );
        }
        
        return $result;
    }
    
    /**
     * Get specific revision layout
     */
    public static function get_revision_layout($revision_id) {
        return get_post_meta($revision_id, '_hb_revision_layout', true);
    }
    
    /**
     * Restore revision
     */
    public static function restore_revision($revision_id, $post_id) {
        $layout = self::get_revision_layout($revision_id);
        
        if ($layout) {
            return Headless_Builder_Post_Meta_Storage::save_page_layout($post_id, $layout);
        }
        
        return false;
    }
}
