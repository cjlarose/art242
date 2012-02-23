<?php

class AssignmentTax {

	const tax_name = 'art242_assignment';

	public static function init() {
		register_taxonomy('art242_assignment', 'art242photocoll', array(
			'hierarchial' => false,
			'labels' => array(
				'name' => __('Assignments'),
				'singular_name' => __('Assignment')
			),
			'public' => true,
			'show_ui' => false,
			'rewrite' => array('slug' => 'assignment')
		));
	}

	public static function get_all() {
		return get_terms(self::tax_name);
	}
}
