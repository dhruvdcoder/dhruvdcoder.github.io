---
layout: post
title: "Hyperparameter optimization for AllenNLP with W&B"
date: 2020-03-24
desc: "Introduces a micro-library to use W&B with AllenNLP for hyperparameter optimization"
categories: [Machinelearning, NLP, tools]
keywords: "Machine Learning, mathematics, NLP, AllenNLP, tools, wandb"
permalink: "/machinelearning/wandb-allennlp/"
tags: [Machine Learning, WandB, AllenNLP, tools]
img: /static/assets/img/blog/2020-01-22-wandb-allennlp/wandb-allennlp.png
use_math: false
---


### Update: AllenNLP has discarded `CallbackTrainer` which is heavily used in this setup. Hence, this tutorial and the micro-library will only work with AllenNLP v0.9.0.

# Introduction

Are you a fan of [AllenNLP](https://allennlp.org)? Do you have a hard time tuning the hyperparameters for your NLP projects? Well, you've come to the right place. After looking around for some time, I have found the setup that works best for my NLP projects. In this post, I will introduce this setup and a micro-library I built which can aid in using this set up in your projects.


# Prerequisites

If you are not familiar with AllenNLP, I would urge you to go through their [official tutorial](https://github.com/allenai/allennlp/tree/master/tutorials/tagger), especially the part where the [use of config files](https://github.com/allenai/allennlp/tree/master/tutorials/tagger#using-config-files) is explained -- this is my favorite part of the AllenNLP library.


[Weights and Biases (wandb)](https://docs.wandb.com/quickstart) provides access to a hyperparameter search server as well as a client library which can communicate with the server and launch training instances with hyperparameter sets supplied by the server. The most useful feature and the one I will be talking about is called [Sweep](https://docs.wandb.com/sweeps/overview). Please read about this feature in their documentation before moving further.


# Problem

The problem that I faced while trying to use wandb sweeps for one of my existing projects which was using AllenNLP was the communication between my local training script and the wandb server. Specifically, I prefer using AllenNLP's built-in train loop via their `allennlp train` command. This command has the following format.

```
usage: allennlp train [-h] -s SERIALIZATION_DIR [-r] [-f] [-o OVERRIDES]
                      [--file-friendly-logging]
                      [--cache-directory CACHE_DIRECTORY]
                      [--cache-prefix CACHE_PREFIX]
                      [--include-package INCLUDE_PACKAGE]
                      param_path

Train the specified model on the specified dataset.

positional arguments:
  param_path            path to parameter file describing the model to be
                        trained

optional arguments:
  -h, --help            show this help message and exit
  -s SERIALIZATION_DIR, --serialization-dir SERIALIZATION_DIR
                        directory in which to save the model and its logs
  -r, --recover         recover training from the state in serialization_dir
  -f, --force           overwrite the output directory if it exists
  -o OVERRIDES, --overrides OVERRIDES
                        a JSON structure used to override the experiment
                        configuration
  --file-friendly-logging
                        outputs tqdm status on separate lines and slows tqdm
                        refresh rate
  --cache-directory CACHE_DIRECTORY
                        Location to store cache of data preprocessing
  --cache-prefix CACHE_PREFIX
                        Prefix to use for data caching, giving current
                        parameter settings a name in the cache, instead of
                        computing a hash
  --include-package INCLUDE_PACKAGE
                        additional packages to include
```

As you can see, there are compulsory positional arguments like the name of the sub-command i.e. `train`, the path to the config file (`param_path`). Moreover, the hyperparameters that one wants to change have to be passed using multiple `--overrides` flags. This does not work well with wandb sweep server -- it sends all the command-line arguments for your training script using `--key=value` format.

Another issue with using AllenNLP's default training script with wandb is that one needs a way to inject code in the script for it to communicate the training progress with the wandb server.


# Solution

One possible solution for the first problem is to write your own training script which accepts command-line arguments as sent by the wandb sweep server. However, I prefer sticking with AllenNLP's training script because it is robust and well written. Then what else can we do if we want to use AllenNLP's training script as it is? Now, this might sound *hacky*, well, it is 🙌. But it works! We can create a wrapper script that translates the command-line input from the wandb sweep server to something which `allennlp train` can understand. This wrapper script then calls AllenNLP's train script using these translated commandline arguments.

While the solution to the first problem is a bit hacky, the solution for the second problem is quite straight forward thanks to the `CallbackTrainer` introduced in AllenNLP [v0.8.5](https://github.com/allenai/allennlp/releases/tag/v0.8.5). We simply hook-up callbacks to the training events like validation end, epoch end, etc. These callbacks can send the training and validation metrics to the wandb server.

While there is a more elaborate version of these two solutions running in my projects, I have managed to pull out a general, complete and working version of these into its own package [wandb_allennlp](https://pypi.org/project/wandb-allennlp). The rest of this post is a tutorial in using wandb_allennlp.

# Overview

At a high level, we need to perform the following steps to use wandb with AllenNLP.

1. Install `wandb-allennlp`

2. Create an entry-point script file `run.py`

3. Create your model using AllenNLP along with a *training configuration* file.

4. Create a *sweep configuration* file and generate a sweep on the wandb server.

5. Set the necessary environment variables.

6. Start the search agents.


The rest of the article walks through these steps using an example model.


## Installation

1. Install the package using pip.

```
pip install wandb-allennlp
```

2. Create an entry-point file with the following content. Name it `run.py`.


```
from wandb_allennlp.commandline import run

if __name__ == "__main__":
    run()
```


## Using with wandb sweeps

We will be running, using wandb, a hyperparameter search for an LSTM based Natural Language Inference model implemented in AllenNLP. The code for this example can be found in the [examples folder](https://github.com/dhruvdcoder/wandb-allennlp/tree/master/examples) of the `wandb-allennlp` package.

### Model

First we need to define our model which consists of an LSTM encoder, encoding both hypothesis and the premise sentences, and a feedforward layer which takes the final states of the encoded premise and hypothesis and performs the classification. We create this model and place it in a folder (package/module/submodule) called `models`. Since the model is irrelevant for this post, I will not be going through the code. However, the code for this can be found [here](https://github.com/dhruvdcoder/wandb-allennlp/blob/master/examples/models/lstm_nli.py).


### Dummy Data

The data for this example can be downloaded from [here](https://github.com/dhruvdcoder/wandb-allennlp/tree/master/examples/data/snli_1.0_test). It is a truncated version of the SNLI dataset. In order to use the configuration as it is, please keep the directory structure `data/snli_1.0_test/snli_1.0_<train/dev/test>.json`.


After creating the model inside a *models* module and downloading the data, the project directory should look like the following:

```
├── data
│   └── snli_1.0_test
│       ├── snli_1.0_dev.jsonl
│       ├── snli_1.0_test.jsonl
│       └── snli_1.0_train.jsonl
├── models
│   ├── __init__.py
│   └── lstm_nli.py
└── run.py
```


## Config

In order to train this model using the `allennlp train` command, we need to create a *training configuration* file which tells it about various structural and hyperparameter choices of our training setup -- dataset reader, data iterators, model, trainer, etc. I have to say it again: This is the part of AllenNLP that I like the most. If you do not know what goes into writing this config file or do not understand what one of the entries means in the config file I am about to show you, please refer to [this](https://github.com/allenai/allennlp/blob/v0.9.0/tutorials/getting_started/walk_through_allennlp/configuration.md) tutorial or comment in the comments section of this page. Now, assuming you are familiar with writing config files for AllenNLP models, you should be able to write one for your own model. In the case of this example, it would look something like the following [file](https://github.com/dhruvdcoder/wandb-allennlp/blob/master/examples/configs/lstm_nli.jsonnet).

```
{
    "dataset_reader": {
        "type": "snli",
        "token_indexers": {
            "tokens": {
                "type": "single_id",
                "lowercase_tokens": true
            }
        }
    },
  "train_data_path": std.extVar("DATA_PATH")+"/snli_1.0_test/snli_1.0_train.jsonl",
  "validation_data_path": std.extVar("DATA_PATH")+ "/snli_1.0_test/snli_1.0_dev.jsonl",
    "model": {
            "type": "nli-seq2vec",
	    "input_size": 50,
            "hidden_size": 50,
            "rnn": "LSTM",
            "num_layers": 1,
            "bidirectional": true,
	    "projection_size": 50,
            "debug": false

    },
    "iterator": {
        "type": "bucket",
        "sorting_keys": [["premise", "num_tokens"],
                         ["hypothesis", "num_tokens"]],
        "batch_size": 32
    },
    "trainer": {
		"type":"callback",
		"callbacks":[
			{
				"type": "validate"
			},
			{
				"type": "checkpoint",
				"checkpointer":{
					"num_serialized_models_to_keep":1
				}
			},
			{
				"type": "track_metrics",
				"patience": 10,
				"validation_metric": "+accuracy"
			},
			{
				"type": "log_metrics_to_wandb"
			}
		],
		"optimizer": {
			"type": "adam",
			"lr":0.01,
		},
		"cuda_device": -1,
		"num_epochs": 10,
		"shuffle": true
	}
}
```

The important thing to note here is the callback `log_metrics_to_wandb` -- this will log the training and validation metrics on the wandb server.

### Creating a sweep

If you have never used wandb sweeps before, please see their excellent [documentation](https://docs.wandb.com/sweeps) or comment in the comments section if you have specific questions. After creating a project on the wandb server, we need to initialize a wandb directory using the following command which will ask you to sign-in and select the appropriate project:

```
wandb init
```


Now, in order to create a hyperparameter sweep, we need to create a [*sweep configuration*](https://docs.wandb.com/sweeps/quickstart#2-sweep-config) file which contains details about the search ranges and the method of search. This should be a `YAML` file. For this example it looks something like [this](https://raw.githubusercontent.com/dhruvdcoder/wandb-allennlp/master/examples/configs/wandb_sweep_nli_lstm.yaml):

```
name: nli_lstm
program: run.py
method: bayes
metric:
  name: best_validation_accuracy
  goal: maximize
parameters:
  # hyperparameters start with overrides
  # Ranges
  overrides.model.input_size:
    min: 100
    max: 500
    distribution: q_uniform
  overrides.model.hidden_size:
    min: 100
    max: 500
    distribution: q_uniform
  overrides.model.projection_size:
    min: 50
    max: 1000
    distribution: q_uniform
  overrides.model.num_layers:
    values: [1,2,3]
  overrides.model.bidirectional:
    #values: ["true", "false"]
    value: "true"
  overrides.trainer.optimizer.lr:
    min: -7.0
    max: 0
    distribution: log_uniform
  overrides.trainer.optimizer.weight_decay:
    min: -12.0
    max: -5.0
    distribution: log_uniform
  overrides.model.type:
    value: nli-lstm
  local_config_file:
    value: "configs/lstm_nli.jsonnet"
  subcommand:
    value: train
```


The key thing to note in the sweep configuration are the names of the parameters we want to tune. For instance we would like to find the best value for the `input_size` under the `model` section in the *training configuration* file. We specify this as `overrides.model.input_size` in the sweep configuration file. Similarly, we can search for the best value of any parameter mentioned in the *training configuration* file (even the ones which are not explicitly mentioned in the training config file but have defaults in code). For instance, `overrides.trainer.optimizer.weight_decay` tunes the weight decay parameter of the optimizer, even though it is not explicitly mentioned in the training config file.

You will also notice parameter names which do not start with `overrides.`. These are dummy hyperparams, that is, wandb thinks of them as hyperparameters but they take constant values. We need these because `allennlp` expects its commandline arguments in a certain form. However, at this point, the two dummy parameters that you need to know and use are `subcommand` and `local_config_file`. As the names suggest, they are used to specify the subcommand for `allennlp` command and the path to our *training configuration* file.


At this point the project directory should look like the following:

```
.
├── configs
│   ├── lstm_nli.jsonnet
│   └── wandb_sweep_nli_lstm.yaml
├── data
│   └── snli_1.0_test
│       ├── snli_1.0_dev.jsonl
│       ├── snli_1.0_test.jsonl
│       └── snli_1.0_train.jsonl
├── models
│   ├── __init__.py
│   └── lstm_nli.py
└── run.py
```

Once we create sweep configuration file, we create a sweep on the wandb server using this file using the following command:

```
wandb sweep configs/wandb_sweep_nli_lstm.yaml
```

```
wandb: Creating sweep from: configs/wandb_sweep_nli_lstm.yaml
wandb: Created sweep with ID: wcssqmhh
wandb: View sweep at: https://app.wandb.ai/dhruveshpate/allenlp-wandb-demo/sweeps/wcssqmhh
wandb: Run sweep agent with: wandb agent dhruveshpate/allenlp-wandb-demo/wcssqmhh
```


### Setting up the environment variables

Information which is persistent across agent runs as well as sweeps is given to `wandb-allennlp` using environment variables. The most important one is `include_package`. If you are familiar with AllenNLP, then you know that if you define your own class and want to refer to it in the training config, then you need to tell the AllenNLP named registry about its existence. This is done by passing a keyword argument `--include-package` to the `allennlp train` command. This can be achieve through `wandb-allennlp` by setting setting the environment variable `include_package`. We need assign it a comma separated list of package names that we want included. In this example, we defined our new model (nli-seq2vec) in the `models` package. Hence we  will set the environment variable as follows:

```
export include_package=models
```

Moreover, we need to make sure that python is able to find the packages you are including (you can use virtual environment or PYTHONPATH to ensure this).


We also need to set any environment variables used in the training configuration file. In this example, we have to set the `DATA_DIR` as follows:

```
export DATA_PATH=./data
```


### Starting the agents

By this point, all the hardwork has been done. Now we just need to [launch the search agents](https://docs.wandb.com/sweeps/quickstart#4-launch-agent-s). We need to use the sweep id generated in the previous step. For this example it is `wcssqmhh`.

```
wandb agent wcssqmhh
```

That is it! Now see the training progress on the wandb server. The runs for this example can be found [here](https://app.wandb.ai/dhruveshpate/allenlp-wandb-demo?workspace=user-dhruveshpate).

If you find this post useful, please share it with your fellow researchers and engineers.
