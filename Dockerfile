FROM node
COPY package.json /app/
COPY bower.json /app/
WORKDIR /app/
RUN npm install --production
RUN ./node_modules/.bin/bower install --allow-root
COPY . /app/
ENV PORT=80
ENV apiUrl=http://api.wejay.org
EXPOSE 80
CMD npm start 