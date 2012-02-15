<?php

class PostType {

	public static function init() {
		require( get_template_directory() . '/cpt/PhotoCollectionCPT.php');
		PhotoCollectionCPT::init();
	}

	protected function get_posts($args) {
		if (!array_key_exists('post_type', $args))
			$args['post_type'] = $this::post_type;
		$query = new WP_Query($args);
		return $query->posts;
	}

}
