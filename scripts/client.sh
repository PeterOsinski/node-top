#!/bin/bash

APP_ID='1c3e8fa';
REQUEST_URL='http://localhost:4000/endpoint';
source './parameters.sh';

function SEND_REQUEST {

	STRING='';

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

	PARAMS=();

	#execute on every iteration
	if [ $POINTER -ge 0 ] 
	then
		PARAMS+=("$(P_MEM)" "$(P_LOAD)" "$(P_IFCONFIG)");
	fi

	#execute on every X iteration
	if [ $POINTER -ge 5 ] 
	then
		PARAMS+=("$(P_PS)");
		POINTER=0;
	fi

	SEND_REQUEST "${PARAMS[@]}";

	POINTER="$(($POINTER+1))";

	sleep 1;

done
