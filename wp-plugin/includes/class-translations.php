<?php
/**
 * Translations Class
 * Handles multi-language support and translation API integration
 */

if (!defined('ABSPATH')) {
    exit;
}

class Headless_Builder_Translations {
    
    /**
     * Supported languages
     */
    private $supported_languages = array(
        'en' => 'English',
        'fr' => 'Français',
        'es' => 'Español',
        'de' => 'Deutsch',
    );
    
    /**
     * Constructor
     */
    public function __construct() {
        add_action('init', array($this, 'load_textdomain'));
        add_action('rest_api_init', array($this, 'register_translation_routes'));
    }
    
    /**
     * Load text domain
     */
    public function load_textdomain() {
        load_plugin_textdomain(
            'headless-builder',
            false,
            dirname(plugin_basename(__FILE__)) . '/../languages'
        );
    }
    
    /**
     * Register translation REST routes
     */
    public function register_translation_routes() {
        register_rest_route('headless-builder/v1', '/translations', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_translations'),
            'permission_callback' => '__return_true',
        ));
        
        register_rest_route('headless-builder/v1', '/translations/translate', array(
            'methods' => 'POST',
            'callback' => array($this, 'translate_text'),
            'permission_callback' => array($this, 'check_translate_permissions'),
        ));
        
        register_rest_route('headless-builder/v1', '/translations/languages', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_supported_languages'),
            'permission_callback' => '__return_true',
        ));
    }
    
    /**
     * Check permissions for translation API
     */
    public function check_translate_permissions() {
        return current_user_can('edit_pages');
    }
    
    /**
     * Get translations for a language
     */
    public function get_translations($request) {
        $lang = $request->get_param('lang') ?: 'en';
        $namespace = $request->get_param('namespace') ?: 'default';
        
        // Load translations from database or external API
        $translations = $this->load_translations($lang, $namespace);
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'language' => $lang,
                'namespace' => $namespace,
                'translations' => $translations,
            ),
        ));
    }
    
    /**
     * Translate text using external API
     */
    public function translate_text($request) {
        $params = $request->get_json_params();
        
        $text = isset($params['text']) ? sanitize_text_field($params['text']) : '';
        $target_lang = isset($params['targetLang']) ? sanitize_text_field($params['targetLang']) : 'en';
        $source_lang = isset($params['sourceLang']) ? sanitize_text_field($params['sourceLang']) : 'auto';
        
        if (empty($text)) {
            return new WP_Error('missing_text', __('No text provided', 'headless-builder'), array('status' => 400));
        }
        
        // Use external translation API
        $translation = $this->call_translation_api($text, $target_lang, $source_lang);
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'original' => $text,
                'translated' => $translation,
                'sourceLang' => $source_lang,
                'targetLang' => $target_lang,
            ),
        ));
    }
    
    /**
     * Get supported languages
     */
    public function get_supported_languages($request) {
        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'languages' => $this->supported_languages,
                'default' => 'en',
            ),
        ));
    }
    
    /**
     * Load translations from database
     */
    private function load_translations($lang, $namespace) {
        if ($lang === 'en') {
            return array();
        }
        
        // Try to load from option
        $option_name = "hb_translations_{$lang}_{$namespace}";
        $translations = get_option($option_name, array());
        
        if (!empty($translations)) {
            return $translations;
        }
        
        // If not found, try to generate from English strings
        return $this->generate_translations($lang, $namespace);
    }
    
    /**
     * Generate translations using external API
     */
    private function generate_translations($lang, $namespace) {
        // Get English source strings
        $source_strings = $this->get_source_strings($namespace);
        
        $translations = array();
        
        foreach ($source_strings as $key => $value) {
            $translated = $this->call_translation_api($value, $lang, 'en');
            $translations[$key] = $translated;
        }
        
        // Cache translations
        $option_name = "hb_translations_{$lang}_{$namespace}";
        update_option($option_name, $translations);
        
        return $translations;
    }
    
    /**
     * Get source strings for a namespace
     */
    private function get_source_strings($namespace) {
        $strings = array(
            'default' => array(
                'Get Started' => 'Get Started',
                'Contact Us' => 'Contact Us',
                'Learn More' => 'Learn More',
                'Build Something Amazing' => 'Build Something Amazing',
                'Create stunning websites with our powerful headless builder.' => 'Create stunning websites with our powerful headless builder.',
                'Why Choose Us' => 'Why Choose Us',
                'Lightning Fast' => 'Lightning Fast',
                'Secure' => 'Secure',
                'Customizable' => 'Customizable',
                'What Our Clients Say' => 'What Our Clients Say',
                'Simple, Transparent Pricing' => 'Simple, Transparent Pricing',
                'Ready to Get Started?' => 'Ready to Get Started?',
                'Send Message' => 'Send Message',
                'Name' => 'Name',
                'Email' => 'Email',
                'Message' => 'Message',
            ),
        );
        
        return $strings[$namespace] ?? $strings['default'];
    }
    
    /**
     * Call external translation API
     * Supports: MyMemory, LibreTranslate, DeepL
     */
    private function call_translation_api($text, $target_lang, $source_lang) {
        // Get API settings from options
        $api_provider = get_option('hb_translation_api', 'mymemory');
        $api_key = get_option('hb_translation_api_key', '');
        
        switch ($api_provider) {
            case 'deepl':
                return $this->translate_with_deepl($text, $target_lang, $api_key);
            
            case 'libretranslate':
                return $this->translate_with_libretranslate($text, $target_lang, $source_lang);
            
            case 'mymemory':
            default:
                return $this->translate_with_mymemory($text, $target_lang, $source_lang);
        }
    }
    
    /**
     * Translate using MyMemory API (free, no key required)
     */
    private function translate_with_mymemory($text, $target_lang, $source_lang) {
        $lang_pair = ($source_lang !== 'auto' ? $source_lang : 'en') . '|' . $target_lang;
        $url = 'https://api.mymemory.translated.net/get?q=' . urlencode($text) . '&langpair=' . $lang_pair;
        
        $response = wp_remote_get($url, array(
            'timeout' => 15,
        ));
        
        if (is_wp_error($response)) {
            return $text; // Return original on error
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if (isset($body['responseData']['translatedText'])) {
            return $body['responseData']['translatedText'];
        }
        
        return $text;
    }
    
    /**
     * Translate using LibreTranslate API
     */
    private function translate_with_libretranslate($text, $target_lang, $source_lang) {
        $api_url = get_option('hb_libretranslate_url', 'https://libretranslate.de/translate');
        
        $response = wp_remote_post($api_url, array(
            'body' => json_encode(array(
                'q' => $text,
                'source' => $source_lang !== 'auto' ? $source_lang : 'auto',
                'target' => $target_lang,
                'format' => 'text',
            )),
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
            'timeout' => 15,
        ));
        
        if (is_wp_error($response)) {
            return $text;
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if (isset($body['translatedText'])) {
            return $body['translatedText'];
        }
        
        return $text;
    }
    
    /**
     * Translate using DeepL API
     */
    private function translate_with_deepl($text, $target_lang, $api_key) {
        if (empty($api_key)) {
            return $text;
        }
        
        $target_lang_upper = strtoupper($target_lang);
        
        $response = wp_remote_post('https://api-free.deepl.com/v2/translate', array(
            'body' => array(
                'text' => $text,
                'target_lang' => $target_lang_upper,
            ),
            'headers' => array(
                'Authorization' => 'DeepL-Auth-Key ' . $api_key,
            ),
            'timeout' => 15,
        ));
        
        if (is_wp_error($response)) {
            return $text;
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if (isset($body['translations'][0]['text'])) {
            return $body['translations'][0]['text'];
        }
        
        return $text;
    }
    
    /**
     * Save custom translation
     */
    public static function save_translation($key, $value, $lang, $namespace = 'default') {
        $option_name = "hb_translations_{$lang}_{$namespace}";
        $translations = get_option($option_name, array());
        $translations[$key] = $value;
        update_option($option_name, $translations);
    }
    
    /**
     * Get translation for a key
     */
    public static function get_translation($key, $lang = null, $namespace = 'default') {
        if ($lang === null) {
            $lang = determine_locale();
        }
        
        if ($lang === 'en_US' || $lang === 'en') {
            return $key;
        }
        
        $lang_short = substr($lang, 0, 2);
        $option_name = "hb_translations_{$lang_short}_{$namespace}";
        $translations = get_option($option_name, array());
        
        return $translations[$key] ?? $key;
    }
}
