<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site">
    <!-- Scroll Progress Bar -->
    <div class="scroll-progress" id="scroll-progress"></div>
    
    <!-- Custom Cursor -->
    <div class="custom-cursor" id="custom-cursor"></div>
    
    <!-- Navigation -->
    <nav class="main-navigation" id="site-navigation">
        <div class="nav-container">
            <div class="site-logo">
                <?php if (has_custom_logo()) : ?>
                    <?php the_custom_logo(); ?>
                <?php else : ?>
                    <a href="<?php echo esc_url(home_url('/')); ?>" rel="home">
                        <?php bloginfo('name'); ?>
                    </a>
                <?php endif; ?>
            </div>
            
            <button class="menu-toggle" id="menu-toggle" aria-controls="primary-menu" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>
            
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'menu_id'        => 'primary-menu',
                'menu_class'     => 'nav-menu',
                'container'      => false,
                'fallback_cb'    => 'apex_fallback_menu',
            ));
            ?>
            
            <a href="#contact" class="cta-button">Get Started</a>
        </div>
    </nav>
    
    <!-- Letterbox Effects (Desktop) -->
    <div class="letterbox-top"></div>
    <div class="letterbox-bottom"></div>
    
    <!-- Film Grain Overlay -->
    <div class="film-grain"></div>
