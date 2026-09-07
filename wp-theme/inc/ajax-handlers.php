<?php
/**
 * AJAX Handlers for Contact Form
 *
 * @package Apex_Consulting
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Handle contact form submission via AJAX
 */
function apex_handle_contact_form() {
    // Verify nonce
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'apex-nonce')) {
        wp_send_json_error(array('message' => 'Security check failed'));
    }
    
    // Sanitize and validate input
    $name = isset($_POST['name']) ? sanitize_text_field($_POST['name']) : '';
    $email = isset($_POST['email']) ? sanitize_email($_POST['email']) : '';
    $company = isset($_POST['company']) ? sanitize_text_field($_POST['company']) : '';
    $message = isset($_POST['message']) ? sanitize_textarea_field($_POST['message']) : '';
    
    // Validate required fields
    if (empty($name) || empty($email) || empty($message)) {
        wp_send_json_error(array('message' => 'Please fill in all required fields'));
    }
    
    // Validate email
    if (!is_email($email)) {
        wp_send_json_error(array('message' => 'Please enter a valid email address'));
    }
    
    // Prepare email
    $to = get_theme_mod('contact_email', 'hello@apexconsulting.com');
    $subject = sprintf('New Contact Form Submission from %s', $name);
    
    $body = "Name: {$name}\n";
    $body .= "Email: {$email}\n";
    $body .= "Company: {$company}\n\n";
    $body .= "Message:\n{$message}";
    
    $headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        'Reply-To: ' . $email,
    );
    
    // Send email
    $sent = wp_mail($to, $subject, $body, $headers);
    
    if ($sent) {
        wp_send_json_success(array('message' => 'Thank you for your message! We will get back to you soon.'));
    } else {
        wp_send_json_error(array('message' => 'Failed to send message. Please try again later.'));
    }
}
add_action('wp_ajax_apex_contact_form', 'apex_handle_contact_form');
add_action('wp_ajax_nopriv_apex_contact_form', 'apex_handle_contact_form');
