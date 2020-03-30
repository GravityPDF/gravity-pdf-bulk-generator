<?php

namespace GFPDF\Plugins\BulkGenerator;

use League\Flysystem\Adapter\NullAdapter;

class FailedNullAdapter extends NullAdapter {
	public function write( $path, $contents, \League\Flysystem\Config $config ) {
		return false;
	}

	public function createDir( $dirname, \League\Flysystem\Config $config ) {
		return false;
	}
}
