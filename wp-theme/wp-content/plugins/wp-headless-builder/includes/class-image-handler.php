<?php
/**
 * Image Handler Class
 * Manages image uploads, optimization, and relative path storage
 */

if (!defined('ABSPATH')) {
    exit;
}

class Headless_Builder_Image_Handler {
    
    /**
     * Constructor
     */
    public function __construct() {
        add_filter('wp_handle_upload_prefilter', array($this, 'validate_image_upload'));
        add_action('after_setup_theme', array($this, 'ensure_images_directory'));
    }
    
    /**
     * Ensure images directory exists
     */
    public function ensure_images_directory() {
        if (!file_exists(HEADLESS_BUILDER_IMAGES_DIR)) {
            wp_mkdir_p(HEADLESS_BUILDER_IMAGES_DIR);
            
            // Create .htaccess to prevent PHP execution
            $htaccess_content = "# Prevent PHP execution in images directory\n";
            $htaccess_content .= "<FilesMatch \"\\.php$\">\n";
            $htaccess_content .= "Order Deny,Allow\n";
            $htaccess_content .= "Deny from all\n";
            $htaccess_content .= "</FilesMatch>\n";
            
            file_put_contents(HEADLESS_BUILDER_IMAGES_DIR . '.htaccess', $htaccess_content);
            
            // Create index.php to prevent directory listing
            file_put_contents(HEADLESS_BUILDER_IMAGES_DIR . 'index.php', '<?php // Silence is golden');
        }
    }
    
    /**
     * Validate image upload
     */
    public function validate_image_upload($file) {
        $allowed_types = array(
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
        );
        
        if (!in_array($file['type'], $allowed_types)) {
            $file['error'] = __('Invalid file type. Only images are allowed.', 'headless-builder');
        }
        
        // Check file size (max 5MB)
        $max_size = 5 * 1024 * 1024;
        if ($file['size'] > $max_size) {
            $file['error'] = __('File size exceeds maximum allowed (5MB).', 'headless-builder');
        }
        
        return $file;
    }
    
    /**
     * Convert absolute URL to relative path
     */
    public static function url_to_relative($url) {
        $site_url = site_url();
        
        if (strpos($url, $site_url) === 0) {
            return str_replace($site_url . '/', '', $url);
        }
        
        // Handle www vs non-www
        $site_url_no_www = str_replace('www.', '', $site_url);
        if (strpos($url, $site_url_no_www) === 0) {
            return str_replace($site_url_no_www . '/', '', $url);
        }
        
        return $url;
    }
    
    /**
     * Convert relative path to absolute URL
     */
    public static function relative_to_url($relative_path) {
        if (strpos($relative_path, 'http') === 0 || strpos($relative_path, '//') === 0) {
            return $relative_path;
        }
        
        return HEADLESS_BUILDER_IMAGES_URL . ltrim($relative_path, '/');
    }
    
    /**
     * Get image by relative path
     */
    public static function get_image($relative_path) {
        $filepath = HEADLESS_BUILDER_IMAGES_DIR . ltrim($relative_path, '/');
        
        if (file_exists($filepath)) {
            return array(
                'path' => $filepath,
                'url' => self::relative_to_url($relative_path),
                'relativeUrl' => $relative_path,
                'exists' => true,
            );
        }
        
        return array(
            'path' => '',
            'url' => '',
            'relativeUrl' => $relative_path,
            'exists' => false,
        );
    }
    
    /**
     * Delete image
     */
    public static function delete_image($relative_path) {
        $filepath = HEADLESS_BUILDER_IMAGES_DIR . ltrim($relative_path, '/');
        
        if (file_exists($filepath)) {
            return unlink($filepath);
        }
        
        return false;
    }
    
    /**
     * Optimize image (placeholder for future integration)
     */
    public static function optimize_image($filepath) {
        // Future: Integrate with image optimization services
        // For now, just return the filepath
        return $filepath;
    }
    
    /**
     * Generate image variants (thumbnail, medium, large)
     */
    public static function generate_variants($filepath) {
        $info = pathinfo($filepath);
        $dirname = $info['dirname'];
        $filename = $info['filename'];
        $extension = $info['extension'];
        
        $variants = array();
        
        // Thumbnail
        $thumb_path = $dirname . '/' . $filename . '-150x150.' . $extension;
        if (file_exists($thumb_path)) {
            $variants['thumbnail'] = $thumb_path;
        }
        
        // Medium
        $medium_path = $dirname . '/' . $filename . '-300x300.' . $extension;
        if (file_exists($medium_path)) {
            $variants['medium'] = $medium_path;
        }
        
        // Large
        $large_path = $dirname . '/' . $filename . '-1024x1024.' . $extension;
        if (file_exists($large_path)) {
            $variants['large'] = $large_path;
        }
        
        return $variants;
    }
}
