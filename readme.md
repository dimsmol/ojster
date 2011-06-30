# Ojster

Ojster is "objective javascript templater" - dead simple template engine which translates .ojst templates into javascript classes capable of template content rendering.

* Template syntax is similar to EJS - full JS power available within templates
* Templates need to be "compiled" similar to Google Closure Templates
* Single template can be used for Node and Google Closure Library as well _(with some care)_, other frameworks can be added easily _(or not so easily)_

* Templates are almost entirely JS-based, have very few "tags" provided as a syntax sugar and to hide some differences between ways Node and Closure handle modules
* Generated template code represents regular JS class
* Template to code translation is as straight as possible, it always clear what final code will look like

* Templates can inherit other templates or your own classes
* You can inherit from template class just like from any regular JS class
* "blocks" became methods that can be overriden in inherited templates (similar to how Django template blocks work)

* Parametrized blocks are yet not ready, but will be available soon


## Readme TODO

* add more clear conceptions description
* describe difference between Node and Closure module systems and how it is handled by Ojster
* provide examples
