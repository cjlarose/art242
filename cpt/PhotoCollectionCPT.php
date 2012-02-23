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

	static public function get_all_by_assignment_id($id) {
		$query = new WP_Query(array(
			'posts_per_page' => -1,
			'post_type' => self::post_type,
			'tax_query' => array(array(
				'taxonomy' => 'art242_assignment',
				'field' => 'term_id',
				'terms' => "$id"
			))
		));
		$posts = $query->posts;
		$data = array();
		foreach ($posts as $post) {
			$datum = new stdClass();
			$datum->title = $post->post_title;
			$datum->attachments = array();
			$user_data = get_userdata($post->post_author);
			$datum->author = (!empty($user_data->first_name)) ? $user_data->first_name . " " . $user_data->last_name : $user_data->user_login;
			$attachments = attachments_get_attachments($post->ID);
			foreach ($attachments as $attachment) {
				$post_attachment = new stdClass();
				foreach ($attachment as $key => $value) {
					if ($key == 'id')
						$key = 'ID';
					if ($key == 'caption')
						$value = empty($value) ? NULL : $value;
					if (in_array($key, array('ID', 'order')))
						$value = $value * 1;
					$post_attachment->$key = $value;
				}
				foreach (array('span3', 'full') as $size) {
					$attributes = wp_get_attachment_image_src($attachment['id'], $size);
					$post_attachment->$size = "<img src=\"" . $attributes[0] . "\" width=\"{$attributes[1]}\" height=\"{$attributes[2]}\"/>";
					$attribute = $size . "_src";
					$post_attachment->$attribute = $attributes[0];
				}
				$metadata = wp_get_attachment_metadata($attachment['id']);
				$post_attachment->metadata = $metadata;
				$datum->attachments[] = $post_attachment;
			}
			$data[] = $datum;
		}	
		return $data;
	}
}
