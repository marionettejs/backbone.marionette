#!/bin/bash

# Which matrix settings -- otherwise default
if [[ "$MAINRUN" -eq "false" ]]
then
  npm install underscore@"$UNDERSCORE" backbone@"$BACKBONE"
fi

if [[ -n $LODASH ]]
then
  npm install lodash@"$LODASH"
  mv node_modules/lodash/index.js node_modules/underscore/underscore.js
fi

