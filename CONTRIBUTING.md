Marionette has a few guidelines to facilitate your contribution and streamline
the process of getting changes merged in and released.

1. [Setting up Marionette locally](#setting-up-marionette-locally)
2. [Reporting a bug](#reporting-a-bug)
  1. [When you have a patch](#when-you-have-a-patch)
  2. [When you don't have a bug fix](#when-you-dont-have-a-bug-fix)
3. [Running Tests](#running-tests)
4. [Updating docs](#updating-docs)


## Setting up Marionette locally

* Fork the Marionette repo.

* `git clone` your fork onto your computer.

* Run `npm install` to make sure you have all Marionette dependencies locally.

## Reporting a bug

In order to best help out with bugs, we need to know the following information
in your bug submission:

* Marionette version no.
* Backbone version no.

Including this information in a submission will help us test the problem and
ensure that the bug is both reproduced and corrected on the platforms /
versions that you are having issues with.

<a name="format-desc"></a>**Provide A Meaningful Description**

It is very important to provide a meaningful description with your bug reports
and pull requests. A good format for these descriptions will include the
following things:

1. The problem you are facing (in as much detail as is necessary to describe
the problem to someone who doesn't know anything about the system you're
building)

2. A summary of the proposed solution

3. A description of how this solution solves the problem, in more detail than
item #2

4. Any additional discussion on possible problems this might introduce,
questions that you have related to the changes, etc.

For a PR, we need at least the first 2 items to understand why you are changing
the code. If not, we will ask that you add the necessary information.

Please refrain from giving code examples in altJS languages like CoffeeScript,
etc. Marionette is written in plain-old JavaScript and is generally easier all
members in the community to read.

### When you have a patch

See [Github's documentation for pull
requests](https://help.github.com/articles/using-pull-requests).

Pull requests are by far the best way to contribute to Marionette. Any time you
can send us a pull request with the changes that you want, we will have an
easier time seeing what you are trying to do. But a pull request in itself is
not usually sufficient. There needs to be some context and purpose with it, and
it should be done against a specific branch.

Try and stick to Marionette's existing coding conventions (just use the file
you're editing as a guideline). Installing the appropriate [EditorConfig
plugin](http://editorconfig.org/#download) for your code editor will help with
this.

* Decide whether you are need to base off of `next` or `patch` branch. Do not
 base off `master`.

    * PRs for all bug fixes, doc updates, and unit tests of existing features
should be opened against `patch`.

    * PRs for all new features, breaking or not, should be opened against
`next`.

* Checkout `next` or `patch` and run `git pull` to make sure it is updated.

* Create a new branch for your PR by running `git checkout -b new-branch-name`

* Whenever possible, submit the specs (unit tests) that correspond to your pull
request.

* Make changes to files in `src`, not the builds in `lib`. This is built before
every release.

* Push to your remote fork then compare.

* Submit pull request.
  When doing so, make sure you follow the format for description outlined
[above](#format-desc).
  If you are resolving an existing issue, make sure to link to the issue in the
description.

### When you don't have a bug fix

If you are stuck in a scenario that fails in your app, but you don't know how to
fix it, submit a failing spec to show the failing scenario. Follow the
guidelines for a pull request submission, but don't worry about fixing the
problem. A failing spec to show that a problem exists is a very very very
helpful pull request for us.

We'll even accept a failing test pasted into the ticket description instead of a
PR. That would at least get us started on creating the failing test in the code.

## Running Tests

There are 3 ways you can run the tests.

* via command-line by running `npm test`

* in the browser by opening `SpecRunner.html`

* via Grunt by running `grunt` to run tests once or `grunt watch` to rerun on
each change

## Updating docs

If you notice any problems with any documentation, please fix it and we'll get
it merged as soon as we can. For small things like typos and grammar, just click
the "Edit this file" button and send in the pull request for the fix. For larger
documentation changes, a regular pull request as outlined above is more
appropriate.
