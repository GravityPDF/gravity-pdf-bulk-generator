#!/usr/bin/env bash

if [ $# -lt 1 ]; then
	echo "usage: $0 <version> [branch]"
	exit 1
fi

VERSION=$1
BRANCH=${2-development}
TMP_DIR="./tmp/package/"
PACKAGE_DIR="${TMP_DIR}${VERSION}"
PACKAGE_NAME="gravity-pdf-bulk-generator"

# Create the working directory
mkdir -p ${PACKAGE_DIR}

# Get an archive of our plugin
git archive ${BRANCH} --output ${PACKAGE_DIR}/package.tar.gz
tar -zxf ${PACKAGE_DIR}/package.tar.gz --directory ${PACKAGE_DIR} && rm ${PACKAGE_DIR}/package.tar.gz

# Run Composer
composer install --quiet --no-dev  --prefer-dist --optimize-autoloader --working-dir ${PACKAGE_DIR}
yarn --cwd ${PACKAGE_DIR} install && yarn --cwd ${PACKAGE_DIR} build

# Cleanup Node JS
rm -R ${PACKAGE_DIR}/node_modules

# Cleanup additional build files
FILES=(
"${PACKAGE_DIR}/composer.json"
"${PACKAGE_DIR}/composer.lock"
"${PACKAGE_DIR}/package.json"
"${PACKAGE_DIR}/phpcs.xml.dist"
"${PACKAGE_DIR}/phpunit.xml.dist"
"${PACKAGE_DIR}/yarn.lock"
"${PACKAGE_DIR}/.babelrc"
"${PACKAGE_DIR}/.eslintrc"
"${PACKAGE_DIR}/webpack.config.js"
"${PACKAGE_DIR}/webpack-configs"
)

for i in "${FILES[@]}"
do
    rm -R ${i}
done

# Generate translation file
cd ${PACKAGE_DIR}
npm install --global wp-pot-cli
wp-pot --domain gravity-pdf-bulk-generator --src **/*.php --package 'Gravity PDF Bulk Generator' --dest-file languages/gravity-pdf-bulk-generator.pot > /dev/null

# Create zip package
cd ../
rm -R -f ${PACKAGE_NAME}
cp -r ${VERSION} ${PACKAGE_NAME}
zip -r -q ${PACKAGE_NAME}-${VERSION}.zip ${PACKAGE_NAME}
