---
layout: post
title: "Structuring TensorFlow code to use high-level APIs"
date: 2018-04-01
desc: "Describes a possible way of structuring TensorFlow code so that it can be used with TF's highlevel APIs like tf.estimator"
categories: [Machinelearning]
keywords: "Machine Learning, Python, TensorFlow"
permalink: "/machinelearning/structuring-tf-code/"
tags: [Python,Machine Learning,TensorFlow]
---
{% include table_of_contents.md %}
# Introduction
In my one of my previous [posts](https://dhruvdcoder.github.io/machinelearning/2018/03/17/linear_reg_using_gradient-mini-batch.html) we built a simple linear regression model using TensorFlow. If you are working on a big project it becomes very important to structure your models in a consistent way so that they can be used with high-level TensorFlow API's like `tf.estimator.Estimator`<sup>[\[2\]](#2)</sup>. These high-level APIs provide two major features:

1. [Summary](https://www.tensorflow.org/api_guides/python/summary) and [Checkpointing](https://www.tensorflow.org/get_started/checkpoints) without you writing any extra code.

2. They keep the model and the runtime environment separated. What this means is that you can run training/evaluation/prediction on any environment (CPU, GPU, multiple GPUs) simply by changing a couple of lines in the configuration that you provide to the estimator, without making any change in your model code. More information on this can be found in the youtube video of The TensorFlow Summit 2018<sup>[\[2\]](#1)</sup>.

Also, this kind of structure will help you experiment quickly with different models by getting rid of a lot of boilerplate code. So lets get started.


# Prerequisites

I assume that you have some experience with TensorFlow and its low-level Ops APIs. If you are just getting started with TensorFlow, then please refer these[\[4\]](#4)[\[5\]](#5)[\[6\]](#6)[\[7\]](#7) excellent resources which will help you get up and running with TensorFlow. 


# Article

In this post I will be describing the following: 

1. Creating a standard model interface.  

2. Using this interface to structure a linear regression model.

3. Using the model with `tf.estimator.Estimator`<sup>[\[2\]](#2)</sup>.

## Creating a standard model interface

We will first create an [abstract base class](https://docs.python.org/3/library/abc.html) which will act as an interface for all our models. The class instances have to be [callable](https://stackoverflow.com/questions/111234/what-is-a-callable-in-python) since we will be passing an instance as the `model_fn` parameter to the methods of [Estimator](https://www.tensorflow.org/api_docs/python/tf/estimator/Estimator). The instances will be called with one of the three [modes](https://www.tensorflow.org/api_docs/python/tf/estimator/ModeKeys)(prediction, training, evaluation), as an input and it would need to return an instance of [`tf.estimator.EstimatorSpec`](https://www.tensorflow.org/api_docs/python/tf/estimator/EstimatorSpec). Following is the code for our simple base class called `Model`.

```python
import abc



class ModelBase(abc.ABC):

    def __init__(self,  *args, **kwargs):
        """ To store all the configuration parameters as instance attributes
        """
        
    def __call__(self, features, labels, mode, params):
        """Create the graph, send in the input and return the appropriate tensor
           depending on the mode.

           Arguments:
               inputs:
           Returns:
                an tf.estimator.EstimatorSpec instance with appropriate attributes set
        """
        
        if mode == tf.estimator.ModeKeys.TRAIN:
            return self._call_train(features,labels)
        elif mode == tf.estimator.ModeKeys.PREDICT:
            return self._call_predict(features, labels)
        elif mode == tf.estimator.ModeKeys.EVAL:
            return self._call_eval(features,labels)
    
    @abc.abstractmethod
    def _call_train(self, inputs, targets):
        pass
    
    @abc.abstractmethod
    def _call_predict(self, inputs):
        pass
    
    @abc.abstractmethod
    def _call_eval(self,inputs, targets):
        pass
    
```

## Defining a Linear Regression model using the Model Interface

Equipped with the simple interface, we are ready to implement the three abstract methods corresponding to the *predict, train and evaluate* modes.  


### 1. We create a subclass called `LinearRegModel` from our `Model` class. 


```python
class LinearRegModel(ModelBase):
    def __init__(self):
        super().__init__()
        self._model_variable_scope = 'weights'
        self._kernel_name = 'kernel'
        self._bias_name = 'bias'
        self._apply_name = 'apply'
        self._kernel = None
        self._bias = None
        self._loss = lambda y_target, y_pred: tf.reduce_mean(
            tf.square(y_target - y_pred))
        self._optimizer = tf.train.AdamOptimizer
        self._learning_rate = 0.001
        self._metric = tf.metrics.root_mean_squared_error
        self._metric_name = 'RMS'
```

Here, I have hardcoded the `_optimizer`, `_learning_rate`, `_loss` and `_metric` in the constructor. But ideally we would like to make them as settable [properties](https://docs.python.org/3.6/howto/descriptor.html#properties ) with the constructor accepting an argument for each of them with sensible defaults.



### 2. For any of the three modes, one would definitely require atleast the prediction part of the graph. Hence we will define `_call_predict()` first and then reuse it in `_call_train()` and `_call_eval()`.

Here, it is important to set `reuse=True` in `tf.variable_scope` because the `_create_variables()` method will create the variables for *kernel* and *bias* and we want to use these variables in our prediction. More information on sharing variables can be found [here](https://www.tensorflow.org/programmers_guide/variables#sharing_variables)


```python

    def _call_predict(self, features, labels, is_internal_call=False):
        self._create_variables(features, labels)
        with tf.variable_scope(self._model_variable_scope, reuse=True) as scope:
            kernel = tf.get_variable(self._kernel_name, dtype=tf.float64)
            bias = tf.get_variable(self._bias_name, dtype=tf.float64)
            with tf.name_scope(self._apply_name):
                prediction = tf.add(tf.matmul(features, kernel), bias)
        if is_internal_call:
            return prediction
        else:
            mode = tf.estimator.ModeKeys.PREDICT
            return tf.estimator.EstimatorSpec(mode, predictions=prediction)

    def _call_eval(self, features, targets):
        y_pred = self._call_predict(features, targets, is_internal_call=True)
        loss = self._loss(targets, y_pred)
        metric = self._metric(targets, y_pred)
        mode = tf.estimator.ModeKeys.EVAL
        return tf.estimator.EstimatorSpec(mode, loss=loss, eval_metric_ops={self._metric_name: metric})

    def _call_train(self, features, targets):
        y_pred = self._call_predict(features, targets, is_internal_call=True)
        loss = self._loss(targets, y_pred)
        training_op = self._optimizer(
            learning_rate=self._learning_rate).minimize(loss, global_step=tf.train.get_global_step())
        mode = tf.estimator.ModeKeys.TRAIN
        return tf.estimator.EstimatorSpec(mode, loss=loss, train_op=training_op)
```

The `_create_variables()` helper method, creates the trainable variables for the *kernel* and *bias*. Information on how to create variables can be found [here](https://www.tensorflow.org/programmers_guide/variables). 

```python
    def _create_variables(self, features, labels, *args, **kwargs):
        n_features = self._infer_num_features(features)
        n_labels = 1
        if labels is not None:
            n_labels = self._infer_num_labels(labels)
        with tf.variable_scope(self._model_variable_scope) as scope:
            self._kernel = tf.get_variable(name=self._kernel_name, initializer=tf.random_uniform(
                shape=[n_features, 1], dtype=tf.float64))
            self._bias = tf.get_variable(
                name=self._bias_name, initializer=tf.random_uniform([1], dtype=tf.float64))
```

## Using the Linear Regression model with `tf.estimator.Estimator`

Once we create our `LinearRegModel` class we are ready to do linear regression in TensorFlow with just a few lines of code. In order to feed-in the data to our model, we will require an input function which will prepare `tf.data.Dataset` object. The dataset object will have two elements, `features` and `labels`, packed as a tuple. Every entry in the `features` will contain and instance of our feature values and the corresponding entry in the `labels` will be the target value for regression. 

First, lets get some data and prepare it to feed it into our model.

```python
# Fetching the data
from sklearn.datasets import fetch_california_housing
data=fetch_california_housing()

# Preprocessing the data
from sklearn.preprocessing import StandardScaler
scaler=StandardScaler()
scaled_features=scaler.fit_transform(data.data)

train_test_ratio = 0.7
import numpy as np
((train_features, test_features), (train_y, test_y)) = (map(lambda x: np.split(
        x, [int(np.ceil(train_test_ratio*len(x)))]), (scaled_features, data.target)))
```


Now we define two separate input functions to feed data to training and evaluation respectively. The `tf.data.Dataset` objects have to be structured as mentioned in the previous paragraph. More information on that can be found [here](https://www.tensorflow.org/api_docs/python/tf/data/Dataset). 


```python
def train_input_fn(features, targets, batch_size):
    #create a Dataset object
    with tf.name_scope('train_input_pipline'):
        dataset = tf.data.Dataset.from_tensor_slices((features,targets))
        # repeat infinitely, shuffle and batch the data
        dataset = dataset.shuffle(1000).repeat().batch(batch_size)
    return dataset

def eval_input_fn(features, targets, batch_size):
    with tf.name_scope('eval_input_pipeline'):
        dataset = tf.data.Dataset.from_tensor_slices((features, targets))
        dataset = dataset.batch(batch_size)
    return dataset
```

Now we are ready to train our model. We need to create an instance of `tf.estimator.Estimator` and pass in our instance of `LinearRegModel` as the `model_fn` argument. The estimator will dump the logs of all the summary operations and the checkpoints in the `model_dir`. One can use TensorBoard to visualize the progress of training as well the graph of the model using `$ tensorboard --logdir=<your_model_dir>` in the terminal.

```python
# create a model using LinearRegModel
model = LinearRegModel()
max_steps = 1000
batch_size = 500

# create an instance of Estimator
estimator = tf.estimator.Estimator(model_fn=model, model_dir='temp/LinearReg')

# begin the training
trained = estimator.train(lambda:train_input_fn(train_features,train_y,batch_size), max_steps=max_steps)
```

Evaluate the trained model on test data.


```python
evaluated = estimator.evaluate(lambda:eval_input_fn(test_features,test_y,batch_size))
```
# Conclusion

The content described here can be used as a starting point for your model. However, there are some features missing in this like the use of [feature columns](https://www.tensorflow.org/versions/master/get_started/feature_columns). Using feature columns adds another layer to your input pipeline which lets you add different kinds of features (numeric, categorical, embedded, bucketed, etc.,) to your models with minimal lines of code.

Another aspect that is missing here and I strongly recommend using is `tf.keras.layers` to build you model's layer. Here, our model is very simple and only has a single dense layer (linear regression) and hence I've chosen to implement it directly using the low-level ops like `tf.matmul()` and `tf.add()` but as your model becomes more complex, [keras layers](https://www.tensorflow.org/api_docs/python/tf/keras/layers) will help you build it quickly without losing control of the details. There is great youtube video from the TensorFlow Summit 2018<sup>[\[1\]](#1)</sup> talking about the ease that TensorFlow's highlevel APIs can bring-in while experimenting with your models.

# Code

The complete code for this post can be found [here](https://github.com/dhruvdcoder/TensorFlowExperiments/blob/master/basics/structuring_into_models.ipynb)

# References
<a name="1">[1]</a> [The Practitioner's Guide with TF High Level APIs (TensorFlow Dev Summit 2018)](https://www.youtube.com/watch?v=4oNdaQk0Qv4)

<a name="2">[2]</a> [Estimators in TensorFlow](https://www.tensorflow.org/programmers_guide/estimators)

<a name="3">[3]</a> [Creating custom estimators in TensorFlow](https://www.tensorflow.org/get_started/custom_estimators) 

<a name="4">[4]</a> [Stanfords CS20SI: Tensorflow for deep learning research](http://web.stanford.edu/class/cs20si/index.html)

<a name="5">[5]</a> [Discussion of CS20SI slides on youtube](https://www.youtube.com/watch?v=g-EvyKpZjmQ)

<a name="6">[6]</a> [Tensorflow's Programmer's Guide](https://www.tensorflow.org/programmers_guide/low_level_intro)

<a name="7">[7]</a> [Géron, Aurélien. Hands-on machine learning with Scikit-Learn and TensorFlow: concepts, tools, and techniques to build intelligent systems. " O'Reilly Media, Inc.", 2017.](http://shop.oreilly.com/product/0636920052289.do)



{% include comments_encouragement.md %}
