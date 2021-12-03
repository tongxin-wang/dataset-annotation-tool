<template>
  <div class="home">
    <v-container class="my-5 d-flex flex-column justify-center">
      <div>
        <v-row>
          <v-chip color="accent" class="ml-3" text-color="white">
            <v-avatar right class="blue mr-1 ml-0"> 999 </v-avatar>
            images left
          </v-chip>
        </v-row>

        <v-row>
          <v-col cols="6">
            <!-- <canvas
              id="canvas"
              width="400px"
              height="300px"
              style="border: 1px solid #000000"
            ></canvas> -->
            <!-- <canvas
              id="canvas"
            ></canvas> -->
            <!-- <v-img id="oriImg" :src="imgUrl">
              <canvas id="canvas"></canvas>
            </v-img> -->
            <canvas id="canvas"></canvas>
            <v-list rounded class="grey lighten-4 mt-2" id="caption-list">
              <v-subheader>Captions</v-subheader>
              <v-list-item-group v-model="capSelected" color="primary">
                <v-list-item v-for="(cap, i) in captions" :key="i">
                  <v-list-item-content>
                    <v-list-item-title v-text="cap"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>

          <v-col cols="6">
            <v-row>
              <v-textarea
                filled
                auto-grow
                :label="'Original Caption ' + (capSelected + 1)"
                rows="2"
                disabled
                :value="captions[capSelected]"
              ></v-textarea>
            </v-row>
            <v-row>
              <v-textarea
                filled
                auto-grow
                :label="'Modified Caption ' + (capSelected + 1)"
                rows="2"
                :value="modifiedCaptions[capSelected]"
              ></v-textarea>
            </v-row>
            <v-row>
              <v-chip
                v-for="(token, i) in txtTokens"
                :key="i"
                link
                class="ma-1"
              >
                {{ token }}
              </v-chip>
            </v-row>
            <v-row>
              <v-col cols="8">
                <!-- <v-list rounded class="grey lighten-4 mt-2" id="caption-list">
                  <v-subheader>Captions</v-subheader>
                  <v-list-item-group v-model="capSelected" color="primary">
                    <v-list-item v-for="(cap, i) in captions" :key="i">
                      <v-list-item-content>
                        <v-list-item-title v-text="cap"></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list> -->
                <v-select
                  v-model="errorSelected[capSelected]"
                  :items="errorItems"
                  filled
                  label="Error type"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-checkbox
                  v-model="completedStatus[capSelected]"
                  label="Completed"
                  color="success"
                  value="success"
                  hide-details
                ></v-checkbox>
              </v-col>
            </v-row>
            <v-row>
              <v-btn depressed class="ma-2" color="primary"> Save </v-btn>
              <v-spacer></v-spacer>
              <v-btn depressed class="ma-2" color="primary"> Next </v-btn>
              <v-btn
                depressed
                class="ma-2"
                color="primary"
                @click="changeImage"
              >
                Change Image
              </v-btn>
              <v-btn depressed class="ma-2" color="primary" @click="draw">
                Draw
              </v-btn>
              <v-btn depressed class="ma-2" color="primary" @click="clearRect">
                Clear Rect
              </v-btn>
            </v-row>
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
import axios from 'axios'
import path from 'path'

export default {
  data: () => ({
    errorItems: [
      'Entity error',
      'Attribute error(Modifier)',
      'Attribute error(Action)',
      'Attribute error(Position)'
    ],
    errorSelected: [
      'Entity error',
      'Entity error',
      'Entity error',
      'Entity error',
      'Entity error'
    ],
    completedStatus: [false, false, false, false, false],
    data: {},
    idList: [],
    idNum: 1,
    page: 1,
    getLoading: false,
    saveLoading: false,
    baseUrl: 'http://localhost:5000',
    dataRequested: false,
    records: [],
    saveSnackbar: false,
    dataSnackbar: false,
    retInfo: '',
    imgUrl: '',
    captions: [
      'A man with a red helmet on a small moped on a dirt road .',
      'Man riding a motor bike on a dirt road on the countryside .',
      'A man riding on the back of a motorcycle .',
      'A dirt path with a young person on a motor bike rests to the foreground of a verdant area with a bridge and a background of cloud-wreathed mountains .',
      'A man in a red shirt and a red hat is on a motorcycle on a hill side .'
    ],
    modifiedCaptions: [
      'A man with a red helmet on a small moped on a dirt road .',
      'Man riding a motor bike on a dirt road on the countryside .',
      'A man riding on the back of a motorcycle .',
      'A dirt path with a young person on a motor bike rests to the foreground of a verdant area with a bridge and a background of cloud-wreathed mountains .',
      'A man in a red shirt and a red hat is on a motorcycle on a hill side .'
    ],
    capSelected: 0,
    imgWidth: 0,
    imgHeight: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    img: new Image(),
    mouseDown: false,
    bbxTopLeftPoint: {},
    bbxBottomRightPoint: {},
    bbxes: []
  }),
  watch: {
    canvasWidth: function () {
      this.canvasHeight = (this.canvasWidth / this.imgWidth) * this.imgHeight
      let canvas = document.getElementById('canvas')
      let ctx = canvas.getContext('2d')
      canvas.width = this.canvasWidth
      canvas.height = this.canvasHeight
      ctx.drawImage(this.img, 0, 0, this.canvasWidth, this.canvasHeight)
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 1
      ctx.strokeRect(
        this.bbxTopLeftPoint.relativeX * canvas.width,
        this.bbxTopLeftPoint.relativeY * canvas.height,
        this.bbxBottomRightPoint.relativeX * canvas.width -
          this.bbxTopLeftPoint.relativeX * canvas.width,
        this.bbxBottomRightPoint.relativeY * canvas.height -
          this.bbxTopLeftPoint.relativeY * canvas.height
      )
    },
    bbxBottomRightPoint: function () {
      let canvas = document.getElementById('canvas')
      let ctx = canvas.getContext('2d')
      ctx.drawImage(this.img, 0, 0, this.canvasWidth, this.canvasHeight)
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 1
      ctx.strokeRect(
        this.bbxTopLeftPoint.relativeX * canvas.width,
        this.bbxTopLeftPoint.relativeY * canvas.height,
        this.bbxBottomRightPoint.relativeX * canvas.width -
          this.bbxTopLeftPoint.relativeX * canvas.width,
        this.bbxBottomRightPoint.relativeY * canvas.height -
          this.bbxTopLeftPoint.relativeY * canvas.height
      )
    },
    imgUrl: function () {
      // console.log('Image url changed')
      let canvas = document.getElementById('canvas')
      let ctx = canvas.getContext('2d')
      let newImg = new Image()
      let that = this
      newImg.onload = function () {
        that.imgWidth = this.width
        that.imgHeight = this.height
        that.canvasHeight = (that.canvasWidth / this.width) * this.height
        canvas.width = that.canvasWidth
        canvas.height = that.canvasHeight
        that.img = this
        ctx.drawImage(this, 0, 0, that.canvasWidth, that.canvasHeight)
      }
      newImg.src = this.imgUrl
    }
  },
  computed: {
    pageIndex: function () {
      return this.page - 1
    },
    queryImages: function () {
      if (Object.keys(this.data).length === 0) {
        return []
      } else {
        return this.data[this.idList[this.pageIndex]]['query_images']
      }
    },
    galleryImages: function () {
      if (Object.keys(this.data).length === 0) {
        return []
      } else {
        return this.data[this.idList[this.pageIndex]]['gallery_images']
      }
    },
    undoBtnDisabled: function () {
      if (this.dataRequested && this.idNum !== 0) {
        return this.records[this.pageIndex].length === 0
      }
      return true
    },
    saveBtnDisabled: function () {
      if (this.dataRequested && !this.saveLoading && this.idNum !== 0) {
        return this.records[this.pageIndex].length === 0
      }
      return true
    },
    txtTokens: function () {
      // console.log('modifiedCaptions changed')
      return this.modifiedCaptions[this.capSelected].split(' ')
    }
    // listenChange: function () {
    //   const { canvasWidth, bbxBottomRightPoint } = this
    //   return { canvasWidth, bbxBottomRightPoint }
    // }
  },
  mounted: function () {
    window.onresize = () => {
      return (() => {
        this.canvasWidth = document.getElementById('caption-list').clientWidth
      })()
    }
    this.canvasWidth = document.getElementById('caption-list').clientWidth
    this.imgUrl = 'https://z3.ax1x.com/2021/08/16/fRVqLn.jpg'

    let getMousePos = function (canvas, event) {
      let rect = canvas.getBoundingClientRect()
      let x = event.clientX - rect.left * (canvas.width / rect.width)
      let y = event.clientY - rect.top * (canvas.height / rect.height)
      let relativeX = x / canvas.width
      let relativeY = y / canvas.height
      return { relativeX, relativeY }
    }

    let that = this

    let canvas = document.getElementById('canvas')
    canvas.addEventListener('mousedown', function (event) {
      that.bbxTopLeftPoint = getMousePos(canvas, event)
      that.mouseDown = true
    })

    canvas.addEventListener('mousemove', function (event) {
      let currentMousePos = getMousePos(canvas, event)
      if (
        that.mouseDown &&
        currentMousePos.relativeX * canvas.width >
          that.bbxTopLeftPoint.relativeX * canvas.width &&
        currentMousePos.relativeY * canvas.height >
          that.bbxTopLeftPoint.relativeY * canvas.height
      ) {
        that.bbxBottomRightPoint = currentMousePos
      }
    })

    canvas.addEventListener('mouseup', function (event) {
      that.mouseDown = false
      let currentMousePos = getMousePos(canvas, event)
      if (
        currentMousePos.relativeX * canvas.width >
          that.bbxTopLeftPoint.relativeX * canvas.width &&
        currentMousePos.relativeY * canvas.height >
          that.bbxTopLeftPoint.relativeY * canvas.height
      ) {
        that.bbxBottomRightPoint = currentMousePos
      }
    })
  },
  methods: {
    getData: function () {
      this.getLoading = true
      axios.get(this.baseUrl + '/data?num=' + this.numSelected).then(
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
      )
    },
    deleteImage: function (img) {
      let index =
        this.data[this.idList[this.pageIndex]]['gallery_images'].indexOf(img)
      delete this.data[this.idList[this.pageIndex]]['gallery_images'][index]
      let record = {}
      record['id'] = this.idList[this.pageIndex]
      record['index'] = index
      record['image'] = img
      this.records[this.pageIndex].push(record) //保存删除操作记录
      this.$forceUpdate()
    },
    undo: function () {
      let record = this.records[this.pageIndex].pop()
      this.data[record['id']]['gallery_images'][record['index']] =
        record['image']
      this.$forceUpdate()
    },
    save: function () {
      let recordData = {}
      recordData['id'] = this.idList[this.pageIndex]
      recordData['delete_images'] = []
      this.records[this.pageIndex].forEach((record) =>
        recordData['delete_images'].push(record['image'])
      )
      this.saveLoading = true
      axios
        .post(this.baseUrl + '/save', recordData)
        .then(
          (response) => (
            (this.retInfo = response.data),
            (this.saveSnackbar = true),
            (this.saveLoading = false)
          )
        )
      this.records[this.pageIndex].splice(
        0,
        this.records[this.pageIndex].length
      ) //清空当前id记录
    },
    isMatched: function (img) {
      let flag = false
      if (
        img !== undefined &&
        path.basename(img).split('_')[1] == this.idList[this.pageIndex]
      ) {
        flag = true
      }
      return flag
    },
    changeImage: function () {
      this.imgUrl =
        'http://172.16.2.156:8000/dataset-nlvr2_small/dev-167-3-img0.png'
      this.bbxTopLeftPoint = {}
      this.bbxBottomRightPoint = {}
    },
    draw: function () {
      let ctx = document.getElementById('canvas').getContext('2d')
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 1
      ctx.strokeRect(10, 10, 100, 100)
    },
    clearRect: function () {
      this.bbxTopLeftPoint = {}
      this.bbxBottomRightPoint = {}
    }
  }
}
</script>
