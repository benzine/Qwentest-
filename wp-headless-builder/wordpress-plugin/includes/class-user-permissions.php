<?php
/**
 * User Permissions Class
 * Manages granular user roles and permissions
 */

if (!defined('ABSPATH')) {
    exit;
}

class Headless_Builder_User_Permissions {
    
    /**
     * Constructor
     */
    public function __construct() {
        add_action('init', array($this, 'add_custom_roles'));
        add_filter('map_meta_cap', array($this, 'filter_capabilities'), 10, 4);
    }
    
    /**
     * Add custom roles for the builder
     */
    public function add_custom_roles() {
        // Designer role - can edit design but not publish
        add_role(
            'hb_designer',
            __('Designer', 'headless-builder'),
            array(
                'read' => true,
                'edit_pages' => true,
                'edit_posts' => true,
                'upload_files' => true,
                'publish_pages' => false,
                'publish_posts' => false,
                'delete_pages' => false,
                'delete_posts' => false,
            )
        );
        
        // Editor role - can edit content only
        add_role(
            'hb_content_editor',
            __('Content Editor', 'headless-builder'),
            array(
                'read' => true,
                'edit_pages' => true,
                'edit_posts' => true,
                'upload_files' => true,
                'publish_pages' => false,
                'publish_posts' => false,
                'delete_pages' => false,
                'delete_posts' => false,
            )
        );
        
        // Reviewer role - can view but not edit
        add_role(
            'hb_reviewer',
            __('Reviewer', 'headless-builder'),
            array(
                'read' => true,
                'edit_pages' => false,
                'edit_posts' => false,
                'upload_files' => false,
                'publish_pages' => false,
                'publish_posts' => false,
            )
        );
    }
    
    /**
     * Filter capabilities for fine-grained control
     */
    public function filter_capabilities($caps, $cap, $user_id, $args) {
        // Custom capability checks for builder-specific actions
        if ($cap === 'hb_edit_design') {
            if (user_can($user_id, 'manage_options') || user_can($user_id, 'hb_designer')) {
                return array('exist');
            }
            return array('do_not_allow');
        }
        
        if ($cap === 'hb_edit_content') {
            if (user_can($user_id, 'edit_pages') || user_can($user_id, 'hb_content_editor')) {
                return array('exist');
            }
            return array('do_not_allow');
        }
        
        if ($cap === 'hb_view_only') {
            if (user_can($user_id, 'read') || user_can($user_id, 'hb_reviewer')) {
                return array('exist');
            }
            return array('do_not_allow');
        }
        
        if ($cap === 'hb_publish_changes') {
            if (user_can($user_id, 'publish_pages') || user_can($user_id, 'manage_options')) {
                return array('exist');
            }
            return array('do_not_allow');
        }
        
        return $caps;
    }
    
    /**
     * Check if user can edit design
     */
    public static function can_edit_design() {
        return current_user_can('manage_options') || 
               current_user_can('hb_designer') || 
               current_user_can('edit_pages');
    }
    
    /**
     * Check if user can edit content
     */
    public static function can_edit_content() {
        return current_user_can('edit_pages') || 
               current_user_can('hb_content_editor');
    }
    
    /**
     * Check if user can publish changes
     */
    public static function can_publish() {
        return current_user_can('publish_pages') || 
               current_user_can('manage_options');
    }
    
    /**
     * Check if user is admin
     */
    public static function is_admin() {
        return current_user_can('manage_options');
    }
    
    /**
     * Get current user role info
     */
    public static function get_user_role_info() {
        $user = wp_get_current_user();
        
        $role = 'viewer';
        $permissions = array(
            'canEditDesign' => false,
            'canEditContent' => false,
            'canPublish' => false,
            'isAdmin' => false,
            'canUploadFiles' => false,
        );
        
        if (in_array('administrator', $user->roles)) {
            $role = 'admin';
            $permissions = array(
                'canEditDesign' => true,
                'canEditContent' => true,
                'canPublish' => true,
                'isAdmin' => true,
                'canUploadFiles' => true,
            );
        } elseif (in_array('hb_designer', $user->roles)) {
            $role = 'designer';
            $permissions = array(
                'canEditDesign' => true,
                'canEditContent' => true,
                'canPublish' => false,
                'isAdmin' => false,
                'canUploadFiles' => true,
            );
        } elseif (in_array('hb_content_editor', $user->roles)) {
            $role = 'editor';
            $permissions = array(
                'canEditDesign' => false,
                'canEditContent' => true,
                'canPublish' => false,
                'isAdmin' => false,
                'canUploadFiles' => true,
            );
        } elseif (in_array('hb_reviewer', $user->roles)) {
            $role = 'reviewer';
            $permissions = array(
                'canEditDesign' => false,
                'canEditContent' => false,
                'canPublish' => false,
                'isAdmin' => false,
                'canUploadFiles' => false,
            );
        } elseif (in_array('editor', $user->roles)) {
            $role = 'editor';
            $permissions = array(
                'canEditDesign' => true,
                'canEditContent' => true,
                'canPublish' => true,
                'isAdmin' => false,
                'canUploadFiles' => true,
            );
        }
        
        return array(
            'userId' => $user->ID,
            'username' => $user->user_login,
            'displayName' => $user->display_name,
            'email' => $user->user_email,
            'role' => $role,
            'roles' => $user->roles,
            'permissions' => $permissions,
        );
    }
}
