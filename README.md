Gravity PDF Bulk Generator
==========================

![Bulk Generator Icon](https://resources.gravitypdf.com/uploads/2020/04/bulk-generator-cover-artwork.png)

[![Build Status](https://travis-ci.org/GravityPDF/gravity-pdf-bulk-generator.svg?branch=development)](https://travis-ci.org/GravityPDF/gravity-pdf-bulk-generator) [![codecov](https://codecov.io/gh/GravityPDF/gravity-pdf-bulk-generator/branch/development/graph/badge.svg)](https://codecov.io/gh/GravityPDF/gravity-pdf-bulk-generator)

Gravity PDF Bulk Generator is a commercial plugin [available from GravityPDF.com](https://gravitypdf.com/shop/bulk-generator-add-on/). The plugin is hosted here on a public GitHub repository in order to better facilitate community contributions from developers and users. If you have a suggestion, a bug report, or a patch for an issue, feel free to submit it here.

If you are using the plugin on a live site, please purchase a valid license from the website. **We cannot provide support to anyone that does not hold a valid license key**.

# About

This Git repository is for developers who want to contribute to Gravity PDF Bulk Generator. **Don't use it in production**. For production use, [purchase a license and install the packaged version from our online store](https://gravitypdf.com/shop/bulk-generator-add-on/).

The `development` branch is considered our bleeding edge branch, with all new changes pushed to it. The `master` branch is our latest stable version of Gravity PDF Bulk Generator.

# Installation

Before beginning, ensure you have [Git](https://git-scm.com/), [Composer](https://getcomposer.org/) and [Yarn](https://yarnpkg.com/en/docs/install) installed and their commands are globally accessible via the command line.

1. Clone the repository using `git clone https://github.com/GravityPDF/gravity-pdf-bulk-generator/`
1. Open your terminal / command prompt to the Gravity PDF Bulk Generator root directory and run `composer install`. Upon completion, run `yarn install && yarn build`.
1. Copy the plugin to your WordPress plugin directory (if not there already) and active through your WordPress admin area

### Run Unit Tests

#### PHPUnit

We use PHPUnit to test out all the PHP we write. The tests are located in `tests/phpunit/unit-tests/`

To create the testing environment you'll need to use a unix-style CLI, and have the following commands available: unzip, tar, curl/wget, svn, mysqladmin

1. Run `bash ./bin/install-wp-tests.sh gravitypdf_test root root localhost` where `root root` is substituted for your mysql username and password, and `localhost` is your database address.
2. Upon success you can run `vendor/bin/phpunit` to fire off the testing suite
 
### Building JS

We use Webpack to compile our Javascript from ES6 to ES5. If you want to modify the Javascript then take advantage of `yarn run watch` to automatically re-build the JS when changes are made.
