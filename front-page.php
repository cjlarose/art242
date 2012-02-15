<?php
/**
 * Template Name: Front Page
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * @package _s
 * @since _s 1.0
 */

get_header(); ?>

		<div id="primary" class="site-content">
			<div id="content" role="main">

				<?php while ( have_posts() ) : the_post(); ?>

					<?php get_template_part( 'content', 'page' ); ?>

				<?php endwhile; // end of the loop. ?>
				<?php $photos = PhotoCollectionCPT::get_all(); var_dump($photos); ?>
				<div id="collections">
				</div>
				<div id="projects">
				</div>
			</div><!-- #content -->
		</div><!-- #primary .site-content -->

<?php get_footer(); ?>
