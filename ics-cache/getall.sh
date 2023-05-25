#!/bin/bash
while IFS= read -r row; do
    URL=$(echo ${row} | cut -d "|" -f 2)
    echo $URL
    ID=$(echo ${row} | cut -d "|" -f 1)
    wget $URL $id -O cal-cache-$ID.ics
done < <(sqlite3 ../prisma/dev.db 'select id,url from calendar;')
