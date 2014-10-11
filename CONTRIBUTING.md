Marionette has a few guidelines to facilitate your contribution and streamline
the process of getting the changes merged in and released.

## Running the tests

There are two methods to running the unit test suite, suited for your desired workflow and overall developer happiness.
To begin ensure that you have installed the project dev dependencies via:

    $ npm install

    $ bower install

### In a browser

  Open [SpecRunner.html](SpecRunner.html) in your browser.

### Via Grunt

  Running `grunt` alone will default to running the tests once.
  Running `grunt watch` will rerun the tests after any file change.

## Documentation Fixes

If you notice any problems with any documentation, please
fix it and we'll get it merged as soon as we can. For
small things like typos and grammar (which we know I'm
terrible with), just click the "Edit this file" button
and send in the pull request for the fix. For larger
changes and big swaths of documentation changes, a regular
pull request as outlined below is more appropriate.

## Pull Requests

See [Github's documentation for pull requests](https://help.github.com/articles/using-pull-requests).

Pull requests are by far the best way to contribute to
Marionette. Any time you can send us a pull request with
the changes that you want, we will have an easier time
seeing what you are trying to do. But a pull request in
itself is not usually sufficient. There needs to be some
context and purpose with it, and it should be done
against a specific branch.

Try and stick to Marionette's existing coding conventions
(just use the file you're editing as a guideline).
Installing the appropriate [EditorConfig plugin](http://editorconfig.org/#download)
for your code editor will help with this.

## General Submission Guidelines

These guidelines are generally applicable whether or not
you are submitting a bug or a pull request. Please try to
include as much of this information as possible with any
submission.

### Version Numbers

In order to best help out with bugs, we need to know the
following information in your bug submission:

* Backbone version #
* Underscore version #
* jQuery version #
* Marionette version #
* Operating System / version #
* Browser and version #

Including this information in a submission will help
us to test the problem and ensure that the bug is
both reproduced and corrected on the platforms / versions
that you are having issues with.

### Provide A Meaningful Description

It doesn't matter how beautiful and "obvious" your fix is.
We have 10,000,000,000 things floating around the project
at any given moment and we will not immediately understand
why you are making changes.

Given that, it is very important to provide a meaningful
description with your pull requests that alter any code.
A good format for these descriptions will include three things:

1. Why: The problem you are facing (in as much detail as is
necessary to describe the problem to someone who doesn't
know anything about the system you're building)

2. What: A summary of the proposed solution

3. How: A description of how this solution solves the problem,
in more detail than item #2

4. Any additional discussion on possible problems this might
introduce, questions that you have related to the changes, etc.

Without at least the first 2 items in this list, we won't
have any clue why you're changing the code. The first thing
we'll ask, then, is that you add that information.

Please refrain from giving code examples in altJS languages like
CoffeeScript, etc. Marionette is written in plain-old JavaScript
and is generally easier all members in the community to read.

### Create A Topic Branch For Your Work

The work you are doing for your pull request should not be
done in the master branch of your forked repository. Create
a topic branch for your work. This allows you to isolate
the work you are doing from other changes that may be happening.

Github is a smart system, too. If you submit a pull request
from a topic branch and we ask you to fix something, pushing
a change to your topic branch will automatically update the
pull request.

### Isolate Your Changes For The Pull Request

See the previous item on creating a topic branch.

If you don't use a topic branch, we may ask you to re-do your
pull request on a topic branch. If your pull request contains
commits or other changes that are not related to the pull
request, we will ask you to re-do your pull request.

### Branch from "minor" or "major," not "master"

README and unit test updates can be opened against Master.

Code changes should go against the "minor" or "major" branches. If your change is backwards
compatible then it should be "minor," otherwise go with "major." If you're unsure,
go with "minor" and we will update it if we need to.

### Submit Specs With Your Pull Request

Whenever possible, submit the specs (unit tests) that
correspond to your pull request.

I would rather see a pull request that is nothing but a
failing spec, than see a large change made to the real
code with no test to support the change.

In fact...

## Submit A Failing Spec If You Don't Know How To Fix The Problem

If you are stuck in a scenario that fails in your app,
but you don't know how to fix it, submit a failing spec
to show the failing scenario. Follow the guidelines for a
pull request submission, but don't worry about fixing the
problem. A failing spec to show that a problem exists is
a very very very helpful pull request for us.

We'll even accept a failing test pasted in to the ticket
description instead of a pull request. That would at
least get us started on creating the failing test in the code.
