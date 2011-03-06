cd src
./compile_templates.sh
python compile.py
cd ..
cp src/SpriteEngine-min.js example/simple/
cp run_server.sh example/simple/
