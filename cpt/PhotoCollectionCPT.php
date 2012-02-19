<?php

class PhotoCollectionCPT extends PostType {

	const post_type = 'art242_photocoll';

	public static function init() {
		$args = array(
			'labels' => array(
				'name' => __( 'Photo Collections' ),
				'singular_name' => __( 'Photo Collection' )
			),
			'public' => true,
			'has_archive' => true,
			'show_ui' => TRUE,
			'rewrite' => array('slug' => 'photo-collection'),
			'supports' => array('title', 'editor', 'author', 'custom-fields'),
			'taxonomies' => array('art242_assignment'),
		);
		register_post_type(self::post_type, $args);
	}
	
	static public function get_all() {
		$args = array(
			'posts_per_page' => -1,
			'post_type' => self::post_type,
			'orderby' => 'ID',
			'order' => 'ASC'
		);
		return new WP_Query($args);
	}

	static public function get_all_objects() {
		$query = $this->get_all();
		$posts = $query->posts;
		$data = array();
		foreach ($posts as $post) {
			$datum = new stdClass();
			$datum->title = $post->post_title;
			$data[] = $datum;
		}	
		return $data;
	}
}
