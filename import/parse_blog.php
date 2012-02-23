<?php


function get_data($url)
{
  $ch = curl_init();
  $timeout = 5;
  curl_setopt($ch,CURLOPT_URL,$url);
  curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
  curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,$timeout);
  $data = curl_exec($ch);
  curl_close($ch);
  return $data;
}


function get_inner_html( $node ) { 
    $innerHTML= ''; 
    $children = $node->childNodes; 
    foreach ($children as $child) { 
        $innerHTML .= $child->ownerDocument->saveXML( $child ); 
    } 

    return $innerHTML; 
} 

function save_image($img,$fullpath){
    $ch = curl_init ($img);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_BINARYTRANSFER,1);
    $rawdata=curl_exec($ch);
    curl_close ($ch);
    if(file_exists($fullpath)){
        unlink($fullpath);
    }
    $fp = fopen($fullpath,'x');
    fwrite($fp, $rawdata);
    fclose($fp);
}

function parse_blog($user) {
	$url = "http://{$user}.blogspot.com?v=0";
	$data = get_data($url);
	$dom = new DOMDocument();
	$dom->preserveWhiteSpace = false; 
	@$dom->loadHtml($data);
	$xpath = new DOMXPath($dom);
	$posts = $xpath->query("//div[contains(@class,'hentry')]");

	$data = array();
	foreach ( $posts as $post )
	{
		$post_object = new stdClass();
		$html = get_inner_html($post);
		$html = str_replace("\n", "", $html);
		$html = str_replace("\r", "", $html);
		preg_match('/<h3.*?><a.*?>(.*)<\/a><\/h3>/', $html, $matches);
		$post_object->header = $matches[1];

		//$post_object->html = $html;
		preg_match_all('/href="([^"]*?\.(jpg|JPG|png))"/', $html, $matches2);
		$post_object->images = $matches2[1];

	/*	$ps = $xpath->query("div[contains(@class,'entry-content')]", $post);
		foreach ($ps  as $p) {
			$post_object->ps[] = $p->textContent;
		}*/

		$data[] = $post_object; 
	}
	return $data;
}

if (array_key_exists('user', $_GET)) {
	echo "<pre>";
	echo json_encode(parse_blog($_GET['user']));
	echo "</pre>";
}
