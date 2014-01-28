Peddie Peer Tutor Lookup System
===============================

This is an AngularJS front-end to [peddie_peertutor-java](https://github.com/jiehanzheng/peddie_peertutor-java).  While it is true that everything the Java backend program does can be easily accomplished by AngularJS code as well, we created this infrastructure to provide students in computer science classes at Peddie an opportunity to work on real-life projects with only Java.

Usage
-----

Install dependencies:

```bash
bower install
```

Tutor pictures are not version controlled.  Put them in `images/tutors/` before use--the Java program will check that location for images.

The code is to be run entirely on the client side.  All you need is a web server like Nginx to serve it.  You also need to use Nginx as a reverse proxy to the backend Java service so that people on the Internet can access it.  The Nginx config should be very easy to write, and here is an example taken from our live site:

```nginx
server {
  server_name peer-tutor.peddie.org;
  listen 80;

  root /home/webapp/peddie_peertutor/web;

  location /api/ {
    proxy_pass http://127.0.0.1:12130;
  }
}
```
