begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end

desc "Build the annotated source HTML"
task :docco do
  `docco lib/backbone.marionette.js`
  `git add -A`
  `git stash`
  `git checkout gh-pages`
  `rm -rdf docs`
  `git add -A`
  `git stash pop`
  `git commit -am 'updating docs'`
  `git push origin gh-pages`
  `git checkout master`
end
