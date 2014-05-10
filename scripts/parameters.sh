#short for: reload parameter 'mem'

function P_LOADAVG {
	echo "loadavg=$(cat /proc/loadavg)";
}

function P_LOAD {
	echo "load=$(cat /proc/stat | tail -n +2 | head -n $(nproc))";
}

function P_MEM {
	echo "mem=$(free -m | tail -n 3)";
}

function P_MEM2 {
	echo "mem2=$(cat /proc/meminfo | grep 'MemTotal\|MemFree\|Buffers\|Cached\|SwapTotal\|SwapFree')";
}

function P_CORES {
	echo "cores=$(cat /proc/cpuinfo | grep 'model name\|cpu MHz')";
}

function P_PS {
	echo "ps=$(ps -eo pcpu,pmem,user,pid,command,start,time --sort %cpu | tail -n 10)";
}

function P_DF {
	echo "df=$(df -h | tail -n +2)";
}

function P_UPTIME {
	echo "uptime=$(uptime)";
}

function P_IFCONFIG {
	echo "ifconfig=$(ifconfig | grep 'Link encap\|RX bytes')";
}