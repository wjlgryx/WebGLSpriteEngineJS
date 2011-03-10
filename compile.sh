cd src
./compile_templates.sh
python compile.py
cd ..
cp src/SpriteEngine-min.js example/js/
cp run_server.sh example/
