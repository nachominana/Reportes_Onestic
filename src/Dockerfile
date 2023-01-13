FROM node

COPY ./main.js ./
COPY ./customers.csv .
COPY ./orders.csv .
COPY ./products.csv .

RUN node main.js customers.csv orders.csv products.csv
