#!/bin/bash

if [[ $# -ne 2 ]]; then
    echo "Run $0 <input src file> <input css file>" 
    exit 1
fi

INPUT_SRC_DIR=$1
INPUT_ALL_CSS=$2

if [ ! -d "$1" ] || [ ! -f "$2" ]  ; then
	echo "can not read files"
	exit 2
fi


OUTPUT_DIR=`dirname $INPUT_ALL_CSS`
OUTPUT_FONT_FILE="${OUTPUT_DIR}/../webfonts/merged.ttf"
OUTPUT_CSS_FILE="${OUTPUT_DIR}/min_font.css"

REGEX_FILE='min_fontawesome.txt'

grep -hEo 'fa-([a-z0-9-]+)' -r $INPUT_SRC_DIR | sort -u | awk '{print $1":"}' > $REGEX_FILE;

text=`sed 's/}\./}\n./g' $INPUT_ALL_CSS | grep -f $REGEX_FILE`

echo $text | cat "${OUTPUT_DIR}/base.css" - | tr -d '\n' > $OUTPUT_CSS_FILE

gzip -fk9 $OUTPUT_CSS_FILE
brotli -f $OUTPUT_CSS_FILE

words=`sed 's/:$//' $REGEX_FILE`

rm $REGEX_FILE;

reg=':before\{content:"\\\K[^"]{1,5}'; 

unicodes=""

for code in $words; do
	unicodes="`echo $text | grep -oP "${code}${reg}"`,$unicodes"
done

# echo $unicodes;

fonttools subset --unicodes="${unicodes}" --no-subset-tables+=FFTM --flavor=woff2 $OUTPUT_FONT_FILE;
fonttools subset --unicodes="${unicodes}" --no-subset-tables+=FFTM --flavor=woff $OUTPUT_FONT_FILE;





