Marionette has a few very specific guidelines in addition to some of the standard guidelines that Github and open source projects in general recommend. These guidelines are here to facilitate your contribution and streamline the process of getting the changes merged in and released.

If you don't follow these guidelines, we'll still work with you to get the changes in. Any contribution you can make will help tremendously. Following these guidelines will help to streamline the pull request and change submission process.

## Documentation Fixes

If you notice any problems with any documentation, please fix it and we'll get it merged as soon as we can. For small things like typos and grammar (which we know I'm terrible with), just click the "Edit this file" button and send in the pull request for the fix. For larger changes and big swaths of documentation changes, a regular pull request as outlined below is more appropriate.

## Pull Requests

See [Github's documentation for pull requests](https://help.github.com/articles/using-pull-requests).

Pull requests are by far the best way to contribute to Marionette. Any time you can send us a pull request with the changes that you want, we will have an easier time seeing what you are trying to do. But a pull request in itself is not usually sufficient. There needs to be some context and purpose with it, and it should be done against specific branch.

### Provide A Meaningful Description

It doesn't matter how beautiful and "obvious" your fix is in your own eyes. we have 10,000,000,000 things floating through my head at any given moment and we will not immediately understand why you are making changes.

Given that, it is very important to provide a meaningful description with your pull requests that alter any code. A good format for these descriptions will include three things:

1. Why: The problem you are facing (in as much detail as is necessary to describe the problem to someone who doesn't know anything about the system you're building)

2. What: A summary of the proposed solution

3. How: A description of how this solution solves the problem, in more detail than item #2

4. Any additional discussion on possible problems this might introduce, questions that you have related to the changes, etc.

Without at least the first 2 items in this list, we won't have any clue why you're changing the code. The first thing we'll ask, then, is that you add that information.

### Create A Topic Branch For Your Work

The work you are doing for your pull request should not be done in the master branch of your forked repository. Create a topic branch for your work. This allows you to isolate the work you are doing from other changes that may be happening.

Github is a smart system, too. If you submit a pull request from a topic branch and we ask you to fix something, pushing a change to your topic branch will automatically update the pull request. 

### Isolate Your Changes For The Pull Request

See the previous item on creating a topic branch.

If you don't use a topic branch, we may ask you to re-do your pull request on a topic branch. If your pull request contains commits or other changes that are not related to the pull request, we will ask you to re-do your pull request.

### Branch from "dev" not "master"

The "master" branch of the Marionette repository is for production release code, and documentation updates only. Never create a pull request from the master branch. Always create a branch for your work from the "dev" branch. This will facilitate easier pull request management for the continuous work that is done in the dev branch.

### Submit Specs With Your Pull Request

Whenever possible, submit the specs (unit tests) that correspond to your pull request. 

I would rather see a pull request that is nothing but a failing spec, than see a large change made to the real code with no test to support the change.

In fact...

## Submit A Failing Spec If You Don't Know How To Fix The Problem

If you are stuck in a scenario that fails in your app, but you don't know how to fix it, submit a failing spec to show the failing scenario. Follow the guidelines for pull request submission, but don't worry about fixing the problem. A failing spec to show that a problem exists is a very very very helpful pull request for us.

We'll even accept a failing test pasted in to the ticket description instead of a pull request. That would at least get us started on creating the failing test in the code.

## Don't Be A Troll

It is very sad that we need to include this section of the contribution guidelines...

If you are running in to a scenario with a problem, don't be a troll. Comment like "does marionette even have tests?" are not useful, funny or constructive. In fact, it may get you blocked and reported for abuse to Github. 

Submit a useful comment describing the scenario that is having an issue. Show us a failing test. Show us some code that is not behaving the way the documentation says it should. Be useful and work with us to fix the problem.

We're all for criticism and tearing apart Marionette for the problems it has. Do it in a constructive and helpful manner: "There isn't a test for this scenario. Here's a rough idea for one that shows the problem." Tell us why you don't like Marionette. Tell us that someone else is building something better and why that other thing fits your scenario and needs better than Marionette does. Just do it in a manner that allows us to learn from your experiences, instead of reacting to you being a troll (likely causing us to get defensive and miss an opportunity to learn something).
