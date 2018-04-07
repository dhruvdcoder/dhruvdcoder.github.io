---
layout: post
title: "Linear regression using TensorFlow"
date: 2018-03-17
desc: "Getting started with TensorFlow by doing Linear Regression"
categories: [Machinelearning]
keywords: ""
permalink: /machinelearning/linear-reg-using-TF/
tags: [Python,Machine Learning,TensorFlow]
---
{% include table_of_contents.md %}
# Introduction

In this post I share my findings while fiddling with hyperparameters of [mini-batch](https://www.coursera.org/learn/deep-neural-network/lecture/lBXu8/understanding-mini-batch-gradient-descent) gradient descent. I use [TensorFlow](https://www.tensorflow.org/) to setup a [linear regression](https://en.wikipedia.org/wiki/Linear_regression) problem using computaional graphs. Then I go on and visualize the impact of various values of batch sizes and learning rates on the convergence of the training. 

## 1. Getting the data ready

Fetch the dataset.

```python
import sklearn
import numpy as np
import tensorflow as tf
```


```python
from sklearn.datasets import fetch_california_housing
data=fetch_california_housing()
m,n =data.data.shape
print("Number of datapoints: {}, Number of features: {}".format(m,n))
```

    Number of datapoints: 20640, Number of features: 8


Since we are going to use gradient descent, we need to normalize the features. We will use [StandardScalar](http://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html) for this.


```python
from sklearn.preprocessing import StandardScaler
scaler=StandardScaler()
scaled_data=scaler.fit_transform(data.data)
```

We well merge the bias into the feature matrix by adding an extra column of 1's. Also, we put the values for `y` in `target_date`


```python
data_with_bias=np.c_[np.ones((m,1)),scaled_data]
data_target=np.array(data.target.reshape(-1,1))
```

## 2. Setting up placeholders and variables
Now this is important, since we are going to be using mini-batch gradient descent ([this](https://machinelearningmastery.com/gentle-introduction-mini-batch-gradient-descent-configure-batch-size/) is a good explanation if you do not know what that is), we will not be feeding in the complete `X` and `y` on every step of gradient descent. Instead, we will be feeding in a portion of `X` (some rows,all columns) and the corresponding portion of `y` for computing the gradient at every step. Call this step as an **iteration**. Hence there will be several of such iterations before the entire `X` and `y` is processed once. When the entire `X` and `y` is seen once by the trainig algorithm we say that it has completed one **epoch**. 

So at each iteration of each epoch, we need to feed in a chunck of `X` and `y` to the training algorithm. We can do this by using placeholders as shown below. At this point one must wonder if we need the placeholder. We can achieve the same using a `tensorflow.Variable`. Indeed, technically we can do that but to be clear on the  philosophical level, we will use placeholders. There are quite a few discussions on this question on [StackOverflow](https://stackoverflow.com/questions/36693740/whats-the-difference-between-tf-placeholder-and-tf-variable). 


```python
# create placeholders for X and y
X=tf.placeholder(tf.float32,shape=(None,n+1),name="X")
y=tf.placeholder(tf.float32,shape=(None,1),name="y")
# create theta as a variable
theta=tf.Variable(tf.random_uniform([n+1,1],-1,1),dtype=tf.float32,name="theta")
```

Setup the optimization problem by defining the Mean Square Error as the cost.


```python
# define the MSE
y_pred=tf.matmul(X,theta,name="pred")
error=y-y_pred
mse=tf.reduce_mean(tf.square(error),name="mse")
```

We need a way to fetch the appropriate chunk of `X` and `y` at every iteration and for that we define the following function.


```python
# function to fetch batches during the loop
def fetch_batch(epoch,batch_index,batch_size,X_full,y_full):
    starting_index=batch_index*batch_size # 0-based
    X_batch=X_full[starting_index:batch_size-1,:]
    y_batch=y_full[starting_index:batch_size-1,:]
    return X_batch,y_batch
```

We use the awesome **Autodiff** of tensorflow to define the gradient *op*. 


```python
grad=tf.gradients(mse,[theta])[0]
```

This defines the *op* as the gradient of MSE with respect to theta. We need the indexing of `[0]` because the `gradients()` returns a list which in this case will have only one entry, ie., d(mse)/d(theta).

### 3. Running the experiments

We will run the training with different mini-batch sizes and learning rates and see what happens to the convergence.


```python
# batch parameters
batch_sizes=[m,10000,4000,1000,500,100]
n_batches=[int(np.ceil(m/batch_size)) for batch_size in batch_sizes]
learning_rates=[0.1,0.01,0.001]
n_epochs=10000
print("Number of batches and corresponding batch sizes: {} and {}".format(n_batches,batch_sizes))
```

    Number of batches and corresponding batch sizes: [1, 3, 6, 21, 42, 207] and [20640, 10000, 4000, 1000, 500, 100]


Note, that when batch size is m, the mini-batch gradient descent becomes the good old batch gradient descent.

In order to visualize the results using TensorBoard, we need to log the MSE after some intervals during training. If we log the MSE at every iteration, the trainig will become extremely slow for small batch sizes. Hence we will log the MSE at regular intervals with the interval length depending on the batch size.


```python
number_of_logging_points=1000
number_of_iterations=[n_epochs*n_batch for n_batch in n_batches]
logging_intervals=[int(np.ceil(n_iterations/number_of_logging_points)) for n_iterations in number_of_iterations]
```

Set up the summary logging *op* and the directory to log into. 


```python
mse_summary=tf.summary.scalar("MSE",mse)
root_log_dir="linear_reg_mini_batch_log"
```


```python
# trainig info
for index,batch_size in enumerate(batch_sizes):
    for learning_rate in learning_rates:
        print("Starting with batch_size, learning_rate : {},{}".format(batch_size,learning_rate))
        logdir="{}/bs_lr_{}_{}_".format(root_log_dir,batch_size,learning_rate)
        with tf.summary.FileWriter(logdir,tf.get_default_graph()) as file_writer:
            tf_learning_rate=tf.constant(learning_rate,dtype=tf.float32,name="eta")
            training_op=tf.assign(theta,theta-tf.scalar_mul(tf_learning_rate,grad))

            # optimization loop
            init=tf.global_variables_initializer()
            with tf.Session() as sess:
                sess.run(init)
                for epoch in range(n_epochs):
                    for batch_index in range(n_batches[index]):
                        X_batch,y_batch=fetch_batch(epoch,batch_index,batch_size,data_with_bias,data_target)
                        sess.run(training_op,feed_dict={X:X_batch,y:y_batch})
                        iteration_number=epoch*n_batches[index] + batch_index
                        # log if its time
                        if iteration_number%logging_intervals[index]==0:
                            summary_str = mse_summary.eval(feed_dict={X:data_with_bias, y: data_target})
                            #print("Summary at iteration {} is {}".format(iteration_number,summary_str))
                            file_writer.add_summary(summary_str,iteration_number)
                best_theta=theta.eval()
                print("Last theta for batch_size = {} and learning_rate = {} is {}".format(batch_size,learning_rate,best_theta))
    
```

    Starting with batch_size, learning_rate : 20640,0.1
    Last theta for batch_size = 20640 and learning_rate = 0.1 is [[ 2.0685394 ]
     [ 0.8296084 ]
     [ 0.11876322]
     [-0.2654881 ]
     [ 0.30567175]
     [-0.00450175]
     [-0.03932488]
     [-0.90001875]
     [-0.8706466 ]]
    Starting with batch_size, learning_rate : 20640,0.01
    Last theta for batch_size = 20640 and learning_rate = 0.01 is [[ 2.0685456 ]
     [ 0.8296293 ]
     [ 0.11876663]
     [-0.26552728]
     [ 0.30570385]
     [-0.00450078]
     [-0.03932568]
     [-0.8999754 ]
     [-0.8706057 ]]
    Starting with batch_size, learning_rate : 20640,0.001
    Last theta for batch_size = 20640 and learning_rate = 0.001 is [[ 2.0684962 ]
     [ 0.87597966]
     [ 0.14852975]
     [-0.31368488]
     [ 0.32818463]
     [ 0.00572688]
     [-0.04283285]
     [-0.63938254]
     [-0.6135134 ]]
    Starting with batch_size, learning_rate : 10000,0.1
    Last theta for batch_size = 10000 and learning_rate = 0.1 is [[ 2.0568504 ]
     [ 0.8582064 ]
     [ 0.06467796]
     [-0.2956867 ]
     [ 0.31660813]
     [-0.00608491]
     [-0.07521318]
     [-0.9474076 ]
     [-0.78547466]]
    Starting with batch_size, learning_rate : 10000,0.01
    Last theta for batch_size = 10000 and learning_rate = 0.01 is [[ 2.0568318 ]
     [ 0.858334  ]
     [ 0.06473739]
     [-0.2959267 ]
     [ 0.31679764]
     [-0.00606508]
     [-0.07523267]
     [-0.94692004]
     [-0.7850244 ]]
    Starting with batch_size, learning_rate : 10000,0.001
    Last theta for batch_size = 10000 and learning_rate = 0.001 is [[ 2.054902  ]
     [ 0.8644313 ]
     [ 0.11249213]
     [-0.25207406]
     [ 0.2571359 ]
     [ 0.01744054]
     [-0.09212425]
     [-0.582187  ]
     [-0.42114326]]
    Starting with batch_size, learning_rate : 4000,0.1
    Last theta for batch_size = 4000 and learning_rate = 0.1 is [[ 1.8044745 ]
     [ 0.7472528 ]
     [ 0.06763608]
     [-0.057499  ]
     [ 0.09339876]
     [ 0.06119372]
     [-0.02580783]
     [-0.63115513]
     [-0.617709  ]]
    Starting with batch_size, learning_rate : 4000,0.01
    Last theta for batch_size = 4000 and learning_rate = 0.01 is [[ 1.804469  ]
     [ 0.7472623 ]
     [ 0.06764106]
     [-0.05750946]
     [ 0.09340686]
     [ 0.06119563]
     [-0.02580906]
     [-0.6311248 ]
     [-0.61768275]]
    Starting with batch_size, learning_rate : 4000,0.001
    Last theta for batch_size = 4000 and learning_rate = 0.001 is [[ 1.7934053 ]
     [ 0.75247514]
     [ 0.08669367]
     [-0.03751118]
     [ 0.07217436]
     [ 0.07376763]
     [-0.02985864]
     [-0.5329598 ]
     [-0.52532756]]
    Starting with batch_size, learning_rate : 1000,0.1
    Last theta for batch_size = 1000 and learning_rate = 0.1 is [[-4.1549528e-01]
     [ 7.3785764e-01]
     [ 2.1736942e-02]
     [-1.5859893e-02]
     [ 9.6337905e-04]
     [ 1.0072936e-01]
     [-1.6046844e+00]
     [ 2.8790812e+00]
     [ 2.8822070e-01]]
    Starting with batch_size, learning_rate : 1000,0.01
    Last theta for batch_size = 1000 and learning_rate = 0.01 is [[ 0.07143406]
     [ 0.7625873 ]
     [ 0.03952408]
     [-0.03538337]
     [ 0.05297027]
     [ 0.08940196]
     [-1.0845796 ]
     [ 0.7102532 ]
     [-0.99813867]]
    Starting with batch_size, learning_rate : 1000,0.001
    Last theta for batch_size = 1000 and learning_rate = 0.001 is [[ 0.98424524]
     [ 0.6997722 ]
     [ 0.05606056]
     [ 0.08790555]
     [ 0.05178555]
     [ 0.09300189]
     [-1.0255258 ]
     [ 0.5097671 ]
     [-0.44520685]]
    Starting with batch_size, learning_rate : 500,0.1
    Last theta for batch_size = 500 and learning_rate = 0.1 is [[-4.35849   ]
     [ 0.7666489 ]
     [ 0.04466588]
     [-0.14351065]
     [-0.30251637]
     [ 0.24530533]
     [-1.0840456 ]
     [ 5.3175406 ]
     [-0.7817363 ]]
    Starting with batch_size, learning_rate : 500,0.01
    Last theta for batch_size = 500 and learning_rate = 0.01 is [[ 0.28291577]
     [ 0.8274152 ]
     [ 0.07962184]
     [-0.21364391]
     [-0.24530363]
     [ 0.25409   ]
     [-0.99915653]
     [ 0.6596568 ]
     [-0.8485149 ]]
    Starting with batch_size, learning_rate : 500,0.001
    Last theta for batch_size = 500 and learning_rate = 0.001 is [[ 1.1689515 ]
     [ 0.90036047]
     [ 0.09042873]
     [-0.33697408]
     [ 0.23417369]
     [ 0.23431619]
     [-0.41514468]
     [ 1.0165831 ]
     [ 0.06800342]]
    Starting with batch_size, learning_rate : 100,0.1
    Last theta for batch_size = 100 and learning_rate = 0.1 is [[ 1.1913959 ]
     [ 0.7524418 ]
     [ 0.02796565]
     [-0.36571068]
     [-0.2648481 ]
     [ 0.06694885]
     [ 0.49220008]
     [ 1.9115707 ]
     [ 0.7887486 ]]
    Starting with batch_size, learning_rate : 100,0.01
    Last theta for batch_size = 100 and learning_rate = 0.01 is [[ 0.9030122 ]
     [ 0.76355475]
     [ 0.03291726]
     [-0.36602253]
     [-0.27864406]
     [ 0.07086192]
     [ 0.42905754]
     [ 0.768743  ]
     [-0.2979711 ]]
    Starting with batch_size, learning_rate : 100,0.001
    Last theta for batch_size = 100 and learning_rate = 0.001 is [[ 0.47109702]
     [ 0.7481807 ]
     [ 0.03990402]
     [-0.3255204 ]
     [-0.27928215]
     [ 0.08695494]
     [-0.14432243]
     [-0.302904  ]
     [-1.4162055 ]]


## 4. Visualizing Results

You can see the logged values of MSE using TensorBoard using `$ tensorboard --logdir path_to_root_log_dir`. Unfortunately there is no way to export the graphs as images from tensorboard. However, it does let you export the data as csv file, which I have used to create these graphs.


```python
import matplotlib.pyplot as plt
import pandas as pd
```


```python
dir_for_csv="/Users/dhruvesh/Downloads"
Dfs=[[pd.read_csv("/Users/dhruvesh/Downloads/run_bs_lr_{}_{}_-tag-MSE.csv".format(batch_size,learning_rate))
              for learning_rate in learning_rates]
              for batch_size in batTime to run our experimentsch_sizes]
labels=[["Learning_r :{}".format(learning_rate)
              for learning_rate in learning_rates]
              for batch_size in batch_sizes]
```


```python
def plot_for_batch_s(Dfs,labels,batch_number,learning_rates,axis):
    for i,learning_rate in enumerate(learning_rates):
        axis.plot(Dfs[batch_number][i]['Step'],Dfs[batch_number][i]['Value'],label="Learning_r = {}".format(learning_rate))
        #plt.ylim([0.4,2.5])
        axis.set_title("Batch size : {}".format(batch_sizes[batch_number]))
        axis.legend()
```






```python
fig,axes=plt.subplots(6,figsize=(15,30))
for batch_number,batch_s in enumerate(batch_sizes):
    plot_for_batch_s(Dfs,labels,batch_number,learning_rates,axes[batch_number])
```


![abc]({{ "/static/assets/img/blog/2018-03-17-linear_reg_using_gradient-mini-batch/2018-03-17-linear_reg_using_gradient-mini-batch_30_0.png" | absolute_url }}  "asd")



As we reduce the mini-batch size, the training algorithm finds it difficult to converge. Infact, it starts to diverge (as shown for batch sizes of 1000 and less). While reducing the learning rate stabilizes the training and does not let it diverge, it slows down the training significantly. 

Then why not use the straitforward batch gradient instead of mini-batch gradient and be done with it ? Well, for linear regression, the cost function is convex and that is why the normal batch gradient descent works perfectly. The true usefulness of mini-batch gradient descent will be seen when the cost function is more complex and is now convex.


# Code

The code for the post can be found [here](https://github.com/dhruvdcoder/TensorFlowExperiments/blob/master/basics/linear_reg_using_gradient-mini-batch.ipynb).

# References
1. [Géron, Aurélien. Hands-on machine learning with Scikit-Learn and TensorFlow: concepts, tools, and techniques to build intelligent systems. " O'Reilly Media, Inc.", 2017.](http://shop.oreilly.com/product/0636920052289.do)
