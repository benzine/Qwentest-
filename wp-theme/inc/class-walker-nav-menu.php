<?php
/**
 * Custom Walker for Navigation Menu
 *
 * @package Apex_Consulting
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class Apex_Walker_Nav_Menu
 *
 * Custom walker to add smooth scroll and active state classes
 */
class Apex_Walker_Nav_Menu extends Walker_Nav_Menu {
    
    /**
     * Starts the element output.
     */
    public function start_el(&$output, $item, $depth = 0, $args = null, $id = 0) {
        if (isset($args->walker) && is_object($args->walker)) {
            $class_names = $value = '';
            $classes = empty($item->classes) ? array() : (array) $item->classes;
            $classes[] = 'menu-item-' . $item->ID;
            
            // Add smooth scroll class for anchor links
            if (strpos($item->url, '#') === 0 || strpos($item->url, home_url()) !== false) {
                $classes[] = 'smooth-scroll';
            }
            
            /**
             * Filters the arguments for a single nav menu item.
             */
            $args = apply_filters('nav_menu_item_args', $args, $item, $depth);
            
            /**
             * Filters the CSS classes applied to a menu item's list item element.
             */
            $class_names = implode(' ', apply_filters('nav_menu_css_class', array_filter($classes), $item, $args, $depth));
            $class_names = $class_names ? ' class="' . esc_attr($class_names) . '"' : '';
            
            /**
             * Filters the ID applied to a menu item's list item element.
             */
            $id = apply_filters('nav_menu_item_id', 'menu-item-' . $item->ID, $item, $args, $depth);
            $id = $id ? ' id="' . esc_attr($id) . '"' : '';
            
            $output .= '<li' . $id . $class_names . '>';
            
            $atts = array();
            $atts['title']  = !empty($item->attr_title) ? $item->attr_title : '';
            $atts['target'] = !empty($item->target) ? $item->target : '';
            
            if ('_blank' === $item->target && empty($item->xfn)) {
                $atts['rel'] = 'noopener';
            } else {
                $atts['rel'] = $item->xfn;
            }
            
            if (!empty($item->url)) {
                if ('#' === $item->url || '' === $item->url) {
                    $atts['href'] = '#';
                } else {
                    $atts['href'] = $item->url;
                }
                
                /**
                 * Filters the HTML attributes applied to a menu item's anchor element.
                 */
                $atts = apply_filters('nav_menu_link_attributes', $atts, $item, $args, $depth);
            }
            
            $attributes = '';
            foreach ($atts as $attr => $value) {
                if (is_scalar($value) && '' !== $value && false !== $value) {
                    $value = ('href' === $attr) ? esc_url($value) : esc_attr($value);
                    $attributes .= ' ' . $attr . '="' . $value . '"';
                }
            }
            
            /** This filter is documented in wp-includes/post-template.php */
            $title = apply_filters('the_title', $item->title, $item->ID);
            
            /**
             * Filters a menu item's title.
             */
            $title = apply_filters('nav_menu_item_title', $title, $item, $args, $depth);
            
            $item_output = isset($args->before) ? $args->before : '';
            $item_output .= '<a' . $attributes . '>';
            $item_output .= isset($args->link_before) ? $args->link_before : '';
            $item_output .= $title;
            $item_output .= isset($args->link_after) ? $args->link_after : '';
            $item_output .= '</a>';
            $item_output .= isset($args->after) ? $args->after : '';
            
            /**
             * Filters a menu item's starting output.
             */
            $output .= apply_filters('walker_nav_menu_start_el', $item_output, $item, $depth, $args);
        }
    }
}
