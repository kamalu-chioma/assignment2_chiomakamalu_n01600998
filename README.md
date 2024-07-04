# Project Overview

This project includes an Express.js application that handles image uploads and displays them in a gallery. 

## Key Functionalities

- **Image Upload Directory**: The application stores uploaded images in a directory named `uploads` located in the same directory as the application.

- **Image Upload Handling**: The application checks the `uploads` directory for any images. If no images are found, it returns a `503` status code with a message indicating that no images are available.

- **Image Gallery Viewing**: The application provides an endpoint (`/gallery`) that renders a page titled "Image Gallery". This page is intended to display the images stored in the `uploads` directory.

- **Pagination Support for Fetching Images**: The application supports fetching images with pagination through the endpoint `/fetch-all-pagination/pages/:page`. This endpoint is designed to handle paginated requests for images stored in the `uploads` directory. However, the provided excerpt does not include the implementation details for pagination logic.

## Technical Details

- **Technology Stack**: The application is built with Express.js and uses the `fs` module to interact with the file system for reading the contents of the `uploads` directory.
