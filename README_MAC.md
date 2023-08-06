1. Ruby issue on Mac
    1. The ruby installation that comes with Mac will not work. So use `brew install ruby` to get the latest version. It will be in `/usr/local/Cellar/ruby/`
    2. Then add it to the path: `export PATH=/usr/local/Cellar/ruby/3.1.2_1/bin:$PATH`
2. The best way is to use `rbenv install 2.8.7` to install ruby-2.8.7. Then enable it locally `rbenv local 2.8.7`. You will need to enable before every bundle command.