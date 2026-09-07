<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php _e('Settings - Headless Builder', 'headless-builder'); ?></title>
    <?php wp_head(); ?>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        
        .hb-settings-container {
            max-width: 800px;
            margin: 40px auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 30px;
        }
        
        .hb-settings-header {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        
        .hb-settings-header h1 {
            margin: 0 0 10px 0;
            color: #333;
        }
        
        .hb-settings-section {
            margin-bottom: 30px;
        }
        
        .hb-settings-section h2 {
            font-size: 18px;
            margin-bottom: 15px;
            color: #444;
        }
        
        .hb-form-group {
            margin-bottom: 20px;
        }
        
        .hb-form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #555;
        }
        
        .hb-form-group input[type="text"],
        .hb-form-group input[type="email"],
        .hb-form-group input[type="url"],
        .hb-form-group select,
        .hb-form-group textarea {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .hb-form-group textarea {
            min-height: 100px;
            resize: vertical;
        }
        
        .hb-form-group small {
            display: block;
            margin-top: 5px;
            color: #888;
            font-size: 12px;
        }
        
        .hb-btn {
            padding: 12px 24px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .hb-btn:hover {
            background: #5a6fd6;
        }
        
        .hb-btn-secondary {
            background: #6c757d;
        }
        
        .hb-btn-secondary:hover {
            background: #5a6268;
        }
        
        .hb-alert {
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        
        .hb-alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .hb-alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>
<body>
    <div class="wrap">
        <div class="hb-settings-container">
            <div class="hb-settings-header">
                <h1><?php _e('Headless Builder Settings', 'headless-builder'); ?></h1>
                <p><?php _e('Configure your headless builder settings below.', 'headless-builder'); ?></p>
            </div>
            
            <?php if (isset($_GET['settings-updated']) && $_GET['settings-updated'] === 'true'): ?>
                <div class="hb-alert hb-alert-success">
                    <?php _e('Settings saved successfully!', 'headless-builder'); ?>
                </div>
            <?php endif; ?>
            
            <form method="post" action="options.php">
                <?php settings_fields('hb_settings_group'); ?>
                <?php do_settings_sections('hb_settings'); ?>
                
                <div class="hb-settings-section">
                    <h2><?php _e('Translation API', 'headless-builder'); ?></h2>
                    
                    <div class="hb-form-group">
                        <label for="hb_translation_api"><?php _e('Translation Provider', 'headless-builder'); ?></label>
                        <select name="hb_translation_api" id="hb_translation_api">
                            <option value="mymemory" <?php selected(get_option('hb_translation_api'), 'mymemory'); ?>><?php _e('MyMemory (Free, No API Key)', 'headless-builder'); ?></option>
                            <option value="libretranslate" <?php selected(get_option('hb_translation_api'), 'libretranslate'); ?>><?php _e('LibreTranslate', 'headless-builder'); ?></option>
                            <option value="deepl" <?php selected(get_option('hb_translation_api'), 'deepl'); ?>><?php _e('DeepL (Requires API Key)', 'headless-builder'); ?></option>
                        </select>
                        <small><?php _e('Choose your preferred translation provider for multi-language support.', 'headless-builder'); ?></small>
                    </div>
                    
                    <div class="hb-form-group">
                        <label for="hb_translation_api_key"><?php _e('API Key', 'headless-builder'); ?></label>
                        <input type="text" name="hb_translation_api_key" id="hb_translation_api_key" value="<?php echo esc_attr(get_option('hb_translation_api_key')); ?>" placeholder="<?php _e('Required for DeepL', 'headless-builder'); ?>">
                        <small><?php _e('Enter your API key if using DeepL or other paid providers.', 'headless-builder'); ?></small>
                    </div>
                    
                    <div class="hb-form-group">
                        <label for="hb_libretranslate_url"><?php _e('LibreTranslate URL', 'headless-builder'); ?></label>
                        <input type="url" name="hb_libretranslate_url" id="hb_libretranslate_url" value="<?php echo esc_attr(get_option('hb_libretranslate_url', 'https://libretranslate.de/translate')); ?>">
                        <small><?php _e('Custom LibreTranslate server URL (optional).', 'headless-builder'); ?></small>
                    </div>
                </div>
                
                <div class="hb-settings-section">
                    <h2><?php _e('Performance', 'headless-builder'); ?></h2>
                    
                    <div class="hb-form-group">
                        <label for="hb_revision_limit"><?php _e('Revision Limit', 'headless-builder'); ?></label>
                        <input type="number" name="hb_revision_limit" id="hb_revision_limit" value="<?php echo esc_attr(get_option('hb_revision_limit', 10)); ?>" min="1" max="100">
                        <small><?php _e('Maximum number of revisions to keep per page.', 'headless-builder'); ?></small>
                    </div>
                </div>
                
                <div class="hb-settings-section">
                    <h2><?php _e('Image Settings', 'headless-builder'); ?></h2>
                    
                    <div class="hb-form-group">
                        <label for="hb_max_image_size"><?php _e('Max Image Size (MB)', 'headless-builder'); ?></label>
                        <input type="number" name="hb_max_image_size" id="hb_max_image_size" value="<?php echo esc_attr(get_option('hb_max_image_size', 5)); ?>" min="1" max="20">
                        <small><?php _e('Maximum allowed image upload size in megabytes.', 'headless-builder'); ?></small>
                    </div>
                </div>
                
                <?php submit_button(__('Save Settings', 'headless-builder'), 'hb-btn'); ?>
            </form>
        </div>
    </div>
    
    <?php wp_footer(); ?>
</body>
</html>
