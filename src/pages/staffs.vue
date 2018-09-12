<template>
  <div>

    <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;"
    :title="$t('staff management')"
    :left-options="{backText: '', showBack: true, preventGoBack: true}" @on-click-back="goUrl">
      <span slot="right" @click="showStaff(false)">
        <x-icon type="ios-plus-empty" size="40"  style="fill:#fff;position:relative;top:-10px;right:-8px;"></x-icon>
      </span>
    </x-header>

    <blank v-if="showBlank"></blank>

    <div class="head-pt">
      <group>
        <cell v-for="staff in staffs" :key="staff.id" :title="staff.name" :inline-desc="staff.grade ? $t('manager') : $t('staff')" is-link @click.native="showStaff(staff)">
          <div slot="icon" class="user-head" v-lazy:background-image="getImage(staff.photo)"></div>
        </cell>
      </group>
    </div>

    <div v-transfer-dom class="staffs-layer">
      <x-dialog v-model="showMessage" class="dialog-demo">
        <h4 class="layer-name">{{ $t('staff') }} <x-icon type="ios-close-empty" size="35" @click="showMessage=false"></x-icon></h4>
        <group class="staff-input">
          <x-input :title="$t('name')" :placeholder="$t('staff name')" placeholder-align="right" text-align="right" v-model="staffName" v-validate.initial="'required'" name="staff-name" :class="{'is-danger': errors_val.has('staff-name')}"></x-input>

          <x-input :title="$t('phone')" :placeholder="$t('phone number')" placeholder-align="right" text-align="right" v-model="staffPhone" v-validate.initial="'required'" name="staff-phone" :class="{'is-danger': errors_val.has('staff-phone')}">
            <span slot="right" mini @click="changeNation">
              <span class="nation-text">+{{ nation_code }}</span>
            </span>
          </x-input>


          <x-input :title="$t('email')" :placeholder="$t('email address')" placeholder-align="right" text-align="right" v-model="staffEmail"></x-input>
          <x-switch :title="$t('manager')" v-model="staffGrade"></x-switch>
        </group>
        <div class="layer-btn-lst">
          <div class="layer-btn-del" @click="showDelTips = true, showMessage = false" v-show="delBtn">Delete</div>

          <x-button :disabled="errors_val.has('staff-name') || errors_val.has('staff-phone')" @click.native="saveStaff" :class="{'layer-btn-save': true}" >
            <span>{{ $t('save')}}</span>
          </x-button>
          <!-- <div class="layer-btn-save" @click="saveStaff">Save</div> -->
        </div>
      </x-dialog>
    </div>

    <actionsheet v-model="showNation" :menus="nationCodeMenus" @on-click-menu="clickNation" show-cancel :cancel-text="$t('cancel')"></actionsheet>

    <div v-transfer-dom>
      <confirm
      v-model="showDelTips"
      :close-on-confirm="false"
      :confirm-text="$t('delete')"
      :cancel-text="$t('cancel')"
      @on-confirm="delStaff">
        <p style="text-align:center;">{{ $t('are you sure') }}</p>
      </confirm>
    </div>

    <div v-transfer-dom>
      <popup v-model="errPoint" position="bottom">
        <div class="err-point" v-text="errText"></div>
      </popup>
    </div>

  </div>
</template>

<script>
import { XHeader, Group, Cell, XDialog, XInput, XSwitch, XButton, Popup, Confirm, Actionsheet, TransferDomDirective as TransferDom } from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Group,
    Cell,
    XDialog,
    XInput,
    XSwitch,
    XButton,
    Popup,
    Confirm,
    Actionsheet,
    'Blank': () => import('@/components/blank')
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      if (this.$route.query.location_id){
        this.getStaffLst()
      }else{
        console.log(this.$route.query.location_id)
        this.$router.push({path: '/merchant/'+this.$route.params.system+'/home'})
      }
    },
    getStaffLst() {
      this.$ajax.post('/merchant/staffs', {
        location_id: this.$route.query.location_id
      })
      .then((res) => {
        console.log(res)
        this.staffs = res.data.data.staffs
        if (this.staffs.length == 0) {
          this.showBlank = true
        }else{
          this.showBlank = false
        }
      })
      .catch((err) => {
        console.log(err)
      })
    },
    changeNation() {
      this.showNation = true
    },
    clickNation(key, value) {
      if (value){
        this.nation_code = key
      }
    },
    showStaff(staff) {
      if (staff){
        this.showMessage = true
        this.delBtn = true
        this.staffId = staff.id
        this.staffName = staff.name
        let phoneArr = staff.phone.split('-')
        this.nation_code = parseInt(phoneArr[0]) || 86
        this.staffPhone = phoneArr[1]
        this.staffEmail = staff.email
        this.staffGrade = staff.grade == 1 ? true : false

      }else{
        this.showMessage = true
        this.delBtn = false
        this.staffId = null
        this.staffName = ''
        this.nation_code = 86
        this.staffPhone = ''
        this.staffEmail = ''
        this.staffGrade = false
      }

      console.log(staff)
    },
    getImage(url) {
      if (url){
        return url.substring(0,url.lastIndexOf('.'))+'_s'+url.substring(url.lastIndexOf('.'))
      }
    },
    goUrl() {
      this.$router.push({
        path: '/merchant/'+this.$route.params.system+'/locations',
        query: {'location_id': this.$route.query.location_id}
      })
    },
    saveStaff() {
      this.$vux.loading.show({text: this.$t('loading')})
      let postData = {
        location_id: this.$route.query.location_id,
        name: this.staffName,
        nation_code: this.nation_code,
        phone: this.staffPhone,
        email: this.staffEmail,
        grade: this.staffGrade ? 1 : 0
      }

      if (this.staffId){
        postData.staff_id = this.staffId
        this.$ajax.post('/merchant/staff/update', postData)
        .then((res) => {
          console.log(res)
          this.$vux.loading.hide()
          if(res.data.code === 0){
            this.$vux.toast.show({text: this.$t('success')})
            this.getStaffLst()
            this.showMessage = false
          }else{
            this.showMessage = false
            this.errPoint = true
            this.errText = this.$t('error.code.'+res.data.code)
          }

        })
        .catch((err) => {
          this.$vux.loading.hide()
          this.$vux.toast.show({text: this.$t('fail'), type: "warn"})
          console.log(err)
        })

      }else{
        this.$ajax.post('/merchant/staff/new', postData)
        .then((res) => {
          console.log(res)
          this.$vux.loading.hide()
          if(res.data.code === 0){
            this.$vux.toast.show({text: this.$t('success')})
            this.getStaffLst()
            this.showMessage = false
            this.showBlank = false
          }else{
            this.showMessage = false
            this.errPoint = true
            this.errText = this.$t('error.code.'+res.data.code)
          }
        })
        .catch((err) => {
          this.$vux.loading.hide()
          this.$vux.toast.show({text: this.$t('fail'), type: "warn"})
          console.log(err)
        })
      }
    },
    delStaff() {
      let postData = {
        location_id: this.$route.query.location_id,
        staff_id: this.staffId
      }
      this.$ajax.post('/merchant/staff/delete', postData)
      .then((res) => {
        console.log(res)
        this.$vux.loading.hide()
        if(res.data.code === 0){
          this.$vux.toast.show({text: this.$t('success')})
          this.getStaffLst()
          this.showMessage = false
          this.showDelTips = false
        }else{
          this.showDelTips = false
          this.errPoint = true
          this.errText = this.$t('error.code.'+res.data.code)
        }
      })
      .catch((err) => {
        this.showDelTips = false
        this.$vux.loading.hide()
        this.$vux.toast.show({text: this.$t('fail'), type: "warn"})
        console.log(err)
      })
    }
  },
  data () {
    return {
      errPoint: false,
      errText: '',
      staffs: [],
      showBlank: false,
      showMessage: false,
      staffId: '',
      staffName: '',
      staffPhone: '',
      staffEmail: '',
      staffGrade: 0,
      delBtn: false,
      showDelTips: false,
      showNation: false,
      nation_code: 86,
      nationCodeMenus: {
        86: '+86',
        852: '+852'
      }
    }
  }
}
</script>

<style>
.staffs-layer .weui-dialog{width: 100%;}
.staffs-layer .weui-dialog__bd{padding: 0;}
.staffs-layer .weui-cells{margin-top: 0;}
.staffs-layer .weui-label{text-align: left;}
.staffs-layer .vux-x-icon{fill:#3399ff;}

.staff-input input[type='text']{font-size: 14px;}
.staff-input label.weui-label,.staff-input label.vux-label{font-size: 14px;}
.staff-input .vux-popup-picker-value,.staff-input .vux-popup-picker-placeholder{font-size: 14px;}
</style>

<style scoped>
.user-head{margin-right:10px;width: 50px;height: 50px;border-radius: 50%;background-position: center center;background-repeat: no-repeat;-webkit-background-size:cover;-moz-background-size:cover;background-size:cover;}

.layer-name{margin:10px auto;font-size:20px;position: relative;}
.layer-name svg{position: absolute;right: 10px;}
.layer-btn-lst{overflow: hidden;text-align: center;margin:10px auto;}
.layer-btn-del{display: inline-block;width: 100px;height: 35px;line-height:35px;background-color: #ff3333;color:#fff;margin:0 5px;border-radius: 5px;}
.layer-btn-save{display: inline-block;width: 100px;height: 35px;line-height:35px;background-color: #3399ff;color:#fff;margin:0 5px;border-radius: 5px;}
.nation-text{color:#333;font-weight: bold;padding-left: 10px;}
</style>
