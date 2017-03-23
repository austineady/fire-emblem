
	<?php
		// Set Environment

		if($development) {
			echo '<script src="build/bundle.js"></script>';
		} elseif($production) {
			echo '<script src="build/bundle.js"></script>';
		}
	?>

	</body>
</html>
