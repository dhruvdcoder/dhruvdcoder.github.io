---
layout: post
title: "I-Glide"
date: 2014-05-01
desc: "Development of a product that addresses the short distance transportation (2-7 km) issues of people"
categories: [Projects]
keywords: "Robotics"
permalink: "/projects/iglide/"
tags: [Robotics]
---
{% include table_of_contents.md %}
****

Problem Statement
=================

To develop a product that addresses the short distance transportation (2-7 km) issues of people across age groups while keeping the product compact, portable and safe.

Motivation
----------

Around \( 85% \) of students in institute either took public transport or cycled to reach their desired destination. But this model had its deficit. Students complained about parking issues and bike getting stolen or damaged.
When we interacted with the older age group they complained about safety and parking issues issues and an absence of transport option that could directly reach their doorstep. Other issues also included significant waiting times and overcrowding in public transportation systems.
We wanted a solution that could address all of these issues. This required the final product to be portable, compact and easy to use on daily basis.

Market
------

The next step was to study the market that could be targeted. There is a lot of scope for a product like this, if tweaked as per the needs as the range would further widened

1.  **Students and middle-aged group:** Our primary target, here the product could eliminate issues mentioned above.

2.  **Mall, airport and hotel staff:** The product could be modified to provide safe, stable transport with an option to carry luggage.

3.  **Movement of operators in multi-bay plants:** This would reduce waiting times and increase plant efficiency.

Existing products
-----------------

Products in the market targetting these problems include Scarpar, Segway and Electric skateboards among others. But every option here had their disadvantages such as expensive, heavy, availability etc

Our Ideation
============

![Initial layout]({{ "/static/assets/img/pages/projects/iGlide/first_concept.jpg" | absolute_url }}  "Initial layout")

What is it?
-----------

-   A self balancing 2 wheeled transporter

-   Focusing on basic control algorithm for safe propulsion

-   Compactness and portability to some extent.

-   Provided with straps to carry around.

-   Design can be extended further to include variants of the same to meet different market needs and safety requirements.

Technical feasibility 
======================

The existing literature of *mobile inverted pendulum* was studied thoroughly ([1],[2]). It was concluded from this study that though the dynamics of the system is nonlinear, linear approximation works very well in a sufficiently large range.

The dynamics of the system was modelled using Newton’s laws and linearised to arrive at the following state space model.

**States:** 
{% raw %}
$$
\textbf{x}=\begin{bmatrix}
y(t)\\ 
y'(t)\\
\theta(t)\\
\theta'(t)
\end{bmatrix}
$$
{% endraw %}
**Dynamics matrix:** 
{% raw %}
\$\$
\textbf{A}=\left(
\begin{array}{cccc}
 0 & 1 & 0 & 0 \\\
 0 & \frac{2 \text{Ke} \text{Km} \left(-\text{Mb} L^2+\text{Mb}
   \text{Rw} L-\text{Jb}\right)}{R \left(2 \text{Mb}
   \left(\frac{\text{Jw}}{\text{Rw}^2}+\text{Mw}\right)
   L^2+\text{Jb} \left(\frac{2 \text{Jw}}{\text{Rw}^2}+\text{Mb}+2
   \text{Mw}\right)\right) \text{Rw}^2} & \frac{g L^2 \text{Mb}}{2
   \text{Mb} \left(\frac{\text{Jw}}{\text{Rw}^2}+\text{Mw}\right)
   L^2+\text{Jb} \left(\frac{2 \text{Jw}}{\text{Rw}^2}+\text{Mb}+2
   \text{Mw}\right)} & 0 \\\
 0 & 0 & 0 & 1 \\\
 0 & \frac{2 \text{Ke} \text{Km} \left(\left(\frac{2
   \text{Jw}}{\text{Rw}^2}+\text{Mb}+2 \text{Mw}\right)
   \text{Rw}-L \text{Mb}\right)}{R \left(2 \text{Mb}
   \left(\frac{\text{Jw}}{\text{Rw}^2}+\text{Mw}\right)
   L^2+\text{Jb} \left(\frac{2 \text{Jw}}{\text{Rw}^2}+\text{Mb}+2
   \text{Mw}\right)\right) \text{Rw}^2} & \frac{g L \text{Mb}
   \left(\frac{2 \text{Jw}}{\text{Rw}^2}+\text{Mb}+2
   \text{Mw}\right)}{2 \text{Mb}
   \left(\frac{\text{Jw}}{\text{Rw}^2}+\text{Mw}\right)
   L^2+\text{Jb} \left(\frac{2 \text{Jw}}{\text{Rw}^2}+\text{Mb}+2
   \text{Mw}\right)} & 0 \\\
\end{array}
\right)
\$\$
{% endraw %}
**Input coupling matrix:** 
{% raw %}
\$\$
\textbf{B}=\left(
\begin{array}{c}
 0 \\\
 \frac{2 \text{Km} \left(\text{Mb} L^2-\text{Mb} \text{Rw}
   L+\text{Jb}\right)}{R \left(2 \text{Mb}
   \left(\frac{\text{Jw}}{\text{Rw}^2}+\text{Mw}\right)
   L^2+\text{Jb} \left(\frac{2 \text{Jw}}{\text{Rw}^2}+\text{Mb}+2
   \text{Mw}\right)\right) \text{Rw}} \\\
 0 \\
 \frac{2 \text{Km} \left(L \text{Mb}-\left(\frac{2
   \text{Jw}}{\text{Rw}^2}+\text{Mb}+2 \text{Mw}\right)
   \text{Rw}\right)}{R \left(2 \text{Mb}
   \left(\frac{\text{Jw}}{\text{Rw}^2}+\text{Mw}\right)
   L^2+\text{Jb} \left(\frac{2 \text{Jw}}{\text{Rw}^2}+\text{Mb}+2
   \text{Mw}\right)\right) \text{Rw}} \\\
\end{array}
\right)
\$\$
{% endraw %}
**Input:**
{% raw %}
\$\$
u= V(t)
\$\$
{% endraw %}
**State space equation:** 
{% raw %}
\$\$
\textbf{x}'(t)=\textbf{A}\textbf{x}(t) + \textbf{B}u(t)
\$\$
{% endraw %}


|Symbol| Meaning|
|:-----|---:----|
|Mb| Mass of the pendulum|
|Mw| Mass of the wheels|
|Ke,Km| Motor constants|
|R| Motor armature resistance|
|Rw| Radius of wheels}|
|L| Height of the pendulum (person)|
|Jb| Moment of inertia of the person about their center of mass|
|Jw| Moment of inertia of wheels|
|g| Acceleration due to gravity|
|V(t)| Control voltage|


Manufacturing
=============

layout
------

![layout of components on the board]({{ "/static/assets/img/pages/projects/iGlide/layout_1.png" | absolute_url}} "layout of components on the board")

Design Parameters
-----------------

-   To maintain a low centre of gravity all the components were placed on the bottom

-   Components should not hit ground as than balancing and therefore controlling would be difficult plus damages to product

-   The centre of gravity could not lowered to an extent that there would be difficulties placing the components below.

![Our final CAD model]({{ "/static/assets/img/pages/projects/iGlide/cad_1.png" | absolute_url}} "Final CAD model")

Initial assembly
----------------

The assembly consisted of three major parts - *Motor and wheel, axle and platform*. The idea was to check for part availability in the market and than start with actual manufacturing.

1.  Wheels used here (*fig. 4*) are electric scooter wheels

2.  A safety factor of 1.75 was considered while designing the axles

3.  We faced a lot of issues with these mounts and hence we changed them with bushes

![Wheel assembly with sprockets]({{ "/static/assets/img/pages/projects/iGlide/wheel_des_1.png" | absolute_url}} "Wheel assembly with sprockets")

![Axle CAD model]({{ "/static/assets/img/pages/projects/iGlide/axle_1.jpg" | absolute_url}} "Axle CAD model")

![Wheel-sprocket mounts]({{ "/static/assets/img/pages/projects/iGlide/sprocket_des_1.png" | absolute_url}} "Wheel-sprocket mounts")



| Parts | Symbol | Dimensions | Weight|
|:------|:----|:------|:---|
Wheels | \(D\) | 25cm | 2 kg|
Deck | \(L\) x W x H | 80cm x 35cm x 2cm | 2.25 kg|
Motors | \(d1\) | 10cm | 4 kg|
Battery | \(L1 X W1\) | 15cm X 6cm | 2.2 kg|
sprocket diameter | \(D2\) | 12.5cm|
pitch of the chain |\( p\) | 8mm | 0.7 kg|
chain length | \((30)*p\) | 24cm | NA|
distance between tires | \(a\) | 40cm | 4.7 kg (axle+sprocket+wheel)|

Also it was seen that, the weight distribution is uniform.

Electronics
===========

Electronics part of I-glide consists of basic modules:

1.  Sensing module: It consists of following parts: Razor IMU (SEN-10736 RoHS), FTDI Basic Breakout – 3.3V (DEV-09873 RoHS)

2.  Actuator module: It consists of following parts: 2X 2500 RPM motor, 2X 12V Lead-acid batteries, 2X DC motor drivers

3.  Processing module: It consists of following parts: Arduino UNO.

4.  Electrical assembly: It consists of general electrical components like 10, 15, 20A fuse, 10V and 24V switches, LEDs, Prototype board.

**Circuit Schematic:**

![Circuit]({{ "/static/assets/img/pages/projects/iGlide/circuit1.png" | absolute_url}} "Circuit")

Code and Algorithm
------------------

For the first implementation PID controller for pitch angle was used. The code is as follows:

```c++
    
    #include <SoftwareSerial.h> 
    /* To support serial communication with 
    2 devices simultaneously*/

    SoftwareSerial mySerial(12, 11); 
    /* RX, TX  Set the softSerial port */
    
    /*working variables of the pid*/
    unsigned long lastTime=0; 
    double Input=0, Output=0, Setpoint=0;
    double ITerm=0, lastInput=0;
    double kp, ki, kd,KP=0.005,KI=0,KD=0; 
    int pwm=0;
    const double slope=10.625; /* to scale the Output
     in Voltage to appropriate PWM signal*/
    const int DirPin=4;
    const int M1pwmPin=3,M2pwmPin=9;
    int SampleTime=250; //.250 sec
    
    
      
    void SetTunings(double Kp, double Ki, double Kd) 
    // Function to find gains for the discrete system
    {
      double SampleTimeInSec = ((double)SampleTime)/1000;
       kp = Kp;
       ki = Ki*SampleTimeInSec;
       kd = Kd/SampleTimeInSec;
    }
    
     //Function to read the pitch angle value from IMU 
    double ReadPitch() 
    {
     mySerial.print("#f");
      while(mySerial.available()<12){};
      
       byte yaw[4];
       byte pitch[4];
       byte roll[4]; 
       float y,p,r;
       int i;
       for(i=0;i<=3;i++)
       {
         yaw[i]=mySerial.read();
         
       }
        for(int i=0;i<=3;i++)
       {
         pitch[i]=mySerial.read();
       }
        for(int i=0;i<=3;i++)
       {
         roll[i]=mySerial.read();
       }
      y=*(float *)&yaw;
      p=*(float *)&pitch;
      r=*(float *)&roll;
     return(r);
      
    }
    
    
    
    
    
    void setup() // Main Setup
    {
       // Open serial communications and wait for port to open:
      Serial.begin(9600);
    
      // set the data rate for the SoftwareSerial port
      mySerial.begin(9600);
      pinMode(DirPin,OUTPUT); //Declare digital output
    }
    
    void loop() // Main loop
    {
      double error;
      Input= ReadPitch();
      error= Setpoint - Input;
     
      while(error<=-10||error>=10) // Loop for soft start
      { Input= ReadPitch();
      error= Setpoint - Input;
      }
      
     
      SetTunings(KP,KI,KD);
      lastTime=0;
      pwm=0;
     
      while(1) //Main control loop
      {
      Input= ReadPitch();
      error= Setpoint - Input;
       
      unsigned long now = millis(); // present timestamp
      double timeChange = (double)(now - lastTime); // timechange
      
      if(timeChange>=SampleTime)
      {
        /*Compute all the working error variables*/
       /*do only for pitch*/
       ITerm += (ki * error);
       double dInput = (Input - lastInput);
      
       /*Compute PID Output*/
       Output = kp * error + ITerm - kd * dInput;
      
       /*Remember some variables for next time*/
       lastInput = Input;
       lastTime = now;
      }
      
      /* Convert the Output into a signal which 
      can be given to pwm */
     if(Output>=0)
    {
      pwm= int(slope*(Output));
      analogWrite(M1pwmPin,pwm);
      analogWrite(M2pwmPin,pwm);
      digitalWrite(DirPin,HIGH);
    } 
    else
    {
      pwm= int(slope*(-Output));
      analogWrite(M1pwmPin,pwm);
      analogWrite(M2pwmPin,pwm);
      digitalWrite(DirPin,LOW);
    }
      
      if(pwm>100) // safety cutoff
      {
        break;
      }
      
      }
    }
    
```

The filter and communication code on the controller on the IMU is quite complicated and hence given in Appendix-1 for the sake of completeness.

Challenges faced
--------------

1.  Serial communication problem: Razor IMU firmware was designed to give continuous streaming output, while arduino couldn’t handle this continuous stream. For this purpose, we needed to change the firmware a bit and write a separate module for communication. Finally everything synced together!

2.  Connectors: This is the usual problem of any circuit, connection breaking in between or loose connection. To solve this, we used sealing gun.

3.  Motor Driver: This problem was caused because of high initial current requirement of dc motor. Even after putting fuse, we lost 4 of our working motor drivers. We couldn’t fix this problem. For this purpose, total of 4 types of drivers were tried, but none of them worked successfully. The best way to overcome this problem would be to build our own motor driver based on H-bridge circuit.

Appendix
========

1. **Mathematica code to obtain closed loop system**

	Can be found in the [appendix]({{ "/static/assets/img/pages/projects/iGlide/I_glide.pdf" | absolute_url}}) or the pdf report.

2. **Code added for simulation and visualization**

	Can be found in the [appendix]({{ "/static/assets/img/pages/projects/iGlide/I_glide.pdf" | absolute_url}}) or the pdf report.

3. **Physical parameters of the system**


    |Mw|Mass of the wheels|4|
    |:--|:-----------------|:--|
    |Mb|Mass of the pendulum|120|
    |Ke|Motor constant|0.083|
    |Km|Motor constant|0.069|
    |R|Motor armature resistance|1|
    |Rw|Radius of wheels|0.2|
    |L|Height of the pendulum (person)|1.8|
    |Jb|Moment of inertia of the person about their center of mass|60|
    |Jw|Moment of inertia of wheels|0.07|
    |g|Acceleration due to gravity|9.8|

Contributors
==============
### 1. [Rohan Chavan](https://www.linkedin.com/in/chavanrohan/)
### 2. [Piyush Jadav](https://www.linkedin.com/in/piyush-d-jadhav-438a1a64/)
### 3. [Shambhuraj Sawant](https://www.linkedin.com/in/shambhuraj-sawant-70123956/)
### 4. [Dhruvesh Patel]({{"/" | absolute_url}})

References
============

1.  Grasser, Felix, et al. “JOE: a mobile, inverted pendulum.” Industrial Electronics, IEEE Transactions on 49.1 (2002): 107-114.

2.  Thao, Nguyen Gia Minh, Duong Hoai Nghia, and Nguyen Huu Phuc. “A PID backstepping controller for two-wheeled self-balancing robot.” Strategic Technology (IFOST), 2010 International Forum on. IEEE, 2010.

3.  https://www.sparkfun.com/products/10736

4.  https://www.sparkfun.com/products/9873

5.  http://arduino.cc/en/Main/ArduinoBoardUno


