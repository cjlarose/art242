<?php

require_once 'parse_blog.php';

$user = $_GET['q'];

$blog_data = parse_blog($user);

define('UPLOAD_DIR', dirname(__FILE__) . '/uploads');

foreach ($blog_data as $i => $post) {	
	$save_dir = UPLOAD_DIR . '/' . $user . '/' . $i;	
	foreach ($post->images as $image_url) {
		$url_parts = parse_url($image_url);
		$save_location = $save_dir . '/' . basename($url_parts['path']);
		save_image($image_url, $save_location);
	}
}


echo "<pre>";
echo json_encode($blog_data);
echo "</pre>";
