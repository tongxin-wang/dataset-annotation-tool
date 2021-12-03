<template>
  <div class="home">
    <v-container class="my-5 d-flex flex-column justify-center">
      <div>
        <v-row>
          <v-chip
            color="accent"
            class="ml-3"
            text-color="white"
          >
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
            <v-btn depressed class="ma-2" color="primary"> Save </v-btn>
            <v-btn depressed class="ma-2 float-right" color="primary"> Next </v-btn>
          </v-col>
        </v-row>

        <div class="text-center pb-0" v-show="dataRequested">
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
        </v-snackbar>
      </div>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import path from "path";

export default {
  data: () => ({
    numItems: [10, 20, 30, 40],
    numSelected: 40,
    data: {},
    idList: [],
    idNum: 1,
    page: 1,
    getLoading: false,
    saveLoading: false,
    baseUrl: "http://localhost:5000",
    dataRequested: false,
    records: [],
    saveSnackbar: false,
    dataSnackbar: false,
    retInfo: "",
    imgUrl: "https://images.unsplash.com/photo-1612334001559-947862cc2202",
    captions: [
      "Sentence one",
      "Sentence two",
      "Sentence three",
      "Sentence four",
      "Sentence five",
    ],
  }),
  computed: {
    pageIndex: function () {
      return this.page - 1;
    },
    queryImages: function () {
      if (Object.keys(this.data).length === 0) {
        return [];
      } else {
        return this.data[this.idList[this.pageIndex]]["query_images"];
      }
    },
    galleryImages: function () {
      if (Object.keys(this.data).length === 0) {
        return [];
      } else {
        return this.data[this.idList[this.pageIndex]]["gallery_images"];
      }
    },
    undoBtnDisabled: function () {
      if (this.dataRequested && this.idNum !== 0) {
        return this.records[this.pageIndex].length === 0;
      }
      return true;
    },
    saveBtnDisabled: function () {
      if (this.dataRequested && !this.saveLoading && this.idNum !== 0) {
        return this.records[this.pageIndex].length === 0;
      }
      return true;
    },
  },
  methods: {
    getData: function () {
      this.getLoading = true;
      axios.get(this.baseUrl + "/data?num=" + this.numSelected).then(
        (response) => (
          (this.dataSnackbar = response.data.id_num === 0),
          (this.page = 1),
          (this.data = response.data.data),
          (this.idNum = response.data.id_num),
          (this.idList = response.data.id_list),
          (this.records = Array(response.data.id_num)
            .fill(0)
            .map(() => [])),
          (this.dataRequested = true),
          (this.getLoading = false)
        )
      );
    },
    deleteImage: function (img) {
      let index =
        this.data[this.idList[this.pageIndex]]["gallery_images"].indexOf(img);
      delete this.data[this.idList[this.pageIndex]]["gallery_images"][index];
      let record = {};
      record["id"] = this.idList[this.pageIndex];
      record["index"] = index;
      record["image"] = img;
      this.records[this.pageIndex].push(record); //保存删除操作记录
      this.$forceUpdate();
    },
    undo: function () {
      let record = this.records[this.pageIndex].pop();
      this.data[record["id"]]["gallery_images"][record["index"]] =
        record["image"];
      this.$forceUpdate();
    },
    save: function () {
      let recordData = {};
      recordData["id"] = this.idList[this.pageIndex];
      recordData["delete_images"] = [];
      this.records[this.pageIndex].forEach((record) =>
        recordData["delete_images"].push(record["image"])
      );
      this.saveLoading = true;
      axios
        .post(this.baseUrl + "/save", recordData)
        .then(
          (response) => (
            (this.retInfo = response.data),
            (this.saveSnackbar = true),
            (this.saveLoading = false)
          )
        );
      this.records[this.pageIndex].splice(
        0,
        this.records[this.pageIndex].length
      ); //清空当前id记录
    },
    isMatched: function (img) {
      let flag = false;
      if (
        img !== undefined &&
        path.basename(img).split("_")[1] == this.idList[this.pageIndex]
      ) {
        flag = true;
      }
      return flag;
    },
  },
};
</script>
