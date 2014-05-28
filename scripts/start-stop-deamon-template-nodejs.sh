#!/bin/bash
### BEGIN INIT INFO
# Provides:             nodeproxy
# Required-Start:       $syslog $remote_fs
# Required-Stop:        $syslog $remote_fs
# Should-Start:         $local_fs
# Should-Stop:          $local_fs
# Default-Start:        2 3 4 5
# Default-Stop:         0 1 6
### END INIT INFO
#

NAME="nodeproxy"
NODE_BIN_DIR="/usr/bin"
NODE_PATH="/usr/local/etc/node_proxy/node_modules"
APPLICATION_DIRECTORY="/usr/local/etc/node_proxy"
APPLICATION_START="nodeproxy.js"
LOG="/var/log/nodeproxy.log"
NODE_ENV="production"
PIDFILE="/tmp/nodeproxy.pid"
export HOME="/tmp"
export NODE_PATH=$NODE_PATH

start() {
    PATH=$NODE_BIN_DIR:$PATH
    PATH=$NODE_BIN_DIR:$PATH
    echo "Starting $NAME"
    exec forever --pidFile $PIDFILE --sourceDir $APPLICATION_DIRECTORY -a -l $LOG \
         --minUptime 5000 --spinSleepTime 2000 start $APPLICATION_START &
    RETVAL=$?
}

stop() {
    PATH=$NODE_BIN_DIR:$PATH
 if [ -f $PIDFILE ]; then
    echo "Shutting down $NAME"
    exec forever stop $APPLICATION_START >> $LOG
    rm -f $PIDFILE
    RETVAL=$?
 else
        echo "$NAME is not running."
        RETVAL=0
 fi
}

restart() {
    echo "Restarting $NAME"
    stop
    start
}

status() {
    echo "Status for $NAME:"
    exec forever list
    RETVAL=$?
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    status)
        status
        ;;
    restart)
        restart
        ;;
    *)
        echo "Usage: {start|stop|status|restart}"
        exit 1
        ;;
esac
exit $RETVAL


# usage: /etc/init.d/nodejs_proxy start
# Starting nodejs_proxy
# info:    Forever processing file: nodejs_proxy.js
