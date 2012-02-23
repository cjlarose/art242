<?php 
$string = "<html><body>";

$string .= (file_get_contents('raw.php'));

$string .= "</body></html>";
                                                                       

$dom = new DOMDocument();

$html = $dom->loadHTML($string);
//$dom->preserveWhiteSpace = false;
$dom->encoding = 'UTF-8';
//echo $dom->saveHTML();
$divs = $dom->getElementsByTagName('div'); 

function get_inner_html( $node ) { 
    $innerHTML= ''; 
    $children = $node->childNodes; 
    foreach ($children as $child) { 
        $innerHTML .= $child->ownerDocument->saveXML( $child ); 
    } 

    return $innerHTML; 
} 


$parent = $divs->item(0);
$children = $parent->childNodes;
$data = array();
foreach ($children as $child) {
	$user = new stdClass();

	//get the user's name from the blog title
	$user->name = trim($child->getElementsByTagName('div')->item(0)->nodeValue);
	$url = $child->getElementsByTagName('a')->item(0)->getAttribute('href');

	// get the blog id (idk why)
	preg_match('/blogID=(\d+)/', $url, $matches);
	$user->blog_id = $matches[1];

	// get the blog address and username (subdomain = new username)
	$html = get_inner_html($child);
	preg_match('/http:\/\/([\w\d]+)\.blogspot\.com/', $html, $matches2);
	$user->blog_address = $matches2[0];
	$user->username = $matches2[1];
	$data[] = $user;
}

echo "<pre>";
echo json_encode($data);
echo "</pre>";
