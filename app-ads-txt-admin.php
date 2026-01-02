<?php

require __DIR__ . '/vendor/persist-admin-notices-dismissal/persist-admin-notices-dismissal.php';
add_action( 'admin_init', array('PAnD', 'init') );
class adtm__settings {
    function __construct() {
        // stuff to do when the plugin is loaded
        function adtm__styles() {
            wp_register_style(
                'adtm__admin-styles',
                plugin_dir_url( __FILE__ ) . 'assets/adtm-styles-admin.css',
                array(),
                filemtime( plugin_dir_path( __FILE__ ) . 'assets/adtm-styles-admin.css' )
            );
            wp_enqueue_style( 'adtm__admin-styles' );
            wp_register_script(
                'adtm__repeater',
                plugin_dir_url( __FILE__ ) . 'vendor/form-repeater/isia-form-repeater.js',
                array(),
                filemtime( plugin_dir_path( __FILE__ ) . 'vendor/form-repeater/isia-form-repeater.js' )
            );
            wp_register_script(
                'adtm__admin-script',
                plugin_dir_url( __FILE__ ) . 'assets/adtm-script-admin.js',
                array(),
                filemtime( plugin_dir_path( __FILE__ ) . 'assets/adtm-script-admin.js' )
            );
            wp_enqueue_script( 'adtm__repeater' );
            wp_enqueue_script( 'adtm__admin-script' );
        }

        add_action( 'admin_enqueue_scripts', 'adtm__styles' );
        add_action( 'admin_menu', array(&$this, 'adtm__admin_menu') );
    }

    function adtm__admin_menu() {
        add_options_page(
            'Ads.txt & App-Ads.txt Manager Settings',
            'Ads.txt & App-Ads.txt',
            'manage_options',
            'adtm',
            array(&$this, 'adtm__settings_page')
        );
    }

    // Settings function
    function adtm__settings_page() {
        global $adtm;
        $adtm__options = $adtm->adtm__options();
        //var_dump($adtm__options);
        // Safe Values
        $adtm__safe = array(
            "remove_settings",
            "adtm-settings",
            "adtm-faq",
            "adtm-recs"
        );
        //Set active class for navigation tabs
        $active_tab = '';
        if ( isset( $_GET['tab'] ) ) {
            $active_tab = sanitize_key( $_GET['tab'] );
        }
        $active_tab = ( isset( $_GET['tab'] ) && in_array( $active_tab, $adtm__safe ) ? $active_tab : 'adtm-settings' );
        // purchase notification
        $purchase_url = "options-general.php?page=adtm-pricing";
        $get_pro = sprintf( wp_kses( __( '<a href="%s">Get Pro version</a> to enable', 'app-ads-txt' ), array(
            'a' => array(
                'href'   => array(),
                'target' => array(),
            ),
        ) ), esc_url( $purchase_url ) );
        if ( isset( $_POST['update'] ) ) {
            // check if user is authorised
            if ( function_exists( 'current_user_can' ) && !current_user_can( 'manage_options' ) ) {
                die( 'Sorry, not allowed...' );
            }
            check_admin_referer( 'adtm__settings' );
            function sanitize_adtm__array(  $array  ) {
                foreach ( (array) $array as $k => $v ) {
                    if ( is_array( $v ) ) {
                        $array[$k] = sanitize_adtm__array( $v );
                    } else {
                        $array[$k] = sanitize_text_field( $v );
                    }
                }
                return $array;
            }

            $adtm__options['app-ads'] = ( isset( $_POST['ads_field_id'] ) && !empty( $_POST['ads_field_id'] ) ? sanitize_adtm__array( $_POST['ads_field_id'] ) : "" );
            $adtm__options['app-ads-custom'] = ( isset( $_POST['app-ads-custom'] ) && !empty( $_POST['app-ads-custom'] ) ? sanitize_textarea_field( $_POST['app-ads-custom'] ) : "" );
            // remove settings on plugin deactivation
            $adtm__options['remove_settings'] = ( isset( $_POST['remove_settings'] ) && in_array( $_POST['remove_settings'], $adtm__safe ) ? sanitize_text_field( $_POST['remove_settings'] ) : false );
            // Ads.txt Settings
            $adtm__options['ads-txt'] = ( isset( $_POST['ads_txt_field_id'] ) && !empty( $_POST['ads_txt_field_id'] ) ? sanitize_adtm__array( $_POST['ads_txt_field_id'] ) : "" );
            $ads_txt_custom = sanitize_textarea_field( $_POST['ads-txt-custom'] );
            $adtm__options['ads-txt-custom'] = ( isset( $_POST['ads-txt-custom'] ) && !empty( $_POST['ads-txt-custom'] ) ? $ads_txt_custom : "" );
            update_option( 'app-ads-txt', $adtm__options );
            // update options
            echo '<div class="notice notice-success is-dismissible"><p><strong>' . esc_html__( 'Settings saved.', 'app-ads-txt' ) . '</strong></p></div>';
        }
        // get host url for app-ads.txt
        $protocol = ( !empty( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] != 'off' || $_SERVER['SERVER_PORT'] == 443 ? "https://" : "http://" );
        $host = $_SERVER['HTTP_HOST'];
        $host_url = $protocol . $host;
        ?>

    <div class="wrap adtm-containter">

        <h2><span class="dashicons dashicons-media-text" style="margin-top: 6px; font-size: 24px;"></span> Ads.txt & App-Ads.txt Manager <?php 
        echo esc_html__( 'Settings', 'app-ads-txt' );
        ?></h2>

    <h2 class="nav-tab-wrapper">

        <a href="<?php 
        echo esc_url( '?page=adtm&tab=adtm-settings' );
        ?>" 
        class="nav-tab <?php 
        echo ( $active_tab == 'adtm-settings' ? 'nav-tab-active' : '' );
        ?>">Settings</a>
        
        <a href="<?php 
        echo esc_url( '?page=adtm&tab=adtm-faq' );
        ?>" 
        class="nav-tab <?php 
        echo ( $active_tab == 'adtm-faq' ? 'nav-tab-active' : '' );
        ?>">FAQ</a>
        
        <a href="<?php 
        echo esc_url( '?page=adtm&tab=adtm-recs' );
        ?>" 
        class="nav-tab <?php 
        echo ( $active_tab == 'adtm-recs' ? 'nav-tab-active' : '' );
        ?>">Recommendations</a>

    </h2>

    <?php 
        if ( $active_tab == 'adtm-settings' ) {
            ?>

    <!-- Start Settings -->
    <div class="adtm-row">
        
        <!-- Start Main Settings Column -->
        <div class="adtm-column col-9">

            <div class="adtm-main">

                <form method="post">
                    
                    <?php 
            if ( function_exists( 'wp_nonce_field' ) ) {
                wp_nonce_field( 'adtm__settings' );
            }
            ?>

        <div class="adtm-tabs">

            <ul class="tabs">
                <li class="tab-link current" data-tab="tab-1">Ads.txt Settings</li>
                <li class="tab-link" data-tab="tab-2">App-Ads.txt Settings</li>
            </ul>

            <!-- START App-Ads.txt TAB -->
            <div id="tab-1" class="tab-content current">     
                
                <?php 
            include_once dirname( __FILE__ ) . '/admin-ui-inc/ads-txt-inc.php';
            ?>

            </div>
            <!-- END App-Ads.txt Tab -->

            <!-- START Ads.txt TAB -->
            <div id="tab-2" class="tab-content">

                <?php 
            include_once dirname( __FILE__ ) . '/admin-ui-inc/app-ads-txt-inc.php';
            ?>

            </div>
            <!-- END Ads.txt TAB -->

        </div><!-- container --> 
                
        <div class="adtm-alert adtm-warning">
            <span class="closebtn">&times;</span>
            <?php 
            echo __( 'Warning: make sure to clear your cache after saving changes.', 'app-ads-txt' );
            ?>
        </div>

        <hr>

        <div class="adtm-row">

            <div class="adtm-column col-3">
                
                <span class="adtm-label">
                    <?php 
            echo esc_html__( 'Delete Settings', 'app-ads-txt' );
            ?></span>
                </div>

            <div class="adtm-column col-9">
                
                <label class="adtm-switch">

                    <input type="checkbox" id="remove_settings" name="remove_settings" value="remove_settings" <?php 
            if ( isset( $adtm__options['remove_settings'] ) && !empty( $adtm__options['remove_settings'] ) ) {
                echo 'checked="checked"';
            }
            ?> />

                    <span class="adtm-slider adtm-round"></span>

                </label>
                &nbsp;
                <span><?php 
            echo esc_html__( 'Checking this box will remove ALL settings (app-ads.txt & ads.txt) when you deactivate plugin.', 'app-ads-txt' );
            ?></span>
                
            </div>

        </div>
       
        <p class="submit"><input type="submit" name="update" class="button-primary" value="<?php 
            echo esc_html__( 'Save Changes', 'app-ads-txt' );
            ?>" /></p>

        </form>

                                    
        <div class="adtm-note" style="margin-top: 5px;">

            <p><?php 
            echo esc_html__( 'Note: app-ads.txt & ads.txt Manager creates virtual app-ads.txt & ads.txt files. Please make sure that your permalinks are enabled and there is no physical app-ads.txt & ads.txt file on your server. If you\'re using any kind of cache then make sure to clear it after Saving Changes. Please read FAQ for more details.', 'app-ads-txt' );
            ?></p>
            <p><?php 
            echo esc_html__( 'If app-ads.txt is still not working. Please try to save Settings >', 'app-ads-txt' );
            ?> <a href="options-permalink.php"><?php 
            echo __( 'Permalinks', 'app-ads-txt' );
            ?></a>
            &nbsp; <?php 
            echo sprintf( wp_kses( __( '(Check <a href="%s" target="_blank">Screenshot</a>)', 'add-tiktok-advertising-pixel' ), array(
                'a' => array(
                    'href'   => array(),
                    'target' => array(),
                ),
            ) ), esc_url( plugin_dir_url( __FILE__ ) . '/assets/imgs/permalinks.png' ) );
            ?></p>

        </div>

        <div class="adtm-alert adtm-success">
            <span class="closebtn">&times;</span>
            <?php 
            echo __( 'Make sure search engines can crawl your .txt files. Optimize your robots.txt with', 'app-ads-txt' );
            ?> <a href="https://wordpress.org/plugins/better-robots-txt/">Better Robots.txt</a>
        </div>
        
        <br />
        
        <div class="adtm-row">
            <label>Common app-ads.txt snippet:</label>
            <div class="adtm-tooltip">
                <span class="dashicons dashicons-editor-help"></span>
                <span class="adtm-tooltiptext">
                    <?php 
            echo __( 'Just a sample for copy-paste purpose. Make sure to change itaccordingaly inside custom rules box.', 'app-ads-txt' );
            ?>
                </span>
            </div>
            <textarea rows="4" class="adtm-area" id="adtm-snippet" disabled>
#Google Adsense
google.com, pub-PUBID, DIRECT, uFt9u99PqH2rBF7R2vGdjCVdBgu

#Bing Ads
bing.com, pubID, DIRECT, TkP7rKhxx8GRJq3hDkvNWbakuP6

#Outbrain
outbrain.com, pubID, DIRECT
            </textarea>
        </div>
                
        <?php 
            include dirname( __FILE__ ) . '/inc/seo-recommendations.php';
            ?>
    
    </div> <!-- End adtm-main -->
    
</div> <!-- End main settings adtm-column col-8 -->

    <?php 
            // Sidebar
            include dirname( __FILE__ ) . '/inc/sidebar.php';
        }
        if ( $active_tab == 'adtm-ads-txt' ) {
            include dirname( __FILE__ ) . '/ads-txt-admin.php';
        }
        if ( $active_tab == 'adtm-faq' ) {
            include dirname( __FILE__ ) . '/inc/faq.php';
        }
        if ( $active_tab == 'adtm-recs' ) {
            include dirname( __FILE__ ) . '/inc/recommendations.php';
        }
        ?>

</div>

    <?php 
    }

}

// End Settings class
$adtm__settings = new adtm__settings();