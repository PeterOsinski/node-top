#!/bin/bash

#app key
APP_KEY='1c3e8fa';

#host with the collecting server
REQUEST_URL='http://127.0.0.1:4000/endpoint';

#file with necessary functions
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
source "$DIR/parameters.sh";

function SEND_REQUEST {

	STRING='';

	#get the array of parameters and create query string from it
	for i in "$@" ; do
        STRING="$STRING&$i";
    done	

	wget -qO- \
	$REQUEST_URL \
	--post-data="$STRING" \
	&> /dev/null;

}

function GET_TIME {
	echo $(date +%s%N | cut -b1-13);
}

POINTER=0;
while [ true ]; do

	#create the array with paramters
	PARAMS=();

	#execute on every iteration
	if [ $POINTER -ge 0 ]; then
		PARAMS+=("$(P_IFCONFIG)");
	fi

	if [ $(($POINTER % 2)) -eq 0 ]; then
		PARAMS+=("$(P_MEM)" "$(P_LOAD)");
	fi

	#execute on every X iteration
	if [ $(($POINTER % 5)) -eq 0 ]; then
		PARAMS+=("$(P_LOADAVG)" "$(P_CPUTEMP)");
	fi

	#execute on every X iteration
	if [ $(($POINTER % 8)) -eq 0 ]; then
		PARAMS+=("$(P_PS)");

		#the last 'if' should reset the iteration
		POINTER=0;
	fi

	#send http request with payload
	SEND_REQUEST "${PARAMS[@]}";

	#increment the pointer by one
	POINTER="$(($POINTER+1))";

	#wait for one seconds
	sleep 1;

done
