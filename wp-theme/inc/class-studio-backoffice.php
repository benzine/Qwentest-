<?php
/**
 * Studio Backoffice - Main Admin Page
 * Provides a centralized hub to manage theme content without using the Customizer.
 */

if (!defined('ABSPATH')) exit;

class Theme_Studio_Backoffice {

    private $option_name = 'theme_studio_settings';

    public function __construct() {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);
        add_action('wp_ajax_studio_save_settings', [$this, 'ajax_save_settings']);
        add_action('wp_ajax_studio_get_settings', [$this, 'ajax_get_settings']);
        
        // Front-end overlay for admins
        add_action('wp_footer', [$this, 'render_frontend_overlay']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_frontend_assets']);
    }

    public function add_admin_menu() {
        add_menu_page(
            __('Studio Backoffice', 'theme-studio'),
            __('Studio', 'theme-studio'),
            'manage_options',
            'theme-studio',
            [$this, 'render_admin_page'],
            'dashicons-art',
            60
        );
    }

    public function register_settings() {
        register_setting('studio_settings_group', $this->option_name);
    }

    public function enqueue_assets($hook) {
        if ($hook !== 'toplevel_page_theme-studio') return;

        wp_enqueue_style('studio-admin-css', get_template_directory_uri() . '/inc/studio/assets/css/admin.css', [], '1.0');
        wp_enqueue_script('studio-admin-js', get_template_directory_uri() . '/inc/studio/assets/js/admin.js', ['jquery'], '1.0', true);
        
        wp_localize_script('studio-admin-js', 'studioConfig', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce'   => wp_create_nonce('studio_nonce'),
            'optionName' => $this->option_name
        ]);
    }

    public function enqueue_frontend_assets() {
        if (!current_user_can('manage_options')) return;

        wp_enqueue_style('studio-front-css', get_template_directory_uri() . '/inc/studio/assets/css/frontend.css', [], '1.0');
        wp_enqueue_script('studio-front-js', get_template_directory_uri() . '/inc/studio/assets/js/frontend.js', ['jquery'], '1.0', true);

        wp_localize_script('studio-front-js', 'studioFrontConfig', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce'   => wp_create_nonce('studio_nonce'),
            'optionName' => $this->option_name,
            'isLoggedIn' => true
        ]);
    }

    public function render_admin_page() {
        $settings = get_option($this->option_name, $this->get_defaults());
        ?>
        <div class="wrap studio-wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            <div class="studio-container">
                <nav class="studio-nav">
                    <button class="nav-tab active" data-tab="general">General</button>
                    <button class="nav-tab" data-tab="hero">Hero Section</button>
                    <button class="nav-tab" data-tab="services">Services</button>
                    <button class="nav-tab" data-tab="team">Team</button>
                    <button class="nav-tab" data-tab="contact">Contact Info</button>
                    <button class="nav-tab" data-tab="styling">Styling</button>
                </nav>

                <form id="studio-form" method="post" action="options.php">
                    <?php settings_fields('studio_settings_group'); ?>
                    
                    <!-- General Tab -->
                    <div class="studio-tab-content active" id="tab-general">
                        <h2>General Settings</h2>
                        <div class="studio-field">
                            <label>Site Tagline</label>
                            <input type="text" name="<?php echo $this->option_name; ?>[site_tagline]" value="<?php echo esc_attr($settings['site_tagline']); ?>" />
                        </div>
                        <div class="studio-field">
                            <label>Copyright Text</label>
                            <input type="text" name="<?php echo $this->option_name; ?>[copyright]" value="<?php echo esc_attr($settings['copyright']); ?>" />
                        </div>
                    </div>

                    <!-- Hero Tab -->
                    <div class="studio-tab-content" id="tab-hero">
                        <h2>Hero Section</h2>
                        <div class="studio-field">
                            <label>Main Headline</label>
                            <input type="text" name="<?php echo $this->option_name; ?>[hero_title]" value="<?php echo esc_attr($settings['hero_title']); ?>" />
                        </div>
                        <div class="studio-field">
                            <label>Sub Headline</label>
                            <textarea name="<?php echo $this->option_name; ?>[hero_subtitle]"><?php echo esc_textarea($settings['hero_subtitle']); ?></textarea>
                        </div>
                        <div class="studio-field">
                            <label>CTA Button Text</label>
                            <input type="text" name="<?php echo $this->option_name; ?>[hero_cta]" value="<?php echo esc_attr($settings['hero_cta']); ?>" />
                        </div>
                        <div class="studio-field">
                            <label>CTA Link</label>
                            <input type="text" name="<?php echo $this->option_name; ?>[hero_link]" value="<?php echo esc_attr($settings['hero_link']); ?>" />
                        </div>
                    </div>

                    <!-- Services Tab (Repeater) -->
                    <div class="studio-tab-content" id="tab-services">
                        <h2>Services</h2>
                        <div id="services-repeater">
                            <?php 
                            if (!empty($settings['services']) && is_array($settings['services'])) :
                                foreach ($settings['services'] as $index => $service) : 
                            ?>
                                <div class="repeater-item">
                                    <span class="remove-item">&times;</span>
                                    <input type="text" name="<?php echo $this->option_name; ?>[services][<?php echo $index; ?>][title]" value="<?php echo esc_attr($service['title']); ?>" placeholder="Service Title" />
                                    <textarea name="<?php echo $this->option_name; ?>[services][<?php echo $index; ?>][description]" placeholder="Description"><?php echo esc_textarea($service['description']); ?></textarea>
                                    <input type="text" name="<?php echo $this->option_name; ?>[services][<?php echo $index; ?>][icon]" value="<?php echo esc_attr($service['icon']); ?>" placeholder="Icon Class (e.g., dashicons-admin-site)" />
                                </div>
                            <?php 
                                endforeach;
                            endif; 
                            ?>
                        </div>
                        <button type="button" class="button add-service">+ Add Service</button>
                    </div>

                    <!-- Team Tab (Repeater) -->
                    <div class="studio-tab-content" id="tab-team">
                        <h2>Team Members</h2>
                        <div id="team-repeater">
                            <?php 
                            if (!empty($settings['team']) && is_array($settings['team'])) :
                                foreach ($settings['team'] as $index => $member) : 
                            ?>
                                <div class="repeater-item">
                                    <span class="remove-item">&times;</span>
                                    <input type="text" name="<?php echo $this->option_name; ?>[team][<?php echo $index; ?>][name]" value="<?php echo esc_attr($member['name']); ?>" placeholder="Name" />
                                    <input type="text" name="<?php echo $this->option_name; ?>[team][<?php echo $index; ?>][role]" value="<?php echo esc_attr($member['role']); ?>" placeholder="Role" />
                                    <input type="text" name="<?php echo $this->option_name; ?>[team][<?php echo $index; ?>][image]" value="<?php echo esc_attr($member['image']); ?>" placeholder="Image URL" />
                                </div>
                            <?php 
                                endforeach;
                            endif; 
                            ?>
                        </div>
                        <button type="button" class="button add-team">+ Add Member</button>
                    </div>

                    <!-- Contact Tab -->
                    <div class="studio-tab-content" id="tab-contact">
                        <h2>Contact Information</h2>
                        <div class="studio-field">
                            <label>Email Address</label>
                            <input type="email" name="<?php echo $this->option_name; ?>[contact_email]" value="<?php echo esc_attr($settings['contact_email']); ?>" />
                        </div>
                        <div class="studio-field">
                            <label>Phone Number</label>
                            <input type="text" name="<?php echo $this->option_name; ?>[contact_phone]" value="<?php echo esc_attr($settings['contact_phone']); ?>" />
                        </div>
                        <div class="studio-field">
                            <label>Physical Address</label>
                            <textarea name="<?php echo $this->option_name; ?>[contact_address]"><?php echo esc_textarea($settings['contact_address']); ?></textarea>
                        </div>
                    </div>

                    <!-- Styling Tab -->
                    <div class="studio-tab-content" id="tab-styling">
                        <h2>Global Styling</h2>
                        <div class="studio-field">
                            <label>Primary Color</label>
                            <input type="color" name="<?php echo $this->option_name; ?>[color_primary]" value="<?php echo esc_attr($settings['color_primary']); ?>" />
                        </div>
                        <div class="studio-field">
                            <label>Accent Color</label>
                            <input type="color" name="<?php echo $this->option_name; ?>[color_accent]" value="<?php echo esc_attr($settings['color_accent']); ?>" />
                        </div>
                    </div>

                    <div class="studio-actions">
                        <button type="button" id="save-studio-settings" class="button button-primary button-large">Save Changes</button>
                        <span class="save-status"></span>
                    </div>
                </form>
            </div>
        </div>
        <?php
    }

    public function ajax_save_settings() {
        check_ajax_referer('studio_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Unauthorized']);
        }

        $settings = isset($_POST['settings']) ? $_POST['settings'] : [];
        
        // Sanitize repeaters
        if (!empty($settings['services'])) {
            $clean_services = [];
            foreach ($settings['services'] as $service) {
                $clean_services[] = [
                    'title' => sanitize_text_field($service['title']),
                    'description' => sanitize_textarea_field($service['description']),
                    'icon' => sanitize_text_field($service['icon'])
                ];
            }
            $settings['services'] = $clean_services;
        }

        if (!empty($settings['team'])) {
            $clean_team = [];
            foreach ($settings['team'] as $member) {
                $clean_team[] = [
                    'name' => sanitize_text_field($member['name']),
                    'role' => sanitize_text_field($member['role']),
                    'image' => esc_url_raw($member['image'])
                ];
            }
            $settings['team'] = $clean_team;
        }

        update_option($this->option_name, $settings);
        wp_send_json_success(['message' => 'Settings saved successfully']);
    }

    public function ajax_get_settings() {
        check_ajax_referer('studio_nonce', 'nonce');
        if (!current_user_can('manage_options')) {
            wp_send_json_error();
        }
        $settings = get_option($this->option_name, $this->get_defaults());
        wp_send_json_success($settings);
    }

    public function render_frontend_overlay() {
        if (!current_user_can('manage_options')) return;
        ?>
        <div id="studio-frontend-toggle">
            <span class="dashicons dashicons-admin-site"></span>
            <span>Edit Mode</span>
        </div>
        
        <div id="studio-frontend-panel" style="display:none;">
            <div class="panel-header">
                <h3>Quick Edit</h3>
                <button id="close-studio-panel">&times;</button>
            </div>
            <div class="panel-content">
                <p>Select an element on the page to edit its content directly.</p>
                <div id="frontend-editor-controls" style="display:none;">
                    <textarea id="frontend-edit-area"></textarea>
                    <button id="save-frontend-edit" class="button button-primary">Update</button>
                </div>
            </div>
        </div>
        <?php
    }

    private function get_defaults() {
        return [
            'site_tagline' => 'Digital Excellence',
            'copyright' => '© ' . date('Y') . ' Brand Name. All rights reserved.',
            'hero_title' => 'We Craft Digital Experiences',
            'hero_subtitle' => 'Transforming ideas into impactful digital solutions.',
            'hero_cta' => 'Start Project',
            'hero_link' => '#contact',
            'contact_email' => 'hello@example.com',
            'contact_phone' => '+1 (555) 123-4567',
            'contact_address' => '123 Innovation Dr, Tech City, TC 90210',
            'color_primary' => '#0f172a',
            'color_accent' => '#d4af37',
            'services' => [
                ['title' => 'Strategy', 'description' => 'Data-driven insights.', 'icon' => 'dashicons-lightbulb'],
                ['title' => 'Design', 'description' => 'Pixel-perfect UI/UX.', 'icon' => 'dashicons-art'],
                ['title' => 'Development', 'description' => 'Robust code.', 'icon' => 'dashicons-code-standards']
            ],
            'team' => []
        ];
    }
}

new Theme_Studio_Backoffice();
