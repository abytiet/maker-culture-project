#include <Mouse.h>

#include <Arduino_LSM6DS3.h>
/*
  Arduino LSM6DS3 - Accelerometer Application

  This example reads the acceleration values as relative direction and degrees,
  from the LSM6DS3 sensor and prints them to the Serial Monitor or Serial Plotter.

  The circuit:
  - Arduino Nano 33 IoT

  Created by Riccardo Rizzo

  Modified by Jose García
  27 Nov 2020

  This example code is in the public domain.
  
  Modified by Aby Tiet
  6 April 2022
*/



// Initialize Coordinates
float x, y, z;
int lastY = 0;

void setup() {
  Mouse.begin();
  Serial.begin(9600);
  while (!Serial);
  Serial.println("Started");

  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");
    while (1);
  }


  Serial.print("Accelerometer sample rate = ");
  Serial.print(IMU.accelerationSampleRate());
  Serial.println("Hz");
}

void loop() {
  // Read acceleration
  if (IMU.accelerationAvailable()) {
    IMU.readAcceleration(x, y, z);
    if(y-lastY > 1) {
      Serial.print("Mouse Click! \t");
      Mouse.click();
    } 
    lastY = y;
  }
}
