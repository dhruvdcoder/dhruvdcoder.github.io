---
layout: post
title: "Class scoped constants in C++"
date: 2017-12-01
desc: "Ways to define class scoped constants in C++"
categories: [Cpp]
keywords: ""
tags: [Cpp,C++]
icon: icon-html
---


There are several instances when one needs constants in their code, *compile-time* as well as *run-time*, *class-scoped* as well as *global*. Recently I found myself in the need of using class scoped constants. I've put together several ways to realise class scoped constants in C++.

### 1. **Using `const` member**

This can be used to create an instace specific constant which occupies memory at runtime.

   Code:

```c++
#include <iostream> 
using namespace std; 
class A 
{ 
      const int C; 
   public: 
      A(int value):C(value){}
      int getC() { return C;} 
}; 
int main() { 
   A a (10); 
   cout<<a.getC()<<endl; 
   return 0; 
}
```

### 2. **Using `static const` member**

If you prefer the constant to be the same for all instances of the class, make the member static. However, there are a couple of nuances one must be aware of while implementing this. 

If you wish to use the member as compile-time constant, you just declare it in the class and initialize it with a value as shown in the following snippet.
```c++
#include <iostream> 
using namespace std; 
 
class A 
{ 
   static const int C = 10; // static const members are allowed to be initialized in the declaration
   public: 
      int arr[C]; // Use as compile-time constant 
      int getC() { return C;} 
}; 
int main() { 
   A a; 
   a.arr[9]=9;
   cout << "arr[9] = " << a.arr[9] << endl;
   return 0; 
} 
```

Here, the member `static const int C` cannot be used as an lvalue, i.e., the expression `A::C` is an rvalue expression. 
```c++
#include <iostream> 
using namespace std; 
 
class A 
{ 
   public: 
      static const int C = 10; // static const members are allowed to be initialized in the declaration
      int arr[C]; // Use as compile-time constant 
      const int* getC() { return &C;} 
}; 
int main() { 
   A a; 
   cout << a.getC() << endl;
   return 0; 
} 
```

In order to be able to use it as lvalue, one needs to *define* it. 
```c++
#include <iostream> 
using namespace std; 
 
class A 
{ 
   public: 
      static const int C = 10; // static const members are allowed to be initialized in the declaration
      int arr[C]; // Use as compile-time constant 
      const int* getC() { return &C;} 
}; 
const int A::C; // definition
int main() { 
   A a; 
   cout << a.getC() << endl;
   return 0; 
} 
```


### 3. **Using `enum` member**

This is similar to the case of using `const static` without definition. Here as well, `A.C` is an rvalue expression.
```c++
#include <iostream> 
using namespace std; 
 
class A 
{ 
   public: 
      enum {C=10}; // can only be used as a compile-time constant 
      int arr[C]; 
      int getC() { return C;} 
}; 
 
int main() { 
   A a; 
   cout<<a.getC()<<endl; 
   return 0; 
} 
```



One could very well replace the `const` in the all previous examples with `constexpr` and it would work the same.

To summarize, one can use `const`, `static const`, with definition or `static const`(without definitin)/`enum` member, depending if one needs an instance specific run-time constant, class specific run-time constant or class specific compile-time constant. 

<script language="javascript">
window.onload = coliru.addRunButtonsToCodeBlocks();
</script>

