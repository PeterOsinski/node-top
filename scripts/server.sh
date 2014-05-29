#!/usr/bash

while [ true ]; do 

  { echo -e 'HTTP/1.1 200 OK\r\n'; echo 'HELLO WORLD'; } | nc -l 8080;
  
done;
