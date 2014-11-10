// rx functions lovingly compiled from http://reactive-extensions.github.io/learnrx/
'use strict';

// Strap on the map/reduce functions for rx mojo
// on to the Array prototype.

// map
//-----------------------------------------
// Applying a function to a value and creating a new 
// value is called a projection. To project one array 
// into another, we apply a projection function to 
// each item in the array and collect the results in 
// a new array.

// Example:
// ```
// newReleases.map(function(video) { return {id: video.id, title: video.title}; });
// ```
// Array.prototype.map = function (projectionFunction) {
// 	var results = [];
// 	this.forEach(function (itemInArray) {
// 		results.push(projectionFunction(itemInArray));
// 	});

// 	return results;
// };

// filter
//-----------------------------------------
// Like projection, filtering an array is also a very 
// common operation. To filter an array we apply a test 
// to each item in the array and collect the items that 
// pass into a new array.

// Example
// ```
// newReleases.
// filter(function (video) {
// 	return video.rating === 5.0;
// })
// ```

// Array.prototype.filter = function (predicateFunction) {
// 	var results = [];
// 	this.forEach(function (itemInArray) {
// 		if (predicateFunction(itemInArray)) {
// 			results.push(itemInArray);
// 		}
// 	});

// 	return results;
// };

// mergeAll
//-----------------------------------------
// Sometimes, in addition to flat arrays, we need to query 
// trees. Trees pose a challenge because we need to flatten 
// them into arrays in order to apply filter() and map() 
// operations on them. In this section we'll define a mergeAll() 
// function that we can combine with map() and filter() to 
// query trees.

// Example:
// ```
// movieLists.map(function (movieList) {
// 	return movieList.videos.
// 	map(function (video) {
// 		return video.id;
// 	});
// }).
// mergeAll();
// ```

Array.prototype.mergeAll = function () {
	var results = [];
	this.forEach(function (subArray) {
		results.push.apply(results, subArray);
	});

	return results;
};

// flatMap
//-----------------------------------------
// Nearly every time we flatten a tree we chain map() 
// and mergeAll(). Sometimes, if we're dealing with a 
// tree several levels deep, we'll repeat this combination 
// many times in our code. To save on typing, let's create 
// a flatMap function that's just a map operation, followed 
// by a mergeAll.

// Example
// ```
// movieLists.
// 	flatMap(function (movieList) {
// 		return movieList.videos.
// 		flatMap(function (video) {
// 			return video.boxarts.
// 			filter(function (boxart) {
// 				return boxart.width === 150;
// 			}).
// 			map(function (boxart) {
// 				return {
// 					id: video.id,
// 					title: video.title,
// 					boxart: boxart.url
// 				};
// 			});
// 		});
// 	});
// ```


Array.prototype.flatMap = function (projectionFunctionThatReturnsArray) {
	return this.
	map(function (item) {
		return projectionFunctionThatReturnsArray(item);
	}).
	// apply the mergeAll function to flatten the two-dimensional array
	mergeAll();
};

// reduce
//-----------------------------------------
// Sometimes we need to perform an operation on more than one item 
// in the array at the same time. For example, let's say we need 
// to find the largest integer in an array. We can't use a filter() 
// operation, because it only examines one item at a time. To find 
// the largest integer we need to the compare items in the array 
// to each other.
// Example: 
// ```
// var ratings = [2,3,1,4,5];
// ratings.
// 	reduce(function (acc, curr) {
// 		if (acc > curr) {
// 			return acc;
// 		} else {
// 			return curr;
// 		}
// 	});
// ```

// Array.prototype.reduce = function (combiner, initialValue) {
// 	var counter,
// 		accumulatedValue;

// 	// If the array is empty, do nothing
// 	if (this.length === 0) {
// 		return this;
// 	} else {
// 		// If the user didn't pass an initial value, use the first item.
// 		if (arguments.length === 1) {
// 			counter = 1;
// 			accumulatedValue = this[0];
// 		} else if (arguments.length >= 2) {
// 			counter = 0;
// 			accumulatedValue = initialValue;
// 		} else {
// 			throw new Error('Invalid arguments.');
// 		}

// 		// Loop through the array, feeding the current value and the result of 
// 		// the previous computation back into the combiner function until
// 		// we've exhausted the entire array and are left with only one function.
// 		while (counter < this.length) {
// 			accumulatedValue = combiner(accumulatedValue, this[counter]);
// 			counter++;
// 		}

// 		return [accumulatedValue];
// 	}
// };

// zip
//-----------------------------------------
// Sometimes we need to combine two arrays by progressively 
// taking an item from each and combining the pair. If you 
// visualize a zipper, where each side is an array, and each 
// tooth is an item, you'll have a good idea of how the zip 
// operation works.

// Example:
// ```
// Array.
// 	zip(
// 		videos,
// 		bookmarks,
// 		function (video, bookmark) {
// 			return {
// 				videoId: video.id,
// 				bookmarkId: bookmark.id
// 			};
// 		});
// ```

Array.prototype.zip = function (left, right, combinerFunction) {
	var counter,
		results = [];

	for (counter = 0; counter < Math.min(left.length, right.length); counter++) {
		results.push(combinerFunction(left[counter], right[counter]));
	}

	return results;
};
