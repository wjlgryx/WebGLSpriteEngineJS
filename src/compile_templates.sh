#! /bin/bash
java -jar SoyToJsSrcCompiler.jar  --outputPathFormat shader-fs.js   shader-fs.soy
java -jar SoyToJsSrcCompiler.jar  --outputPathFormat shader-vs.js   shader-vs.soy
