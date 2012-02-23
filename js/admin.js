jQuery(document).ready(function($) {
	$meta = $('#select-assignment-meta');
	$('input', $meta).bind('change', function() {
		$('#select-assignment-meta textarea').html($(this).attr('value'));
	});
});
