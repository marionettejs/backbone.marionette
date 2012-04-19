#!/bin/sh

if [ -a ./src/.DS_Store ] 
  then 
    rm ./src/.DS_Store
fi

anvil -b build.json
