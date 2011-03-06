#!/usr/bin/python
import os
import sys

fileList = [
	"sylvester.js",
	"glutils.js",
	"Engine.js",
	"soyutils.js",
	"shader-vs.js",
	"shader-fs.js",
	"SpriteEngine.js",
]

print """
 ^o^  Compiling your scripts
"""

command = "java -jar compiler.jar "
for f in fileList:
	command = command + '--js "'+f+'" '
command = command + ' --js_output_file="SpriteEngine-min.js" --compilation_level=SIMPLE_OPTIMIZATIONS'
os.system(command) 

