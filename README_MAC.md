1. Option 1: Ruby issue on Mac: Installing new ruby directly
    1. The ruby installation that comes with Mac will not work. So use `brew install ruby` to get the latest version. It will be in `/usr/local/Cellar/ruby/`
    2. Then add it to the path: `export PATH=/usr/local/Cellar/ruby/3.1.2_1/bin:$PATH`
2. Option 2: Install rbenv and then install ruby followed by activating the correct ruby version
  1. Install rbenv using instructions given here: https://github.com/rbenv/rbenv
  2. Install and activate a ruby version. For example, `rbenv install 2.7.8` and then `rbenv local 2.7.8`. 
  3. Install bundler `gem install bundler`
  4. Install all required gems `bundle install`
3. The steps in 1 or 2 need to be completed only once. From then on, you just need to initialize `rbenv local 2.7.8`.