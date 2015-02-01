#!/bin/bash

# Which matrix settings -- otherwise default
if [[ "$MAINRUN" == "false" ]]
then
  npm install underscore@"$UNDERSCORE" backbone@"$BACKBONE"
fi

if [[ "$LODASH" != "false" && -n $LODASH ]]
then
  npm install lodash@"$LODASH"
  mv node_modules/lodash/index.js node_modules/underscore/underscore.js
fi

