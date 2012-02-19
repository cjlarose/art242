<?php

class Backbone {

	static function init() {
		$model = $_GET['model'];
		call_user_func(array(self, $model));
	}

	static function assignments() {
		$data = AssignmentTax::get_all();
		self::json($data);
	}

	static function photocollections() {
		$data = PhotoCollectionCPT::get_all_by_assignment_id($_GET['assignment_id']);
		self::json($data);
	}

	static function json($data) {
		header('Cache-Control: no-cache, must-revalidate');
		header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
		header('Content-type: application/json');
		echo json_encode($data);
		die();
	}
}
