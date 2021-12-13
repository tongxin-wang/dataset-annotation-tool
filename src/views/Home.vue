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
              <v-list-item-group
                v-model="capSelected"
                mandatory
                color="primary"
              >
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
                disabled
                v-model="modifiedCaptions[capSelected]"
                @input="resetSelectedNegTokens(capSelected)"
              ></v-textarea>
            </v-row>
            <v-row>
              <div class="grey--text font-weight-light">Tokens</div>
            </v-row>
            <v-row>
              <template
                v-if="
                  tokensDetailInfo[capSelected].length === 0 ||
                  (selectedDetailInfo['capIndex'] === capSelected &&
                    selectedDetailInfo['tokenIndex'] === 0)
                "
              >
                <v-chip
                  outlined
                  color="green lighten-2"
                  class="mx-1 my-2"
                  style="user-select: text"
                  @click="showExtraDetailInfo"
                >
                Token
                  <v-icon small right>mdi-pencil-plus-outline</v-icon>
                </v-chip>
                <v-chip
                  v-show="
                    extraDetailInfo['selected'] &&
                    extraDetailInfo['capIndex'] === capSelected
                  "
                  class="mx-1 my-2"
                >
                  <v-text-field
                    v-model="extraDetailInfo['inputValue']"
                    :rules="inputTokenRules"
                    style="width: 50px"
                    @change="addTokenInFrontOfModifiedCap"
                  ></v-text-field>
                </v-chip>
              </template>
              <template
                v-for="(tokenDetail, i) in tokensDetailInfo[capSelected]"
              >
                <template v-if="tokenDetail['provideAlterWords']">
                  <template v-if="varIsUndefined(tokenDetail['tokenModifyTo'])">
                    <v-badge
                      :key="capSelected + '-' + i"
                      :value="
                        selectedDetailInfo['capIndex'] === capSelected &&
                        selectedDetailInfo['tokenIndex'] === i
                      "
                      class="mx-1 my-2"
                      color="grey lighten-4"
                      offset-y="9"
                      offset-x="10"
                      left
                      overlap
                    >
                      <template v-slot:badge>
                        <v-icon
                          small
                          color="red lighten-1"
                          style="cursor: pointer"
                          @click="deleteTokenFromModifiedCap(capSelected, i)"
                        >
                          mdi-close-circle-outline
                        </v-icon>
                      </template>
                      <v-chip
                        link
                        color="green lighten-2"
                        text-color="white"
                        style="user-select: text"
                        @click="showMoreDetailInfo(capSelected, i)"
                      >
                        {{ tokenDetail['token'] }}
                      </v-chip>
                    </v-badge>
                  </template>
                  <template v-else>
                    <v-badge
                      :key="capSelected + '-' + i"
                      :value="
                        selectedDetailInfo['capIndex'] == capSelected &&
                        selectedDetailInfo['tokenIndex'] == i
                      "
                      class="mx-1 my-2"
                      color="grey lighten-4"
                      offset-y="9"
                      offset-x="10"
                      left
                      overlap
                    >
                      <template v-slot:badge>
                        <v-icon
                          small
                          color="red lighten-1"
                          style="cursor: pointer"
                          @click="deleteTokenFromModifiedCap(capSelected, i)"
                        >
                          mdi-close-circle-outline
                        </v-icon>
                      </template>
                      <v-chip
                        outlined
                        style="
                          border-color: black;
                          border-width: 1px;
                          border-style: dashed;
                        "
                        @click="showMoreDetailInfo(capSelected, i)"
                      >
                        <v-chip
                          link
                          small
                          color="green lighten-2"
                          text-color="white"
                          style="user-select: text"
                        >
                          {{ tokenDetail['token'] }}
                        </v-chip>
                        <v-icon> mdi-arrow-right-thin </v-icon>
                        <v-chip
                          link
                          small
                          color="red lighten-1"
                          text-color="white"
                          style="user-select: text"
                        >
                          {{
                            tokenDetail['alterWords'][
                              tokenDetail['tokenModifyTo']
                            ]
                          }}
                        </v-chip>
                      </v-chip>
                    </v-badge>
                  </template>
                </template>
                <template v-else>
                  <v-badge
                    :key="capSelected + '-' + i"
                    :value="
                      selectedDetailInfo['capIndex'] == capSelected &&
                      selectedDetailInfo['tokenIndex'] == i
                    "
                    class="mx-1 my-2"
                    color="grey lighten-4"
                    offset-y="9"
                    offset-x="10"
                    left
                    overlap
                  >
                    <template v-slot:badge>
                      <v-icon
                        small
                        color="red lighten-1"
                        style="cursor: pointer"
                        @click="deleteTokenFromModifiedCap(capSelected, i)"
                      >
                        mdi-close-circle-outline
                      </v-icon>
                    </template>
                    <v-chip
                      link
                      style="user-select: text"
                      @click="showMoreDetailInfo(capSelected, i)"
                    >
                      {{ tokenDetail['token'] }}
                    </v-chip>
                  </v-badge>
                </template>
                <template
                  v-if="
                    !varIsUndefined(selectedDetailInfo['tokenIndex']) &&
                    selectedDetailInfo['capIndex'] == capSelected &&
                    selectedDetailInfo['tokenIndex'] == i
                  "
                >
                  <v-icon
                    v-show="!selectedDetailInfo['inputToken']"
                    :key="'icon' + capSelected + '-' + i"
                    small
                    @click="selectedDetailInfo['inputToken'] = true"
                    >mdi-plus-circle-outline</v-icon
                  >
                  <v-chip
                    v-show="selectedDetailInfo['inputToken']"
                    class="mx-1 my-2"
                    :key="'input' + capSelected + '-' + i"
                  >
                    <v-text-field
                      v-model="selectedDetailInfo['inputValue']"
                      :rules="inputTokenRules"
                      style="width: 50px"
                      @change="addTokenToModifiedCap"
                    ></v-text-field>
                  </v-chip>
                </template>
              </template>
            </v-row>

            <div
              v-if="
                !varIsUndefined(selectedDetailInfo['tokenIndex']) &&
                selectedDetailInfo['capIndex'] == capSelected &&
                tokensDetailInfo[selectedDetailInfo['capIndex']][
                  selectedDetailInfo['tokenIndex']
                ]['provideAlterWords']
              "
            >
              <v-row class="mt-1">
                <div class="grey--text font-weight-light">
                  Alternative Words of
                  <v-chip small outlined color="green lighten-2">{{
                    tokensDetailInfo[selectedDetailInfo['capIndex']][
                      selectedDetailInfo['tokenIndex']
                    ]['token']
                  }}</v-chip>
                </div>
              </v-row>
              <v-row>
                <v-chip
                  v-for="(word, i) in tokensDetailInfo[
                    selectedDetailInfo['capIndex']
                  ][selectedDetailInfo['tokenIndex']]['alterWords']"
                  :key="i"
                  class="ma-1"
                  :class="
                    tokensDetailInfo[selectedDetailInfo['capIndex']][
                      selectedDetailInfo['tokenIndex']
                    ]['tokenModifyTo'] === i
                      ? 'red--text'
                      : ''
                  "
                  :color="
                    tokensDetailInfo[selectedDetailInfo['capIndex']][
                      selectedDetailInfo['tokenIndex']
                    ]['tokenModifyTo'] === i
                      ? 'red lighten-4'
                      : ''
                  "
                  style="user-select: text"
                  @click="changeAlterWord(i)"
                >
                  {{ word }}
                </v-chip>
              </v-row>
            </div>

            <hr size="1" class="mt-3" style="border-style: dashed" />
            <v-row>
              <div class="grey--text font-weight-light mt-3">Error Type</div>
            </v-row>
            <v-row>
              <v-radio-group
                class="ma-0"
                v-model="errorSelected[capSelected]"
                row
              >
                <v-radio
                  v-for="(error, i) in errorItems"
                  :key="i"
                  :label="error"
                  :value="error"
                ></v-radio>
              </v-radio-group>
            </v-row>
            <v-row>
              <div class="grey--text font-weight-light">Completed State</div>
            </v-row>
            <v-row>
              <v-switch
                v-model="completedState[capSelected]"
                class="ma-0"
                inset
                :label="
                  completedState[capSelected] ? 'completed' : 'uncompleted'
                "
              ></v-switch>
            </v-row>
            <v-row>
              <v-btn depressed class="ma-2" color="primary"> Save </v-btn>
              <v-spacer></v-spacer>
              <v-btn depressed class="ma-2" color="primary"> Next </v-btn>
              <!-- <v-btn
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
              </v-btn> -->
            </v-row>
          </v-col>
        </v-row>

        <v-snackbar
          v-model="selectedDetailInfo['inputErrorSnackbar']"
          top
          right
          color="red lighten-1"
          transition="slide-x-reverse-transition"
        >
          {{ selectedDetailInfo['inputErrorMessage'] }}
          <template v-slot:action="{ attrs }">
            <v-btn
              text
              v-bind="attrs"
              @click="selectedDetailInfo['inputErrorSnackbar'] = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>

        <v-snackbar
          v-model="extraDetailInfo['inputErrorSnackbar']"
          top
          right
          color="red lighten-1"
          transition="slide-x-reverse-transition"
        >
          {{ extraDetailInfo['inputErrorMessage'] }}
          <template v-slot:action="{ attrs }">
            <v-btn
              text
              v-bind="attrs"
              @click="extraDetailInfo['inputErrorSnackbar'] = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>

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
    completedState: [false, false, false, false, false],
    data: {},
    idList: [],
    idNum: 1,
    page: 1,
    getLoading: false,
    saveLoading: false,
    baseUrl: 'http://172.16.2.156:8000/',
    dataRequested: false,
    records: [],
    saveSnackbar: false,
    dataSnackbar: false,
    retInfo: '',
    imgUrl: '',
    backUpCaptions: [
      '   It\'s @A man with a    red hel  met on a :small mo"ped on a dirt road .',
      'road .',
      'A man with a red helmet on a small moped on a dirt road .',
      'Man riding a motor bike on a dirt road on the countryside .',
      'A man riding on the back of a motorcycle .',
      'A dirt path with a young person on a motor bike rests to the foreground of a verdant area with a bridge and a background of cloud-wreathed mountains .',
      'A man in a red shirt and a red hat is on a motorcycle on a hill side .'
    ],
    captions: [
      'road .',
      'Man riding a motor bike on a dirt road on the countryside .',
      'A man riding on the back of a motorcycle .',
      'A dirt path with a young person on a motor bike rests to the foreground of a verdant area with a bridge and a background of cloud-wreathed mountains .',
      'A man in a red shirt and a red hat is on a motorcycle on a hill side .'
    ],
    capTokens: [null, null, null, null, null],
    modifiedCaptions: [
      'road .',
      'Man riding a motor bike on a dirt road on the countryside .',
      'A man riding on the back of a motorcycle .',
      'A dirt path with a young person on a motor bike rests to the foreground of a verdant area with a bridge and a background of cloud-wreathed mountains .',
      'A man in a red shirt and a red hat is on a motorcycle on a hill side .'
    ],
    negTokenIdxes: [[], [], [], [], []],
    capSelected: 0,
    imgWidth: 0,
    imgHeight: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    img: new Image(),
    mouseDown: false,
    bbxTopLeftPoint: {},
    bbxBottomRightPoint: {},
    bbxes: [],
    tokensDetailInfo: [[], [], [], [], []],
    selectedDetailInfo: {
      capIndex: undefined,
      tokenIndex: undefined,
      inputToken: false,
      inputValue: '',
      inputErrorSnackbar: false,
      inputErrorMessage: ''
    },
    extraDetailInfo: {
      capIndex: undefined,
      selected: false,
      inputValue: '',
      inputErrorSnackbar: false,
      inputErrorMessage: ''
    },
    inputTokenRules: [
      (value) => !!value || 'Required.',
      (value) => (value || '').indexOf(' ') < 0 || 'No spaces.'
    ]
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
    // txtTokens: function () {
    //   console.log(
    //     this.tokenizeSentence(this.modifiedCaptions[this.capSelected])
    //   )
    //   return typeof this.capSelected !== 'undefined' ? [] : []
    //   // return typeof this.capSelected !== 'undefined'
    //   //   ? this.tokenizeSentence(this.modifiedCaptions[this.capSelected])['tokens']
    //   //   : []
    // }
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

    //In fact, the code below should not be here, I will move it to correct position later.
    this.captions.forEach((cap, i) => {
      axios
        .get(this.baseUrl + 'tokenization?sentence=' + cap)
        .then((response) => {
          this.capTokens[i] = response.data['tokens']
        })
        .then(() => {
          this.tokensDetailInfo.push([])
          this.capTokens[i].forEach((token) => {
            let tokenDetail = {}
            tokenDetail['token'] = token
            tokenDetail['tokenModifyTo'] = undefined
            tokenDetail['provideAlterWords'] = false
            tokenDetail['alterWords'] = []
            this.tokensDetailInfo[i].push(tokenDetail)
          })
        })
        .then(() => {
          axios
            .get(this.baseUrl + 'similar-substantive-tokens?sentence=' + cap)
            .then((response) => {
              response.data['similar_tokens_info'].forEach((tokensInfo) => {
                this.tokensDetailInfo[i][tokensInfo['token_pos']][
                  'provideAlterWords'
                ] = true
                this.tokensDetailInfo[i][tokensInfo['token_pos']][
                  'alterWords'
                ] = tokensInfo['similar_tokens']
              })
            })
        })
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
    chooseNegToken: function (capSelected, negTokenIdx) {
      let idx = this.negTokenIdxes[capSelected].indexOf(negTokenIdx)
      if (idx > -1) {
        //delete existed choosed token item
        this.negTokenIdxes[capSelected].splice(idx, 1)
      } else {
        this.negTokenIdxes[capSelected].push(negTokenIdx)
      }
    },
    resetSelectedNegTokens: function (capSelected) {
      this.negTokenIdxes[capSelected].splice(
        0,
        this.negTokenIdxes[capSelected].length
      )
      // this.$forceUpdate()
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
    },
    varIsUndefined: function (v) {
      return typeof v === 'undefined'
    },
    showMoreDetailInfo: function (capIndex, tokenIndex) {
      // click a previously chosen token, select its state to unselected
      if (
        this.selectedDetailInfo['capIndex'] === capIndex &&
        this.selectedDetailInfo['tokenIndex'] === tokenIndex
      ) {
        if (tokenIndex === 0) {
          this.resetExtraDetailInfo()
        }
        this.selectedDetailInfo['capIndex'] = undefined
        this.selectedDetailInfo['tokenIndex'] = undefined
      } else {
        this.selectedDetailInfo['capIndex'] = capIndex
        this.selectedDetailInfo['tokenIndex'] = tokenIndex
      }
      this.resetSelectedDetailInfo(false)
    },
    showExtraDetailInfo: function () {
      if (this.extraDetailInfo['capIndex'] !== this.capSelected) {
        this.resetExtraDetailInfo()
        this.extraDetailInfo['capIndex'] = this.capSelected
        this.extraDetailInfo['selected'] = true
      } else {
        if (this.extraDetailInfo['selected']) {
          this.resetExtraDetailInfo()
        } else {
          this.extraDetailInfo['selected'] = true
        }
      }
    },
    changeAlterWord: function (alterIndex) {
      let capIndex = this.selectedDetailInfo['capIndex']
      let tokenIndex = this.selectedDetailInfo['tokenIndex']
      // click a previously chosen alternative word, select its state to unselected
      if (
        this.tokensDetailInfo[capIndex][tokenIndex]['tokenModifyTo'] ===
        alterIndex
      ) {
        this.updateModifiedCap(undefined)
        this.tokensDetailInfo[capIndex][tokenIndex]['tokenModifyTo'] = undefined
      } else {
        this.updateModifiedCap(alterIndex)
        this.tokensDetailInfo[capIndex][tokenIndex]['tokenModifyTo'] =
          alterIndex
      }
    },
    updateModifiedCap: function (alterIndex) {
      let capIndex = this.selectedDetailInfo['capIndex']
      let tokenIndex = this.selectedDetailInfo['tokenIndex']
      let tokensDetail = this.tokensDetailInfo[capIndex]
      let modifiedCap = this.modifiedCaptions[this.capSelected]
      let selectedTokenModifyTo = tokensDetail[tokenIndex]['tokenModifyTo']
      let targetStart = 0
      for (let i = 0; i < tokenIndex; i++) {
        //ignore blank space
        while (modifiedCap[targetStart] === ' ') {
          targetStart++
        }
        if (tokensDetail[i]['provideAlterWords']) {
          let tokenModifyTo = tokensDetail[i]['tokenModifyTo']
          if (this.varIsUndefined(tokenModifyTo)) {
            targetStart += tokensDetail[i]['token'].length
          } else {
            targetStart += tokensDetail[i]['alterWords'][tokenModifyTo].length
          }
        } else {
          targetStart += tokensDetail[i]['token'].length
        }
      }
      while (modifiedCap[targetStart] === ' ') {
        targetStart++
      }
      if (this.varIsUndefined(alterIndex)) {
        //recover to original token
        let oldToken =
          tokensDetail[tokenIndex]['alterWords'][selectedTokenModifyTo]
        let newToken = tokensDetail[tokenIndex]['token']
        this.modifiedCaptions[this.capSelected] =
          modifiedCap.substring(0, targetStart) +
          newToken +
          modifiedCap.substring(
            targetStart + oldToken.length,
            modifiedCap.length
          )
      } else {
        //modify to another token
        let oldToken = tokensDetail[tokenIndex]['token']
        if (!this.varIsUndefined(selectedTokenModifyTo)) {
          oldToken =
            tokensDetail[tokenIndex]['alterWords'][selectedTokenModifyTo]
        }
        let newToken = tokensDetail[tokenIndex]['alterWords'][alterIndex]
        this.modifiedCaptions[this.capSelected] =
          modifiedCap.substring(0, targetStart) +
          newToken +
          modifiedCap.substring(
            targetStart + oldToken.length,
            modifiedCap.length
          )
      }
    },
    addTokenToModifiedCap: function () {
      let inputValue = this.selectedDetailInfo['inputValue']
      if (!inputValue) {
        this.selectedDetailInfo['inputErrorSnackbar'] = true
        this.selectedDetailInfo['inputErrorMessage'] =
          'Empty input is not allowed!'
      } else if ((inputValue || '').indexOf(' ') >= 0) {
        this.selectedDetailInfo['inputErrorSnackbar'] = true
        this.selectedDetailInfo['inputErrorMessage'] =
          'Spaces are not allowed in the input!'
      } else {
        let tokenDetail = {}
        tokenDetail['token'] = inputValue
        tokenDetail['tokenModifyTo'] = undefined
        tokenDetail['provideAlterWords'] = false
        tokenDetail['alterWords'] = []
        this.tokensDetailInfo[this.selectedDetailInfo['capIndex']].splice(
          this.selectedDetailInfo['tokenIndex'] + 1,
          0,
          tokenDetail
        )
        this.resetSelectedDetailInfo(false)
        // this.selectedDetailInfo['inputToken'] = false
        // this.selectedDetailInfo['inputValue'] = ''
        // this.selectedDetailInfo['inputErrorSnackbar'] = false
        // this.selectedDetailInfo['inputErrorMessage'] = ''

        let capIndex = this.selectedDetailInfo['capIndex']
        let tokenIndex = this.selectedDetailInfo['tokenIndex']
        let tokensDetail = this.tokensDetailInfo[capIndex]
        let modifiedCap = this.modifiedCaptions[this.capSelected]
        let targetStart = 0
        for (let i = 0; i <= tokenIndex; i++) {
          //ignore blank space
          while (modifiedCap[targetStart] === ' ') {
            targetStart++
          }
          if (tokensDetail[i]['provideAlterWords']) {
            let tokenModifyTo = tokensDetail[i]['tokenModifyTo']
            if (this.varIsUndefined(tokenModifyTo)) {
              targetStart += tokensDetail[i]['token'].length
            } else {
              targetStart += tokensDetail[i]['alterWords'][tokenModifyTo].length
            }
          } else {
            targetStart += tokensDetail[i]['token'].length
          }
        }
        while (modifiedCap[targetStart] === ' ') {
          targetStart++
        }
        //add token to modified caption
        let addedToken = inputValue
        this.modifiedCaptions[this.capSelected] =
          modifiedCap.substring(0, targetStart) +
          addedToken +
          ' ' +
          modifiedCap.substring(targetStart, modifiedCap.length)
        this.resetSelectedDetailInfo(true)
      }
    },
    addTokenInFrontOfModifiedCap: function () {
      let inputValue = this.extraDetailInfo['inputValue']
      if (!inputValue) {
        this.extraDetailInfo['inputErrorSnackbar'] = true
        this.extraDetailInfo['inputErrorMessage'] =
          'Empty input is not allowed!'
      } else if ((inputValue || '').indexOf(' ') >= 0) {
        this.extraDetailInfo['inputErrorSnackbar'] = true
        this.extraDetailInfo['inputErrorMessage'] =
          'Spaces are not allowed in the input!'
      } else {
        let tokenDetail = {}
        tokenDetail['token'] = inputValue
        tokenDetail['tokenModifyTo'] = undefined
        tokenDetail['provideAlterWords'] = false
        tokenDetail['alterWords'] = []
        if (this.tokensDetailInfo[this.capSelected].length === 0) {
          this.tokensDetailInfo[this.capSelected].push(tokenDetail)
        } else {
          this.tokensDetailInfo[this.capSelected].splice(0, 0, tokenDetail)
        }
        let targetEnd = 0
        let modifiedCap = this.modifiedCaptions[this.capSelected]
        while (modifiedCap[targetEnd] === ' ') {
          targetEnd++
        }
        //add token in front of the modified caption
        this.modifiedCaptions[this.capSelected] =
          inputValue + ' ' + modifiedCap.substring(targetEnd)
        this.resetExtraDetailInfo()
        this.resetSelectedDetailInfo(true)
      }
    },
    deleteTokenFromModifiedCap: function (capIndex, tokenIndex) {
      let tokensDetail = this.tokensDetailInfo[capIndex]
      let modifiedCap = this.modifiedCaptions[this.capSelected]
      let targetStart = 0
      for (let i = 0; i < tokenIndex; i++) {
        //ignore blank space
        while (modifiedCap[targetStart] === ' ') {
          targetStart++
        }
        if (tokensDetail[i]['provideAlterWords']) {
          let tokenModifyTo = tokensDetail[i]['tokenModifyTo']
          if (this.varIsUndefined(tokenModifyTo)) {
            targetStart += tokensDetail[i]['token'].length
          } else {
            targetStart += tokensDetail[i]['alterWords'][tokenModifyTo].length
          }
        } else {
          targetStart += tokensDetail[i]['token'].length
        }
      }
      let targetEnd = targetStart
      while (modifiedCap[targetEnd] === ' ') {
        targetEnd++
      }
      if (this.varIsUndefined(tokensDetail[tokenIndex]['tokenModifyTo'])) {
        targetEnd += tokensDetail[tokenIndex]['token'].length
      } else {
        targetEnd +=
          tokensDetail[tokenIndex]['alterWords'][
            tokensDetail[tokenIndex]['tokenModifyTo']
          ].length
      }
      while (modifiedCap[targetEnd] === ' ') {
        targetEnd++
      }
      this.resetSelectedDetailInfo(true)
      if (tokenIndex === 0) {
        this.resetExtraDetailInfo()
      }
      //do not fill the blank with space when it comes to the first char in the modified caption
      let fillChar = ''
      if (targetStart) {
        fillChar = ' '
      }
      this.modifiedCaptions[this.capSelected] =
        modifiedCap.substring(0, targetStart) +
        fillChar +
        modifiedCap.substring(targetEnd, modifiedCap.length)
      this.tokensDetailInfo[capIndex].splice(tokenIndex, 1)
      // this.modifiedCaptions[this.capSelected] =
      //   modifiedCap.substring(0, targetStart) +
      //   fillChar +
      //   modifiedCap.substring(targetEnd, modifiedCap.length)
      // this.tokensDetailInfo[capIndex].splice(tokenIndex, 1)
    },
    resetSelectedDetailInfo: function (resetAll) {
      if (resetAll) {
        this.selectedDetailInfo['capIndex'] = undefined
        this.selectedDetailInfo['tokenIndex'] = undefined
        this.selectedDetailInfo['inputToken'] = false
        this.selectedDetailInfo['inputValue'] = ''
        this.selectedDetailInfo['inputErrorSnackbar'] = false
        this.selectedDetailInfo['inputErrorMessage'] = ''
      } else {
        this.selectedDetailInfo['inputToken'] = false
        this.selectedDetailInfo['inputValue'] = ''
        this.selectedDetailInfo['inputErrorSnackbar'] = false
        this.selectedDetailInfo['inputErrorMessage'] = ''
      }
    },
    resetExtraDetailInfo: function () {
      this.extraDetailInfo['capIndex'] = undefined
      this.extraDetailInfo['selected'] = false
      this.extraDetailInfo['inputValue'] = ''
      this.extraDetailInfo['inputErrorSnackbar'] = false
      this.extraDetailInfo['inputErrorMessage'] = ''
    }
    // tokenizeSentence: function (sentence, capSelected) {
    //   axios
    //     .get(this.baseUrl + 'tokenization?sentence=' + sentence)
    //     .then((response) => {
    //       this.capTokens[capSelected] = response.data['tokens']
    //     })
    // }
  }
}
</script>
