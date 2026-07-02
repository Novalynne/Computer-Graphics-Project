# Shadow Mapping in WebGL

## Overview

This project is a real-time **Shadow Mapping** demonstration developed in **WebGL**, using **Three.js** as a supporting library for scene management, model loading, camera controls, and rendering utilities.

The objective of the project is to implement and compare different shadow mapping techniques while providing an interactive environment where users can experiment with the various parameters affecting shadow quality.

---

## Scene Description

The scene consists of an **isometric room** illuminated by two different light sources:

- **Directional Light** – the main light used to generate shadows.
- **Point Light** – provides additional illumination to the scene.

Both lights can be moved in real time through the user interface, allowing users to observe how the shadows change according to the light position.

The camera can be freely controlled with the mouse to inspect the scene from different angles.

---

## Features

- Real-time **Shadow Mapping** implementation.
- Three selectable shadow mapping techniques:
    - **Basic Shadow Mapping**
    - **Percentage Closer Filtering (PCF)**
    - **Variance Shadow Mapping (VSM)**
- Adjustable **shadow bias** to reduce common shadow mapping artifacts such as shadow acne.
- Real-time control over the position of both light sources, and helpers.
- Mouse-controlled camera navigation.
- Toggle option to visualize the generated **shadow map**.

---

## Technologies

- **WebGL** for graphics rendering.
- **Three.js** as a supplementary library for:
    - Scene creation
    - Model loading
    - Camera controls
    - Window resizing
- **Custom shaders** for implementing the shadow mapping algorithms.

---

## Project Structure

```
project/scr/
│
├── index.html          # Entry point of the application
├── main.js             # Initializes the application
│
├── scene.js            # Creates the renderer, scene and camera
├── lights.js           # Creates and configures the directional and point lights
├── models.js           # Loads the room model and creates the cube
├── ui.js               # Builds the graphical interface and UI callbacks
├── state.js            # Stores all UI variables and application state
│
├── shaders/            # Contains the vertex and fragment shaders for each shadow mapping technique
│
project/public/
│
├── models/             # Contains the room model and textures
```

---

## Controls

| Control              | Description                                         |
|----------------------|-----------------------------------------------------|
| **Mouse**            | Rotate, pan and zoom the camera.                    |
| **Directional Light** | Move the directional light in real time.            |
| **Point Light**      | Move the point light in real time.                  |
| **Shadow Mapping**   | Switch between Basic, PCF and VSM.                  |
| **Shadow Bias**      | Modify the bias value to reduce shadow artifacts.   |
| **Shadow Map Toggle** | Display or hide the generated shadow map.           |
| **Helper Toggle**    | Display or hide the helpers for both light sources. |
---

## Shadow Mapping Techniques

### Basic Shadow Mapping
The standard depth comparison technique. It is computationally inexpensive but often produces noticeable aliasing along shadow edges.

### Percentage Closer Filtering (PCF)
Performs multiple depth comparisons around the current texel and averages the results, producing smoother shadow boundaries.

### Variance Shadow Mapping (VSM)
Stores the first and second moments of depth instead of only the depth value. This allows shadows to be filtered using the variance and Chebyshev's inequality, resulting in soft shadow edges and improved filtering performance.

---

## Running the Project

Install the dependencies:

```bash
cd Computer_Graphics_Project
npm install
```

Start the development server:

```bash
cd Computer_Graphics_Project
npm run dev
```

Then open the local address provided by Vite in your browser.

---

## Purpose

This project was developed to study and compare different real-time shadow mapping techniques in WebGL. It provides an interactive environment for experimenting with lighting configurations, shadow algorithms, and rendering parameters while visualizing the resulting shadow maps.