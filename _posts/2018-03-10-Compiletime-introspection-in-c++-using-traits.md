---
layout: post
title: "Compile-time Introspection in C++ using Traits"
date: 2018-03-10
desc: "Why and how to use trait classes, a peek into template-meta-programming"
keywords: "template meta-programming,traits"
categories: [Cpp]
tags: [Cpp,C++,template-meta-programming]
---

Recently while working on a project involving computational algebra using C++, I encountered a need of mapping a data-structures to algorithms in a one-to-one way. To be concrete, my algorithm's (call it `doGreatThings()`) implementation needed to be aware of the type of the data-structure which was being used inside one of the arguments passed to my algorithm. The implementation of `doGreatThings()` would need to be very different depending upon the type of data-structure being used. I had sever data-structures and corresponding implementations of `doGreatThings()` and I needed a clean way to let the algorithm know which data-structure was being used at the compile-time. **Enter trait classes!**

# What can they do ?

As put succinctly by the master himself,

<p class="quotes"> Think of a trait as a small object whose main purpose is to carry information used by another object or algorithm to determine "policy" or "implementation details". - Bjarne Stroustrup  </p>

Traits can be used to introspect a type and provide implementation of a functionallity based on the type or impose a constraint on the type[\[1\]](#1).


Trait classes are not a construct provided by the language but an idiom/pattern developed by programmers. It uses two very useful techniques of template metaprogramming which are worth remembering. The first one is **_"use types to pass information at compile-time"_** and the second one is **_"use function overloading as `if-else` statement at compile-time"_**  

# How do we implement them ?


# References
<a name="1">[1] </a> [Item 4 from](http://www.gotw.ca/publications/mxc++-item-4.htm) : [Sutter, Herb. More exceptional C++: 40 new engineering puzzles, programming problems, and solutions. Pearson Education India, 2002.](https://www.pearson.com/us/higher-education/program/Sutter-More-Exceptional-C-40-New-Engineering-Puzzles-Programming-Problems-and-Solutions/PGM177058.html)

2. 
