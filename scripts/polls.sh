
#average load
function P_LOADAVG {
	echo "loadavg=$(cat /proc/loadavg)";
}

#load for each core
function P_LOAD {
	echo "load=$(cat /proc/stat | tail -n +2 | head -n $(nproc))";
}

#ram/cache/swap info
function P_MEM {
	echo "mem=$(free -m | tail -n 3)";
}

function P_MEM2 {
	echo "mem2=$(cat /proc/meminfo | grep 'MemTotal\|MemFree\|Buffers\|Cached\|SwapTotal\|SwapFree')";
}

function P_CORES {
	echo "cores=$(cat /proc/cpuinfo | grep 'model name\|cpu MHz')";
}

function P_DISK {
	echo "diskstat=$(cat /proc/diskstats | grep sd)"
}

#processes info
function P_PS {
	echo "ps=$(ps -eo pcpu,pmem,user,pid,command,start,time --sort -%cpu | head -n 11)";
}

#storage info
function P_DF {
	echo "df=$(df -h)";
}

function P_UPTIME {
	echo "uptime=$(uptime)";
}

#network interfaces & current usage bandwitch
function P_IFCONFIG {
	echo "ifconfig=$(ifconfig | grep 'Link encap\|RX bytes')";
}

#cpu thermal info
function P_CPUTEMP {
	echo "cputemp=$(($(cat /sys/class/thermal/thermal_zone0/temp)/1000))";
}