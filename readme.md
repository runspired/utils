#Utils

Yet Another Utils Library.

##Why YAUL?

I often find I need utility functions that otherwise truly awesome libraries
such as underscore or Ember lack.  Over time, I've collected the things I've written
into this modular pattern.

##ES6

This package is published as an es6 module installable bower or npm.
If demand arises, or if someone wants to set it up themselves with a pull request,
I will provide `AMD` / `CJS` / `Global` versions.

The advantage of being `ES6` is that this library is easily consumable in tiny parts, ideal
for situations where you just need one or a couple missing utility functions.

Only need a specific string test in your project?  Now you only need to import that module.

##Tests

I intend on creating both positive and failing tests for all of the utility functions provided.
While I have not had the time to yet, this library and these functions have been ported with me
project to project, maintained, and updated for nearly a decade now.

##installation

`npm install runspired-utils --save`

`bower install runspired-utils --save`

##License

This package carries the MIT license.