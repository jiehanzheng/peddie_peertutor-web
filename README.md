Peddie Peer Tutor Lookup System
===============================

This is an AngularJS front-end to [peddie_peertutor-java](https://github.com/jiehanzheng/peddie_peertutor-java).  While it is true that everything the Java backend program does can be easily accomplished by AngularJS code as well, we created this infrastructure to provide students in computer science classes at Peddie an opportunity to work on real-life projects with only Java.

Usage
-------------------

The code is to be run entirely on the client side.  All you need is a web server like Nginx.

You need to use Nginx as a reverse proxy to the backend Java service so that people on the Internet can access it.  The set up should be very easy, and here is an example taken from our live site:

```nginx
server {
  server_name tutoring.peddie.hosting.jiehan.org peer-tutor.peddie.org;
  listen 80;

  root /home/webapp/peddie_peertutor/web;

  location /api/ {
    proxy_pass http://127.0.0.1:12130;
  }
}
```
