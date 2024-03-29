<?php
/**
 * _s functions and definitions
 *
 * @package _s
 * @since _s 1.0
 */

/**
 * Set the content width based on the theme's design and stylesheet.
 *
 * @since _s 1.0
 */
if ( ! isset( $content_width ) )
	$content_width = 640; /* pixels */

if ( ! function_exists( '_s_setup' ) ):
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which runs
 * before the init hook. The init hook is too late for some features, such as indicating
 * support post thumbnails.
 *
 * @since _s 1.0
 */
function _s_setup() {

	/**
	 * Custom template tags for this theme.
	 */
	require( get_template_directory() . '/inc/template-tags.php' );

	/**
	 * Custom functions that act independently of the theme templates
	 */
	//require( get_template_directory() . '/inc/tweaks.php' );

	/**
	 * Custom Theme Options
	 */
	//require( get_template_directory() . '/inc/theme-options/theme-options.php' );

	/**
	 * WordPress.com-specific functions and definitions
	 */
	//require( get_template_directory() . '/inc/wpcom.php' );

	/**
	 * Make theme available for translation
	 * Translations can be filed in the /languages/ directory
	 * If you're building a theme based on _s, use a find and replace
	 * to change '_s' to the name of your theme in all the template files
	 */
	load_theme_textdomain( '_s', get_template_directory() . '/languages' );

	$locale = get_locale();
	$locale_file = get_template_directory() . "/languages/$locale.php";
	if ( is_readable( $locale_file ) )
		require_once( $locale_file );

	/**
	 * Add default posts and comments RSS feed links to head
	 */
	add_theme_support( 'automatic-feed-links' );

	/**
	 * This theme uses wp_nav_menu() in one location.
	 */
	register_nav_menus( array(
		'primary' => __( 'Primary Menu', '_s' ),
	) );

	/**
	 * Add support for the Aside and Gallery Post Formats
	 */
	add_theme_support( 'post-formats', array( 'aside', ) );
}
endif; // _s_setup
add_action( 'after_setup_theme', '_s_setup' );

/**
 * Register widgetized area and update sidebar with default widgets
 *
 * @since _s 1.0
 */
function _s_widgets_init() {
	register_sidebar( array(
		'name' => __( 'Sidebar', '_s' ),
		'id' => 'sidebar-1',
		'before_widget' => '<aside id="%1$s" class="widget %2$s">',
		'after_widget' => "</aside>",
		'before_title' => '<h1 class="widget-title">',
		'after_title' => '</h1>',
	) );
}
add_action( 'init', '_s_widgets_init' );

/**
 * Enqueue scripts
 */
function _s_scripts() {
	wp_enqueue_script( 'jquery' );
	wp_enqueue_script( 'small-menu', get_template_directory_uri() . '/js/small-menu.js', 'jquery', '20120206', true );
	
	wp_register_script('underscore', get_template_directory_uri() . '/js/underscore-min.js');
	wp_register_script('backbone', get_template_directory_uri() . '/js/backbone-min.js', array('underscore', 'jquery'));
	wp_register_script('bootstrap', get_template_directory_uri() . '/bootstrap/js/bootstrap.min.js', array('jquery'));
	wp_register_script('front-page', get_template_directory_uri() . '/js/front-page.js', array('backbone', 'bootstrap'));
	if (is_front_page()) {
		wp_enqueue_script('front-page');
	}
}
function admin_scripts() {
	wp_register_script('admin', get_template_directory_uri() . '/js/admin.js', array('jquery'));
	wp_enqueue_script('admin');
}
add_action( 'wp_enqueue_scripts', '_s_scripts' );
add_action( 'admin_enqueue_scripts', 'admin_scripts');
/**
 * Implement the Custom Header feature
 */
//require( get_template_directory() . '/inc/custom-header.php' );

require( get_template_directory() . '/cpt/PostType.php');
PostType::init();

include 'cpt/Backbone.php';
add_action('wp_ajax_backbone', array('Backbone', 'init'));
add_action('wp_ajax_nopriv_backbone', array('Backbone', 'init'));

if ( function_exists( 'add_image_size' ) ) { 
	add_image_size( 'span3', 260, 180, true); 
}

/* disable admin bar */
add_filter('show_admin_bar', '__return_false');  
