<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php _e('Headless Builder', 'headless-builder'); ?></title>
    <?php wp_head(); ?>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: #f5f5f5;
            overflow: hidden;
        }
        
        #hb-builder-root {
            width: 100vw;
            height: 100vh;
            display: flex;
        }
        
        .hb-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            width: 100vw;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 24px;
        }
        
        .hb-loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 15px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body <?php body_class(); ?>>
    <div id="hb-builder-root">
        <div class="hb-loading">
            <div class="hb-loading-spinner"></div>
            <span><?php _e('Loading Headless Builder...', 'headless-builder'); ?></span>
        </div>
    </div>
    
    <script>
        window.headlessBuilderConfig = {
            apiUrl: '<?php echo esc_url_raw(rest_url('headless-builder/v1')); ?>',
            siteUrl: '<?php echo esc_url(site_url()); ?>',
            imagesUrl: '<?php echo esc_url(HEADLESS_BUILDER_IMAGES_URL); ?>',
            nonce: '<?php echo wp_create_nonce('wp_rest'); ?>',
            userId: <?php echo get_current_user_id(); ?>,
            userRole: '<?php echo esc_js(wp_get_current_user()->roles[0] ?? ''); ?>',
            canEdit: <?php echo current_user_can('edit_pages') ? 'true' : 'false'; ?>,
            canPublish: <?php echo current_user_can('publish_pages') ? 'true' : 'false'; ?>,
            canManageOptions: <?php echo current_user_can('manage_options') ? 'true' : 'false'; ?>,
            postId: <?php echo isset($_GET['post']) ? intval($_GET['post']) : 'null'; ?>,
        };
    </script>
    
    <?php
    // Enqueue the React app build files (will be built from Next.js)
    // In production, these would be the built assets from the Next.js frontend
    wp_enqueue_script(
        'headless-builder-app',
        HEADLESS_BUILDER_PLUGIN_URL . '../nextjs-frontend/build/static/js/main.js',
        array(),
        HEADLESS_BUILDER_VERSION,
        true
    );
    
    wp_enqueue_style(
        'headless-builder-app',
        HEADLESS_BUILDER_PLUGIN_URL . '../nextjs-frontend/build/static/css/main.css',
        array(),
        HEADLESS_BUILDER_VERSION
    );
    ?>
    
    <?php wp_footer(); ?>
</body>
</html>
