---
layout: post
title: 
description: the right way to send signals to a slurm job
categories:
- Machinelearning
- mathematics
keywords: Machine Learning, mathematics
tags:
- Machine Learning
- mathematics
img: 
date: 2021-08-24 22:13 -0400
---
## Issue with signal propagation to inner script on slurm.

When one runs `scancel` or when the job reaches its time limit, slurm will send SIGTERM to the job and wait for certain amount of time before it sends the final SIGKILL. During this time between SIGTERM and SIGKILL, the job can do some cleanup/saving etc to exit gracefully. This is all good. However, when we run a python script in sbatch


```python
see_signal.py
-------------
import signal
import time

print("start script")

def print_signal(sig, frame):
	print("Script recieved signal:", sig)
	if sig == 15:
		print("SIGTERM recieved, raising SIGINT")
		raise KeyboardInterrupt

signal.signal(signal.SIGTERM, print_signal)
signal.signal(signal.SIGCONT, print_signal)

try:

	print("script started")

	for i in range(100000):
		print("working...")
		time.sleep(0.1)

except KeyboardInterrupt as e:

	print("SIGINT recieved in script. We will exit gracefully")
	time.sleep(10)
```

```bash
#!/bin/bash

#SBATCH --output=t.log

python see_signal.py

```

The python script never receives the SIGTERM, but dies a painful and sudden death when the job receives the SIGKILL. Also, changing the execution of the python script to a proper job step by using `srun python see_signal.py` instead of `python see_signal.py` does not help either.

## Solutions:

1. Start the process in background and use its PID to sent the relevant signal [^signal]

	```bash
	#!/bin/bash
	#SBATCH --output=t.log
	#SBATCH --signal=B:TERM@60 # tells the controller
							   # to send SIGTERM to the job 60 secs
							   # before its time ends to give it a
							   # chance for better cleanup.

	# Install trap for the signals INT and TERM to
	# the main BATCH script here.
	# Send SIGTERM using kill to the internal script's
	# process and wait for it to close gracefully.

	# Note: Most python scripts don't install handler
	# for SIGTERM and hence might die a quick painful death
	# on recieveing SIGTERM (kill -15).
	# To avoid this, you can send SIGINT,
	# i.e., KeyboardInterrupt using (kill -2).
	trap 'echo signal recieved in BATCH!; kill -15 "${PID}"; wait "${PID}";' SIGINT SIGTERM

	# Start the work in background process and get its PID
	python see_signal.py &

	# Set the PID var so that the trap can use it
	PID="$!"
	wait "${PID}"
	```

	If you cancel the job manually, make sure that you specify the signal as TERM like so `scancel --signal=TERM <jobid>`.

2. If you only have one jobstep, a much cleaner solution is to  use `exec` to start that step in the main BATCH process (solution courtesy Michael Boratko.)

	```bash
	#!/bin/bash
	#SBATCH --output=t.log
	#SBATCH --signal=B:TERM@60 # tells the controller
							   # to send SIGTERM to the job 60 secs
							   # before its time ends to give it a
							   # chance for better cleanup.


	exec python see_signal.py

	```
3. By default all the signals to a job are only sent to main BATCH script. If the job-steps inside this script use `srun`, then the signals are propagated to the job-steps. However, if the main BATCH script does not handle the signal, it will not wait for the job-steps to handle the propagated signals. Hence, ultimately, the job-steps will still not get a chance to end gracefully.
	So, the recommended way for such a case is to install a trap for the signal in the main BATCH script and in it ask the job to wait for all the subprocesses/job-steps to end.[^mailinglist]

	```bash
	#!/bin/bash
	#SBATCH --output=t.log
	#SBATCH --signal=B:TERM@60 # tells the controller
							   # to send SIGTERM to the job 60 secs
							   # before its time ends to give it a
							   # chance for better cleanup.

	# trap the signal to the main BATCH script here.
	sig_handler()
	{
	 echo "BATCH interrupted"
	 wait # wait for all children, this is important!
	}

	trap 'sig_handler' SIGINT SIGTERM SIGCONT

	srun python see_signal.py
	```

## References

[^mailinglist]: [https://lists.schedmd.com/pipermail/slurm-users/2020-April/005237.html](https://lists.schedmd.com/pipermail/slurm-users/2020-April/005237.html)
[^signal]: [https://hpc-discourse.usc.edu/t/signalling-a-job-before-time-limit-is-reached/314](https://hpc-discourse.usc.edu/t/signalling-a-job-before-time-limit-is-reached/314)
