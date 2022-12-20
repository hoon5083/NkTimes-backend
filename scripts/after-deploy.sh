#!/bin/bash
REPOSITORY=/home/ubuntu/build

cd $REPOSITORY

sudo /usr/bin/npm install

sudo /usr/bin/pm2 start dist