#!/bin/bash

cp -p node_modules/material-ui/styles/baseThemes/lightBaseTheme.js node_modules/material-ui/styles/baseThemes/lightBaseTheme.js.org
cat node_modules/material-ui/styles/baseThemes/lightBaseTheme.js | sed 's/cyan/indigo/g' > lightBaseTheme.js
mv -f lightBaseTheme.js node_modules/material-ui/styles/baseThemes/lightBaseTheme.js
