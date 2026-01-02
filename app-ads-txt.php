<?php

/*
* Plugin Name: Ads.txt & App-ads.txt Manager
* Description: App-ads.txt & Ads.txt manager allows you to create, manage & publish your app-ads.txt & ads.txt files from your WordPress dashboard.
* Author: Pagup
* Version: 1.1.9
* Author URI: https://pagup.com/
* Text Domain: app-ads-txt
* Domain Path: /languages/
*/
if ( !defined( 'ABSPATH' ) ) {
    exit;
}
if ( function_exists( 'adtm__fs' ) ) {
    adtm__fs()->set_basename( false, __FILE__ );
} else {
    if ( !function_exists( 'adtm__fs' ) ) {
        if ( !defined( 'ADTM_PLUGIN_BASE' ) ) {
            define( 'ADTM_PLUGIN_BASE', plugin_basename( __DIR__ ) );
        }
        if ( !defined( 'ADTM_PLUGIN_URL' ) ) {
            define( 'ADTM_PLUGIN_URL', plugins_url( '', __FILE__ ) );
        }
        // Create a helper function for easy SDK access.
        function adtm__fs() {
            global $adtm__fs;
            if ( !isset( $adtm__fs ) ) {
                // Include Freemius SDK.
                require_once dirname( __FILE__ ) . '/vendor/freemius/start.php';
                $adtm__fs = fs_dynamic_init( array(
                    'id'              => '4445',
                    'slug'            => 'app-ads-txt',
                    'type'            => 'plugin',
                    'public_key'      => 'pk_07707b3aad7d8a6ef5bfb48f29e57',
                    'is_premium'      => false,
                    'premium_suffix'  => 'App-ads & ads.txt Manager PRO',
                    'has_addons'      => false,
                    'has_paid_plans'  => true,
                    'has_affiliation' => 'selected',
                    'trial'           => array(
                        'days'               => 7,
                        'is_require_payment' => true,
                    ),
                    'has_affiliation' => 'all',
                    'menu'            => array(
                        'slug'           => 'adtm',
                        'override_exact' => true,
                        'first-path'     => 'options-general.php?page=adtm',
                        'support'        => false,
                        'parent'         => array(
                            'slug' => 'options-general.php',
                        ),
                    ),
                    'is_live'         => true,
                ) );
            }
            return $adtm__fs;
        }

        // Init Freemius.
        adtm__fs();
        // Signal that SDK was initiated.
        do_action( 'adtm__fs_loaded' );
        function adtm__fs_settings_url() {
            return admin_url( 'options-general.php?page=adtm&tab=adtm-settings' );
        }

        adtm__fs()->add_filter( 'connect_url', 'adtm__fs_settings_url' );
        adtm__fs()->add_filter( 'after_skip_url', 'adtm__fs_settings_url' );
        adtm__fs()->add_filter( 'after_connect_url', 'adtm__fs_settings_url' );
        adtm__fs()->add_filter( 'after_pending_connect_url', 'adtm__fs_settings_url' );
    }
    // freemius opt-in
    function adtm__fs_custom_connect_message(
        $message,
        $user_first_name,
        $product_title,
        $user_login,
        $site_link,
        $freemius_link
    ) {
        $break = "<br><br>";
        $more_plugins = '<p><a target="_blank" href="https://wordpress.org/plugins/meta-tags-for-seo/">Meta Tags for SEO</a>, <a target="_blank" href="https://wordpress.org/plugins/automatic-internal-links-for-seo/">Auto internal links for SEO</a>, <a target="_blank" href="https://wordpress.org/plugins/bulk-image-alt-text-with-yoast/">Bulk auto image Alt Text</a>, <a target="_blank" href="https://wordpress.org/plugins/bulk-image-title-attribute/">Bulk auto image Title Tag</a>, <a target="_blank" href="https://wordpress.org/plugins/mobilook/">Mobile view</a>, <a target="_blank" href="https://wordpress.org/plugins/better-robots-txt/">Wordpress Better-Robots.txt</a>, <a target="_blank" href="https://wordpress.org/plugins/wp-google-street-view/">Wp Google Street View</a>, <a target="_blank" href="https://wordpress.org/plugins/vidseo/">VidSeo</a>, ...</p>';
        return sprintf( esc_html__( 'Hey %1$s, %2$s Click on Allow & Continue to start optimizing your app-ads.txt and ads-txt files. %2$s Never miss an important update -- opt-in to our security and feature updates notifications. %2$s See you on the other side.', 'app-ads-txt' ), $user_first_name, $break ) . $more_plugins;
    }

    adtm__fs()->add_filter(
        'connect_message',
        'adtm__fs_custom_connect_message',
        10,
        6
    );
    class adtm {
        function __construct() {
            // stuff to do on plugin activation/deactivation
            register_activation_hook( __FILE__, array(&$this, 'adtm__activate') );
            register_deactivation_hook( __FILE__, array(&$this, 'adtm__deactivate') );
            //add quick links to plugin settings
            $plugin = plugin_basename( __FILE__ );
            if ( is_admin() ) {
                add_filter( "plugin_action_links_{$plugin}", array(&$this, 'adtm__setting_link') );
            }
        }

        // end function __construct()
        // quick setting link in plugin section
        function adtm__setting_link( $links ) {
            $settings_link = '<a href="options-general.php?page=adtm">Settings</a>';
            array_unshift( $links, $settings_link );
            return $links;
        }

        // end function setting_link()
        // register options
        function adtm__options() {
            $adtm__options = get_option( 'app-ads-txt' );
            return $adtm__options;
        }

        // end function adtm__options()
        // removed settings (if checked) on plugin deactivation
        function adtm__deactivate() {
            $adtm__options = $this->adtm__options();
            if ( $adtm__options['remove_settings'] ) {
                delete_option( 'app-ads-txt' );
            }
        }

        function adtm__activate() {
            flush_rewrite_rules();
        }

    }

    // end class
    $adtm = new adtm();
    add_action( 'init', 'adtm__rewrite' );
    function adtm__rewrite() {
        add_rewrite_rule( 'ads.txt/?', 'index.php?ads=1', 'top' );
        //if ( adtm__fs()->can_use_premium_code__premium_only() ) { // pro only
        add_rewrite_rule( 'app-ads.txt/?', 'index.php?app-ads=1', 'top' );
        //}
    }

    add_filter( 'query_vars', 'adtm__query_vars' );
    function adtm__query_vars(  $query_vars  ) {
        $query_vars[] = 'ads';
        //if ( adtm__fs()->can_use_premium_code__premium_only() ) { // pro only
        $query_vars[] = 'app-ads';
        //}
        return $query_vars;
    }

    //if ( adtm__fs()->can_use_premium_code__premium_only() ) { // pro only
    add_action( 'parse_request', 'adtm__main' );
    function adtm__main(  &$wp  ) {
        if ( array_key_exists( 'app-ads', $wp->query_vars ) ) {
            header( 'Content-Type:text/plain' );
            global $adtm;
            $adtm__options = $adtm->adtm__options();
            $output = "";
            if ( empty( $adtm__options['app-ads'][1]['domain'] ) && empty( $adtm__options['app-ads-custom'] ) ) {
                $output .= "# Records - App-ads.txt";
            }
            if ( isset( $adtm__options['app-ads'] ) && !empty( $adtm__options['app-ads'] ) ) {
                foreach ( $adtm__options['app-ads'] as $key => $value ) {
                    $domain = ( isset( $value['domain'] ) && !empty( $value['domain'] ) ? $value['domain'] : "" );
                    $publisher = ( isset( $value['pub'] ) && !empty( $value['pub'] ) ? ", " . $value['pub'] : "" );
                    $relation = ( isset( $value['relation'] ) && !empty( $value['relation'] ) ? ", " . $value['relation'] : "" );
                    $cert = ( isset( $value['cert'] ) && !empty( $value['cert'] ) ? ", " . $value['cert'] : "" );
                    $output .= $domain . $publisher . $relation . $cert . "\n";
                }
            }
            if ( isset( $adtm__options['app-ads-custom'] ) && !empty( $adtm__options['app-ads-custom'] ) ) {
                $output .= "\n";
                $output .= $adtm__options['app-ads-custom'];
            }
            $output .= "\n";
            $output .= "# This app-ads.txt file was created by App-ads.txt & Ads.txt Manager Plugin. https://www.better-robots.com/";
            echo $output;
            exit;
        }
    }

    //}
    add_action( 'parse_request', 'adtm__ads_main' );
    function adtm__ads_main(  &$wp  ) {
        if ( array_key_exists( 'ads', $wp->query_vars ) ) {
            header( 'Content-Type:text/plain' );
            global $adtm;
            $adtm__options = $adtm->adtm__options();
            $output = "";
            if ( empty( $adtm__options['ads-txt'][1]['domain'] ) && empty( $adtm__options['ads-txt-custom'] ) ) {
                $output .= "# Records - Ads.txt";
            }
            if ( isset( $adtm__options['ads-txt'] ) && !empty( $adtm__options['ads-txt'] ) ) {
                foreach ( $adtm__options['ads-txt'] as $key => $value ) {
                    $domain = ( isset( $value['domain'] ) && !empty( $value['domain'] ) ? $value['domain'] : "" );
                    $publisher = ( isset( $value['pub'] ) && !empty( $value['pub'] ) ? ", " . $value['pub'] : "" );
                    $relation = ( isset( $value['relation'] ) && !empty( $value['relation'] ) ? ", " . $value['relation'] : "" );
                    $cert = ( isset( $value['cert'] ) && !empty( $value['cert'] ) ? ", " . $value['cert'] : "" );
                    $output .= $domain . $publisher . $relation . $cert . "\n";
                }
            }
            if ( isset( $adtm__options['ads-txt-custom'] ) && !empty( $adtm__options['ads-txt-custom'] ) ) {
                $output .= "\n";
                $output .= $adtm__options['ads-txt-custom'];
            }
            $output .= "\n";
            $output .= "# This ads.txt file was created by App-ads.txt & Ads.txt Manager Plugin. https://www.better-robots.com/";
            echo $output;
            exit;
        }
    }

    // admin notifications
    include_once dirname( __FILE__ ) . '/inc/notices.php';
    add_action( 'init', 'adtm__textdomain' );
    function adtm__textdomain() {
        load_plugin_textdomain( 'app-ads-txt', false, basename( dirname( __FILE__ ) ) . '/languages' );
    }

    if ( is_admin() ) {
        include_once dirname( __FILE__ ) . '/app-ads-txt-admin.php';
    }
}