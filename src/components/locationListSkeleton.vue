<template>
  <div>
    <ul class="data-list">
      <li v-for="i in 6">
        <div class="text-box">
          <div class="img-box"></div>
          <div class="title-box"></div>
          <div class="icon-box"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.data-list{text-align: center;padding-top: 20px;}
.data-list li{float:left;margin:0 2% 1rem;width: 46%;height: 185px;background-color: #d2d2d2;list-style: none;position: relative;}
.text-box{width: 90%;margin:0 auto;}
.img-box{width: 100%;height:110px;background-color: #fff;margin-top: 10px;}
.title-box{width: 100%;height:20px;background-color: #fff;margin-top: 10px;}
.icon-box{width: 40%;height:15px;background-color: #fff;margin-top: 10px;}
</style>