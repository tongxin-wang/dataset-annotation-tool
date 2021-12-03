<template>
  <div class="home">
    <v-container class="my-5 d-flex flex-column justify-center">
      <div>
        <v-row>
          <v-chip color="accent" class="ml-3" text-color="white">
            <v-avatar right class="blue mr-1 ml-0"> 10 </v-avatar>
            images waiting to be checked
          </v-chip>
        </v-row>

        <v-row>
          <v-col cols="6">
            <v-img :src="imgUrl"></v-img>
          </v-col>
          <v-col cols="6">
            <v-textarea
              v-for="(cap, index) in captions"
              :key="index"
              filled
              auto-grow
              :label="'Caption ' + (index + 1)"
              rows="2"
              :value="cap"
            ></v-textarea>
            <v-btn depressed class="ma-2" color="primary" @click="sendMessage"> Send Message </v-btn>
            <v-btn depressed class="ma-2 float-right" color="primary">
              Next
            </v-btn>
          </v-col>
        </v-row>

        <!-- <div class="text-center pb-0" v-show="dataRequested">
          <v-pagination
            v-model="page"
            :length="idNum"
            circle
            color="primary"
          ></v-pagination>
        </div>

        <v-snackbar v-model="saveSnackbar" top color="success" timeout="2000">
          {{ retInfo }}

          <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="saveSnackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>

        <v-snackbar v-model="dataSnackbar" top timeout="2000">
          No data!
          <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="dataSnackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar> -->
      </div>
    </v-container>
  </div>
</template>

<script>
import { io } from "socket.io-client";

export default {
  data: () => ({
    imgUrl: "https://images.unsplash.com/photo-1612334001559-947862cc2202",
    captions: [
      "Sentence one",
      "Sentence two",
      "Sentence three",
      "Sentence four",
      "Sentence five",
    ],
    wsUrl: "ws://localhost:5000/wsdemo",
    socket: {},
  }),
  created: function() {
    this.initWebsocket();
  },
  methods: {
    initWebsocket: function() {
      this.socket = io(this.wsUrl);
      this.socket.on("connect", () => {
        console.log("Connected to server.");
      });
      this.socket.on("disconnect", () => {
        console.log("Disconnected to server.");
      });
      this.socket.on("connect_error", () => {
        setTimeout(() => {
          this.socket.connect();
        }, 1000);
      });
      this.socket.on("chat", (msg) => {
        console.log(msg);
      });
    },
    sendMessage: function() {
      this.socket.emit('chat', 'This is a test message. Random number: ' + Math.random() * 10)
    },
  },
};
</script>
